import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as dotenv from 'dotenv';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './user/user.module';
dotenv.config();

const config: any = {
  dialect: 'mysql',
  autoLoadModels: true,
  models: [],
  define: {
    timestamps: false,
  },
};
@Module({
  imports: [
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
  providers: [AppService],
})
export class AppModule {}
