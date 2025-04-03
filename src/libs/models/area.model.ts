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
import { Address } from './address.model';
import { Properties } from './properties.model';

@Table({ tableName: 'area' })
export class Area extends Model<Area> {
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

  @HasMany(() => Address, { foreignKey: 'area_id' })
  address: Address[];

  @HasMany(() => Properties, { foreignKey: 'area_id' })
  properties: Properties[];
}
