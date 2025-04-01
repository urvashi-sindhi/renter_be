import { DataTypes, Sequelize } from 'sequelize';
import {
  AllowNull,
  Column,
  Default,
  ForeignKey,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';
import { MaxLength } from 'class-validator';
import { Role } from '../utils/enum';
import { User } from './user.model';

@Table({ tableName: 'properties' })
export class Properties extends Model<Properties> {
  @ForeignKey(() => User)
  @MaxLength(11)
  @Column({ allowNull: false })
  landlord_id: number;

  @AllowNull(false)
  @MaxLength(50)
  @Column
  name: string;

  @AllowNull(false)
  @Column({ type: DataTypes.TEXT })
  description: string;

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
}
