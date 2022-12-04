import * as dotenv from 'dotenv';

dotenv.config();

export const POSTGRES_HOST: string = process.env.POSTGRES_HOST;
export const POSTGRES_PORT: number = Number(process.env.POSTGRES_PORT);
export const POSTGRES_USERNAME: string = process.env.POSTGRES_USERNAME;
export const POSTGRES_PASSWORD: string = process.env.POSTGRES_PASSWORD;
export const POSTGRES_DATABASE: string = process.env.POSTGRES_DATABASE;

