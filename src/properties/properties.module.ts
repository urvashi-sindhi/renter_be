import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Properties } from 'src/libs/models/properties.model';
import { PropertyImage } from 'src/libs/models/propertyImages.model';
import { User } from 'src/libs/models/user.model';
import { Address } from 'src/libs/models/address.model';
import { Area } from 'src/libs/models/area.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Properties,
      PropertyImage,
      User,
      Address,
      Area,
    ]),
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService],
})
export class PropertiesModule {}
