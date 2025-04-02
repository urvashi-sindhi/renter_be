import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { AddPropertyDto, listOfPropertiesDto } from './dto/properties.dto';
import { FileUploadDto } from './dto/fileUpload.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { storage } from 'src/libs/helpers/multer';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10, { storage: storage }))
  @Post('fileUpload')
  fileUpload(
    @Req() req: any,
    @UploadedFiles() property_image: Express.Multer.File[],
    @Body() dto: FileUploadDto,
  ) {
    return this.propertiesService.fileUpload(req, property_image, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('addProperty')
  addProperty(@Body() dto: AddPropertyDto) {
    return this.propertiesService.addProperties(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('listOfProperties')
  listOfProperty(@Body() dto: listOfPropertiesDto) {
    return this.propertiesService.listOfProperties(dto);
  }
}
