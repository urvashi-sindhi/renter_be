import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { GeneralResponse } from 'src/libs/helpers/handleResponse';
import { User } from 'src/libs/models/user.model';
import { ResponseStatus, Role } from 'src/libs/utils/enum';
import { Messages } from 'src/libs/utils/message';
import { LoginUserDto, RegisterUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Address } from 'src/libs/models/address.model';
import { Area } from 'src/libs/models/area.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Address) private readonly addressModel: typeof Address,
    @InjectModel(Area) private readonly areaModel: typeof Area,
    private readonly jwt: JwtService,
  ) {}

  async listOfAreas() {
    const areaData = await this.areaModel.findAll({
      attributes: ['id', 'name'],
    });

    Logger.log(`Area is ${Messages.GET_SUCCESS}`);
    return GeneralResponse(
      HttpStatus.OK,
      ResponseStatus.SUCCESS,
      undefined,
      areaData || [],
    );
  }

  async registerUser(dto: RegisterUserDto) {
    const { email, password, phone_number, address, ...rest } = dto;
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

    const createAddress = await this.addressModel.create({
      country_id: 1,
      state_id: 1,
      city_id: 1,
      area_id: address.area_id,
      address_line1: address.address_line1,
      address_line2: address.address_line2,
      pin_code: address.pin_code,
    } as Address);

    const createUser = await this.userModel.create({
      phone_number,
      email,
      ...rest,
      password: hashedPassword,
      address_id: createAddress.id,
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
