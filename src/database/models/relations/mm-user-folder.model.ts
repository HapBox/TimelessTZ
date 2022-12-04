import { Table, Column, DataType, Model, AllowNull, ForeignKey } from 'sequelize-typescript';
import { AccessTypeEnum } from 'src/utils/constants';
import { Folder } from '../final/folder.model';
import { User } from '../final/user.model';

@Table({ timestamps: true })
export class MMUserFolder extends Model {
  @ForeignKey(() => Folder)
  @Column(DataType.UUIDV4)
  folderId: string;

  @ForeignKey(() => User)
  @Column
  userLogin: string;

  @AllowNull(false)
  @Column(DataType.ENUM({ values: Object.values(AccessTypeEnum) }))
  access: AccessTypeEnum;
}
