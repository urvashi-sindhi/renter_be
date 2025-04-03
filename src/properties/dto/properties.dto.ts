import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Sharing } from 'src/libs/utils/enum';

export class AddPropertyImagesDto {
  @ApiProperty({
    example: 'food.png',
    type: 'string',
    format: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  image: string;
}

export class AddPropertyDto {
  @ApiProperty({
    example: 1,
    type: 'number',
    format: 'number',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  area_id: number;

  @ApiProperty({
    example: 1,
    type: 'number',
    format: 'number',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  landlord_id: number;

  @ApiProperty({
    example: 1,
    type: 'number',
    format: 'number',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  address_id: number;

  @ApiProperty({
    example: 'Dev Paradies',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Add description',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'Single',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsEnum(Sharing)
  @IsString()
  @IsNotEmpty()
  sharing_count: string;

  @ApiProperty({
    example: true,
    type: 'boolean',
    format: 'boolean',
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  food_availability: boolean;

  @ApiProperty({
    example: 'Ac Facility',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  facility: string;

  @ApiProperty({
    example: true,
    type: 'boolean',
    format: 'boolean',
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  ac_availability: boolean;

  @ApiProperty({
    example: 10,
    type: 'number',
    format: 'number',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  rent_price: number;

  @ApiProperty({ type: [AddPropertyImagesDto], required: false })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => AddPropertyImagesDto)
  @IsOptional()
  propertyImage: AddPropertyImagesDto[];
}

export class listOfPropertiesDto {
  @ApiProperty({
    example: 1,
    type: 'number',
    format: 'number',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  area_id: number;

  @ApiProperty({
    example: 'ASC',
    type: 'string',
    format: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  sortValue: string;

  @ApiProperty({
    example: 'id',
    type: 'string',
    format: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  sortKey: string;

  @ApiProperty({
    example: 10,
    type: 'number',
    format: 'number',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  pageSize: number;

  @ApiProperty({
    example: 1,
    type: 'number',
    format: 'number',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiProperty({
    example: 'Raj',
    type: 'string',
    format: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  searchBar: string;
}
