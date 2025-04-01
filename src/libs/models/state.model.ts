import { Sequelize } from 'sequelize';
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
import { Country } from './country.model';
import { City } from './city.model';
import { Address } from './address.model';

@Table({ tableName: 'state' })
export class State extends Model<State> {
  @ForeignKey(() => Country)
  @MaxLength(11)
  @Column({ allowNull: false })
  country_id: number;

  @AllowNull(false)
  @MaxLength(20)
  @Column
  name: string;

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

  @HasMany(() => City, { foreignKey: 'state_id' })
  city: City[];

  @HasMany(() => Address, { foreignKey: 'state_id' })
  address: Address[];
}
