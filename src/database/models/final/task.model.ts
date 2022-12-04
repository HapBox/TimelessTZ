import { Table, PrimaryKey, Column, DataType, Model, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Folder } from './folder.model';

@Table({ timestamps: true })
export class Task extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  id: string;

  @Column
  name: string;

  @Column
  description: string;

  @ForeignKey(() => Folder)
  @Column
  folderId: string;

  @BelongsTo(() => Folder, {
    foreignKey: 'folderId',
  })
  public folder!: Folder;
}
