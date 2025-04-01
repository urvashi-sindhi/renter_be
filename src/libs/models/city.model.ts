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
import { State } from './state.model';
import { Address } from './address.model';

@Table({ tableName: 'city' })
export class City extends Model<City> {
  @ForeignKey(() => State)
  @MaxLength(11)
  @Column({ allowNull: false })
  state_id: number;

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

  @BelongsTo(() => State)
  state: State;

  @HasMany(() => Address, { foreignKey: 'city_id' })
  address: Address[];
}
