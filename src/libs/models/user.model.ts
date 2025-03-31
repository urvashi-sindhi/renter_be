import { DataTypes, Sequelize } from 'sequelize';
import {
  AllowNull,
  Column,
  Default,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';
import { MaxLength } from 'class-validator';
import { Role } from '../utils/enum';

@Table({ tableName: 'user' })
export class User extends Model<User> {
  @AllowNull(false)
  @MaxLength(20)
  @Column
  first_name: string;

  @AllowNull(false)
  @MaxLength(20)
  @Column
  last_name: string;

  @AllowNull(false)
  @MaxLength(30)
  @Unique
  @Column
  email: string;

  @AllowNull(false)
  @Column
  phone_number: string;

  @AllowNull(true)
  @MaxLength(250)
  @Column
  password: string;

  @AllowNull(false)
  @Column({
    type: DataTypes.ENUM(Role.RENTER, Role.LANDLORD),
  })
  role: string;

  @Default(Sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: 'TIMESTAMP' })
  created_at: Date;

  @Default(Sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal(
      'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
    ),
  })
  updated_at: Date;
}
