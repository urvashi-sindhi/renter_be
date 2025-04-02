import { DataTypes, Sequelize } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { MaxLength } from 'class-validator';
import { Sharing } from '../utils/enum';
import { User } from './user.model';
import { Address } from './address.model';
import { PropertyImage } from './propertyImages.model';

@Table({ tableName: 'properties' })
export class Properties extends Model<Properties> {
  @ForeignKey(() => User)
  @MaxLength(11)
  @Column({ allowNull: false })
  landlord_id: number;

  @ForeignKey(() => Address)
  @MaxLength(11)
  @Column({ allowNull: false })
  address_id: number;

  @AllowNull(false)
  @MaxLength(50)
  @Column
  name: string;

  @AllowNull(false)
  @Column({ type: DataTypes.TEXT })
  description: string;

  @AllowNull(false)
  @Column({
    type: DataTypes.ENUM(Sharing.SINGLE, Sharing.DOUBLE, Sharing.TRIPLE),
  })
  sharing_count: string;

  @Column({ defaultValue: false })
  food_availability: boolean;

  @AllowNull(false)
  @Column({
    type: DataTypes.TEXT,
  })
  facility: string;

  @Column({ defaultValue: false })
  ac_availability: boolean;

  @Column({ type: DataTypes.FLOAT })
  rent_price: number;

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

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => PropertyImage, { foreignKey: 'property_id' })
  propertyImage: PropertyImage;
}
