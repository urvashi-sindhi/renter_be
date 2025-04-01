import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/libs/models/user.model';
import { JwtStrategy } from 'src/libs/services/strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { Address } from 'src/libs/models/address.model';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Address]),
    JwtModule.register({
      secret: process.env.JWTSecretKey,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
})
export class UserModule {}
