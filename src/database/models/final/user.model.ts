import { Table, PrimaryKey, Column, Model, AllowNull, BelongsToMany } from 'sequelize-typescript';
import { MMUserFolder } from '../relations/mm-user-folder.model';
import { Folder } from './folder.model';

@Table({ timestamps: true })
export class User extends Model {
  @PrimaryKey
  @Column
  login: string;

  @AllowNull(false)
  @Column
  password: string;

  @BelongsToMany(() => Folder, () => MMUserFolder)
  folderList: Array<Folder & { MMUserFolder: MMUserFolder }>;
}
