import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiTag } from 'src/libs/utils/enum';
import { LoginUserDto, RegisterUserDto } from './dto/user.dto';

@ApiTags(ApiTag.USER)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Post('registerUser')
  registerUser(@Body() dto: RegisterUserDto) {
    return this.userService.registerUser(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('loginUser')
  loginUser(@Body() dto: LoginUserDto) {
    return this.userService.loginUser(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('listOfUsers')
  listOfUsers() {
    return this.userService.listUsers();
  }
}
