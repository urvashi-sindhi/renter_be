import { Sequelize } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { MaxLength } from 'class-validator';
import { Properties } from './properties.model';

@Table({ tableName: 'property_image' })
export class PropertyImage extends Model<PropertyImage> {
  @ForeignKey(() => Properties)
  @MaxLength(11)
  @Column({ allowNull: false })
  property_id: number;

  @AllowNull(true)
  @MaxLength(50)
  @Column
  image: string;

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

  @BelongsTo(() => Properties)
  properties: Properties;
}
