import { DataTypes, Sequelize } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';
import { MaxLength } from 'class-validator';
import { Role } from '../utils/enum';
import { Address } from './address.model';

@Table({ tableName: 'user' })
export class User extends Model<User> {
  @ForeignKey(() => Address)
  @MaxLength(11)
  @Column({ allowNull: false })
  address_id: number;

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
  @Default(Role.RENTER)
  @Column({
    type: DataTypes.ENUM(Role.RENTER, Role.LANDLORD),
  })
  role: string;

  @AllowNull(true)
  @Column
  device_token: string;

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

  @BelongsTo(() => Address)
  address: Address;
}
