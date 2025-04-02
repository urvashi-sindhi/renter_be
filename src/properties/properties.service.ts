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
import { AddPropertyDto } from './dto/properties.dto';
@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Properties)
    private readonly propertiesModel: typeof Properties,
    @InjectModel(PropertyImage)
    private readonly propertyImageModel: typeof PropertyImage,
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Address) private readonly addressModel: typeof Address,
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
}
