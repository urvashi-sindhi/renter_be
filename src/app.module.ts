import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as dotenv from 'dotenv';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './user/user.module';
import { User } from './libs/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { City } from './libs/models/city.model';
import { State } from './libs/models/state.model';
import { Country } from './libs/models/country.model';
import { Address } from './libs/models/address.model';
dotenv.config();

const config: any = {
  dialect: 'mysql',
  autoLoadModels: true,
  models: [User, City, State, Country, Address],
  define: {
    timestamps: false,
  },
};
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      ...config,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      logging: true,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {}
