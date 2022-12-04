import { Client } from 'pg';
import { Sequelize } from 'sequelize-typescript';
import {
  POSTGRES_DATABASE,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_USERNAME,
} from 'src/config/app.config';
import { User } from './models/final/user.model';
import { Folder } from './models/final/folder.model';
import { MMUserFolder } from './models/relations/mm-user-folder.model';
import { Task } from './models/final/task.model';
import { Token } from './models/final/token.model';

export const sequelizeInstance = new Sequelize({
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  database: POSTGRES_DATABASE,
  dialect: 'postgres',
  username: POSTGRES_USERNAME,
  password: POSTGRES_PASSWORD,
  models: [User, Folder, MMUserFolder, Task, Token],
});

export async function createDbIfNotExist() {
  const dbName = POSTGRES_DATABASE;
  const client = new Client({
    user: POSTGRES_USERNAME,
    password: POSTGRES_PASSWORD,
    database: 'postgres',
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
  });

  await client.connect();

  const allDB = await client.query('SELECT datname FROM pg_database');

  if (allDB.rows.findIndex((el) => el.datname === dbName.toLowerCase()) === -1) {
    console.log('creating database');
    await client.query(`CREATE DATABASE ${dbName}`);
  }
  await client.end();
}

export async function initSequelize() {
  try {
    await sequelizeInstance.authenticate();
    await sequelizeInstance.dropSchema('public', {});
    await sequelizeInstance.createSchema('public', {});
    await sequelizeInstance.sync();
    console.log('Sequelize was initialized');
  } catch (error) {
    console.log('Sequelize ERROR', error);
    process.exit();
  }
}
