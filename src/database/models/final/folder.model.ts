import { Table, PrimaryKey, Column, DataType, Model, Default, BelongsToMany, HasMany } from 'sequelize-typescript';
import { MMUserFolder } from '../relations/mm-user-folder.model';
import { Task } from './task.model';
import { User } from './user.model';

@Table({ timestamps: true })
export class Folder extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  id: string;

  @Column
  name: string;

  @HasMany(() => Task, {
    foreignKey: 'folderId',
  })
  taskList: Task[];

  @BelongsToMany(() => User, () => MMUserFolder)
  userList: Array<User & { MMUserFolder: MMUserFolder }>;
}
