import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { Role } from 'src/libs/utils/enum';

export class RegisterUserDto {
  @ApiProperty({
    example: 'John',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    example: 'Deo',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    example: 'John@gmail.com',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '8982354859',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, {
    message: 'Mobile number must be exactly 10 digits',
  })
  phone_number: string;

  @ApiProperty({
    example: 'John@123',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'Landlord',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsEnum({
    Renter: Role.RENTER,
    Landlord: Role.LANDLORD,
  })
  @IsString()
  @IsNotEmpty()
  role: string;
}

export class LoginUserDto {
  @ApiProperty({
    example: 'Landlord',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsEnum({
    Renter: Role.RENTER,
    Landlord: Role.LANDLORD,
  })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({
    example: 'john@gmail.com',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'john@123',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
