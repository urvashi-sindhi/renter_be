import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GeneralResponse } from 'src/libs/helpers/handleResponse';
import { User } from 'src/libs/models/user.model';
import { ResponseStatus, Role } from 'src/libs/utils/enum';
import { Messages } from 'src/libs/utils/message';
import { LoginUserDto, RegisterUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly jwt: JwtService,
  ) {}

  async registerUser(dto: RegisterUserDto) {
    const { email, password, phone_number } = dto;
    const salt = 10;

    const existingUser = await this.userModel.findOne({ where: { email } });

    if (existingUser) {
      Logger.error(`User ${Messages.ALREADY_EXIST}`);
      return GeneralResponse(
        HttpStatus.BAD_REQUEST,
        ResponseStatus.ERROR,
        `User ${Messages.ALREADY_EXIST}`,
      );
    }

    const phoneExists = await this.userModel.findOne({
      where: { phone_number },
    });

    if (phoneExists) {
      Logger.error(`Phone number ${Messages.ALREADY_EXIST}`);
      return GeneralResponse(
        HttpStatus.BAD_REQUEST,
        ResponseStatus.ERROR,
        `Phone number ${Messages.ALREADY_EXIST}`,
      );
    }

    const hashedPassword: string = await bcrypt.hash(password, salt);

    const createUser = await this.userModel.create({
      ...dto,
      password: hashedPassword,
    } as User);

    Logger.log(Messages.REGISTER_SUCCESS);
    return GeneralResponse(
      HttpStatus.CREATED,
      ResponseStatus.SUCCESS,
      Messages.REGISTER_SUCCESS,
      {
        id: createUser.id,
      },
    );
  }

  async loginUser(dto: LoginUserDto) {
    const findUser = await this.userModel.findOne({
      where: {
        email: dto.email,
      },
    });

    if (!findUser) {
      Logger.error(Messages.CREDENTIALS_NOT_MATCH);
      return GeneralResponse(
        HttpStatus.NOT_FOUND,
        ResponseStatus.ERROR,
        Messages.CREDENTIALS_NOT_MATCH,
      );
    }

    const comparePassword = await bcrypt.compare(
      dto.password,
      findUser?.dataValues.password,
    );

    if (!comparePassword) {
      Logger.error(Messages.CREDENTIALS_NOT_MATCH);
      return GeneralResponse(
        HttpStatus.UNAUTHORIZED,
        ResponseStatus.ERROR,
        Messages.CREDENTIALS_NOT_MATCH,
      );
    }

    const token = await this.jwt.signAsync({
      id: findUser?.dataValues.id,
      email: findUser?.dataValues.email,
    });

    Logger.log(Messages.LOGIN_SUCCESS);
    return GeneralResponse(
      HttpStatus.OK,
      ResponseStatus.SUCCESS,
      Messages.LOGIN_SUCCESS,
      { token },
    );
  }

  async listUsers() {
    const usersList = await this.userModel.findAll();

    if (usersList.length === 0) {
      Logger.error(`Users ${Messages.NOT_FOUND}`);
      return GeneralResponse(
        HttpStatus.NOT_FOUND,
        ResponseStatus.ERROR,
        `Users ${Messages.NOT_FOUND}`,
      );
    }
    Logger.log(`User ${Messages.GET_SUCCESS}`);
    return GeneralResponse(
      HttpStatus.OK,
      ResponseStatus.SUCCESS,
      undefined,
      usersList,
    );
  }
}
