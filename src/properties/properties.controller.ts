import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { FileUploadDto } from './dto/fileUpload.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { storage } from 'src/libs/helpers/multer';
import { AddPropertyDto } from './dto/properties.dto';
import { Roles } from 'src/libs/services/decorator/auth/roles.decorator';
import { JwtGuard } from 'src/libs/services/guards/jwt.guard';
import { RolesGuard } from 'src/libs/services/guards/roles.guard';
import { Role } from 'src/libs/utils/enum';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Roles(Role.LANDLORD)
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth()
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

  @Roles(Role.LANDLORD)
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post('addProperty')
  addProperty(@Body() dto: AddPropertyDto) {
    return this.propertiesService.addProperties(dto);
  }
}
