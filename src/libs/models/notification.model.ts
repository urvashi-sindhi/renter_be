import { DataTypes, Sequelize } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';
import { MaxLength } from 'class-validator';

@Table({ tableName: 'notification' })
export class Notification extends Model<Notification> {
  @ForeignKey(() => User)
  @AllowNull(true)
  @Column
  @MaxLength(11)
  user_id: number;

  @AllowNull(false)
  @Column
  title: string;

  @AllowNull(false)
  @Column({ type: DataTypes.TEXT })
  description: string;

  @Column({ defaultValue: false })
  read: boolean;

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

  @BelongsTo(() => User, { foreignKey: 'user_id' })
  user: User;
}
