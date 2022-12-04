import { Table, Column, Model } from 'sequelize-typescript';

@Table({ timestamps: true })
export class Token extends Model {
  @Column
  userLogin: string;

  @Column
  token: string;
}
