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
import { paginateWithData, sorting } from 'src/libs/helpers/commanFunction';
import { Area } from 'src/libs/models/area.model';
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
    const { propertyImage, ...rest } = dto;

    const addProperty = await this.propertiesModel.create({
      ...rest,
    } as Properties);

    if (propertyImage) {
      for (let images of propertyImage) {
        await this.propertyImageModel.create({
          image: images.image,
          property_id: addProperty.id,
        } as PropertyImage);
      }
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
    const { sortKey, sortValue, searchBar, page, pageSize } = dto;

    const sortQuery = sorting(sortKey, sortValue);

    const whereCondition: any = {
      where: { area_id: dto.area_id },
      attributes: {
        exclude: ['created_at', 'updated_at'],
      },
      include: [
        {
          model: this.userModel,
          require: true,
          attributes: ['id', 'first_name', 'last_name'],
        },
        {
          model: this.areaModel,
          require: true,
          attributes: ['id', 'name'],
        },
        {
          model: this.addressModel,
          require: true,
          attributes: {
            exclude: ['created_at', 'updated_at'],
          },
        },
      ],
      order: sortQuery,
    };

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

    Logger.log(`Property ${Messages.GET_SUCCESS}`);
    return GeneralResponse(
      HttpStatus.OK,
      ResponseStatus.SUCCESS,
      undefined,
      paginatedResult.propertyDetails,
    );
  }
}
