import { Sequelize } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { MaxLength } from 'class-validator';
import { State } from './state.model';
import { Country } from './country.model';
import { City } from './city.model';
import { User } from './user.model';

@Table({ tableName: 'address' })
export class Address extends Model<Address> {
  @ForeignKey(() => Country)
  @MaxLength(11)
  @Column({ allowNull: false })
  country_id: number;

  @ForeignKey(() => State)
  @MaxLength(11)
  @Column({ allowNull: false })
  state_id: number;

  @ForeignKey(() => City)
  @MaxLength(11)
  @Column({ allowNull: false })
  city_id: number;

  @AllowNull(false)
  @MaxLength(20)
  @Column
  address: string;

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

  @BelongsTo(() => Country)
  country: Country;

  @BelongsTo(() => State)
  state: State;

  @BelongsTo(() => City)
  city: City;

  @HasOne(() => User, { foreignKey: 'address_id' })
  user: User;
}
