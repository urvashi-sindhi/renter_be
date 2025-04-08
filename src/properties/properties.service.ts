import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Properties } from 'src/libs/models/properties.model';
import { PropertyImage } from 'src/libs/models/propertyImages.model';
import { Messages } from 'src/libs/utils/message';
import { GeneralResponse } from 'src/libs/helpers/handleResponse';
import { ResponseStatus } from 'src/libs/utils/enum';
import { FileUploadDto } from './dto/fileUpload.dto';
import { User } from 'src/libs/models/user.model';
import { Address } from 'src/libs/models/address.model';
import { AddPropertyDto, listOfPropertiesDto } from './dto/properties.dto';
import { Op, Sequelize } from 'sequelize';
import { Area } from 'src/libs/models/area.model';
import {
  paginateWithData,
  sendFCMNotification,
  sorting,
} from 'src/libs/helpers/commanFunction';
import { Notification } from 'src/libs/models/notification.model';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}
@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Properties)
    private readonly propertiesModel: typeof Properties,
    @InjectModel(PropertyImage)
    private readonly propertyImageModel: typeof PropertyImage,
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Address) private readonly addressModel: typeof Address,
    @InjectModel(Area) private readonly areaModel: typeof Area,
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,
  ) {}

  async fileUpload(
    req: any,
    property_image: Express.Multer.File[],
    dto: FileUploadDto,
  ) {
    if (property_image.length === 0) {
      Logger.error(Messages.IMAGE_REQUIRE);
      return GeneralResponse(
        HttpStatus.BAD_REQUEST,
        ResponseStatus.ERROR,
        Messages.IMAGE_REQUIRE,
      );
    }

    let propertyImage: any = [];

    if (req.files) {
      propertyImage = property_image.map((images: any) => {
        return {
          image: images.filename,
        };
      });
    }

    if (propertyImage.length > 0) {
      Logger.log(`Property image ${Messages.ADDED_SUCCESS}`);
      return GeneralResponse(
        HttpStatus.CREATED,
        ResponseStatus.SUCCESS,
        `Property image ${Messages.ADDED_SUCCESS}`,
        propertyImage,
      );
    }
  }

  async addProperties(dto: AddPropertyDto) {
    const { propertyImage, address, ...rest } = dto;

    const createAddress = await this.addressModel.create({
      country_id: 1,
      state_id: 1,
      city_id: 1,
      area_id: address.area_id,
      address_line1: address.address_line1,
      address_line2: address.address_line2,
      pin_code: address.pin_code,
    } as Address);

    const addProperty = await this.propertiesModel.create({
      ...rest,
      address_id: createAddress.id,
    } as Properties);

    if (propertyImage) {
      for (let images of propertyImage) {
        await this.propertyImageModel.create({
          image: images.image,
          property_id: addProperty.id,
        } as PropertyImage);
      }
    }

    const users = await this.userModel.findAll({
      where: {
        device_token: { [Op.not]: null as unknown as string },
      },
      attributes: ['id', 'device_token'],
    });

    const deviceTokens = users.map((user) => user?.dataValues?.device_token);

    let notificationTitle = 'New Properties';

    let notificationBody = `${dto.name} - ${dto.description}`;

    await sendFCMNotification(
      deviceTokens,
      notificationTitle,
      notificationBody,
    );

    for (const user of users) {
      await this.notificationModel.create({
        user_id: user.id,
        title: notificationTitle,
        description: notificationBody,
      } as Notification);
    }

    Logger.log(`Property ${Messages.ADDED_SUCCESS}`);
    return GeneralResponse(
      HttpStatus.CREATED,
      ResponseStatus.SUCCESS,
      `Property ${Messages.ADDED_SUCCESS}`,
      { id: addProperty.id },
    );
  }

  async listOfProperties(dto: listOfPropertiesDto) {
    const { sortKey, sortValue, searchBar, page, pageSize, area } = dto;

    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const sortQuery = sorting(sortKey, sortValue);

    const whereCondition: any = {
      attributes: {
        exclude: ['created_at', 'updated_at'],
      },
      include: [
        {
          model: this.addressModel,
          required: true,
          attributes: {
            exclude: ['created_at', 'updated_at'],
          },
        },
        {
          model: this.propertyImageModel,
          required: false,
          attributes: ['id', 'image'],
        },
        {
          model: this.userModel,
          required: true,
          attributes: ['id', 'first_name', 'last_name'],
        },
        {
          model: this.areaModel,
          required: true,
          attributes: ['id', 'name'],
        },
      ],
      offset,
      limit,
      order: sortQuery,
    };

    if (area) {
      whereCondition.where = {
        area_id: {
          [Op.in]: area?.map((a) => a.area_id) || [],
        },
      };
    }

    if (searchBar) {
      whereCondition.where[Op.or] = [
        { name: { [Op.like]: `%${searchBar}%` } },
        { description: { [Op.like]: `%${searchBar}%` } },
        { sharing_count: { [Op.like]: `%${searchBar}%` } },
        { food_availability: { [Op.like]: `%${searchBar}%` } },
        { facility: { [Op.like]: `%${searchBar}%` } },
        { ac_availability: { [Op.like]: `%${searchBar}%` } },
        {
          rent_price: {
            [Op.or]: [
              { [Op.eq]: searchBar },
              Sequelize.where(
                Sequelize.cast(Sequelize.col('rent_price'), 'TEXT'),
                { [Op.like]: `%${searchBar}%` },
              ),
            ],
          },
        },
        { '$user.first_name$': { [Op.like]: `%${searchBar}%` } },
        { '$user.last_name$': { [Op.like]: `%${searchBar}%` } },
        { '$area.name$': { [Op.like]: `%${searchBar}%` } },
      ];
    }

    const paginatedResult = await paginateWithData(
      this.propertiesModel,
      page,
      pageSize,
      whereCondition,
      'propertyDetails',
    );

    if (paginatedResult.propertyDetails.length === 0) {
      Logger.log(`Property ${Messages.NOT_FOUND}`);
      return GeneralResponse(
        HttpStatus.NOT_FOUND,
        ResponseStatus.ERROR,
        `Property ${Messages.NOT_FOUND}`,
      );
    }

    const responseData = {
      propertyData: paginatedResult.propertyDetails,
      totalItems: paginatedResult.propertyDetails.length,
      totalPages:
        Math.ceil(paginatedResult.propertyDetails.length / pageSize) || 1,
      currentPage: page,
      pageSize: pageSize || 10,
      numberOfRows: paginatedResult.propertyDetails.length,
    };

    Logger.log(`Property ${Messages.GET_SUCCESS}`);
    return GeneralResponse(
      HttpStatus.OK,
      ResponseStatus.SUCCESS,
      undefined,
      responseData,
    );
  }

  async viewProperty(propertyId: number) {
    const propertyData = await this.propertiesModel.findOne({
      where: { id: propertyId },
      attributes: {
        exclude: ['created_at', 'updated_at'],
      },
      include: [
        {
          model: this.propertyImageModel,
          required: false,
          attributes: ['id', 'image'],
        },
        {
          model: this.userModel,
          required: true,
          attributes: ['id', 'first_name', 'last_name'],
        },
        {
          model: this.areaModel,
          required: true,
          attributes: ['id', 'name'],
        },
        {
          model: this.addressModel,
          required: true,
          attributes: {
            exclude: ['created_at', 'updated_at'],
          },
        },
      ],
    });

    if (!propertyData) {
      Logger.error(`Property ${Messages.NOT_FOUND}`);
      return GeneralResponse(
        HttpStatus.NOT_FOUND,
        ResponseStatus.ERROR,
        `Property ${Messages.NOT_FOUND}`,
      );
    }

    Logger.error(`Property ${Messages.NOT_FOUND}`);
    return GeneralResponse(
      HttpStatus.OK,
      ResponseStatus.SUCCESS,
      undefined,
      propertyData,
    );
  }

  async listOfNotifications(req: any) {
    const notificationData = await this.notificationModel.findAll({
      attributes: ['id', 'user_id', 'title', 'description', 'created_at'],
      where: { user_id: req.user.id, read: false },
    });

    if (notificationData.length === 0) {
      Logger.error(`Notification data ${Messages.NOT_FOUND}`);
      return GeneralResponse(
        HttpStatus.NOT_FOUND,
        ResponseStatus.ERROR,
        `Notification data ${Messages.NOT_FOUND}`,
        notificationData,
      );
    }
    Logger.log(`Notification ${Messages.GET_SUCCESS}`);
    return GeneralResponse(
      HttpStatus.OK,
      ResponseStatus.SUCCESS,
      undefined,
      notificationData,
    );
  }
}
