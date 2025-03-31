import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiTag } from 'src/libs/utils/enum';

@ApiTags(ApiTag.USER)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get('listOfUsers')
  listOfUsers() {
    return this.userService.listUsers();
  }
}
