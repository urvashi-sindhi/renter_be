import { Sequelize } from 'sequelize';
import {
  AllowNull,
  Column,
  Default,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { MaxLength } from 'class-validator';
import { State } from './state.model';
import { Address } from './address.model';

@Table({ tableName: 'country' })
export class Country extends Model<Country> {
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

  @HasMany(() => State, { foreignKey: 'country_id' })
  state: State[];

  @HasMany(() => Address, { foreignKey: 'country_id' })
  address: Address[];
}
