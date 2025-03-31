import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { handleResponse } from 'src/libs/helpers/handleResponse';
import { User } from 'src/libs/models/user.model';
import { ResponseStatus } from 'src/libs/utils/enum';
import { Messages } from 'src/libs/utils/message';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async listUsers() {
    const usersList = await this.userModel.findAll();

    if (usersList.length === 0) {
      Logger.error(`Users ${Messages.NOT_FOUND}`);
      return handleResponse(
        HttpStatus.NOT_FOUND,
        ResponseStatus.ERROR,
        `Users ${Messages.NOT_FOUND}`,
      );
    }
    Logger.log(`User ${Messages.GET_SUCCESS}`);
    return handleResponse(
      HttpStatus.OK,
      ResponseStatus.SUCCESS,
      undefined,
      usersList,
    );
  }
}
