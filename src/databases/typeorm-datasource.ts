import { DataSource } from "typeorm";
import "reflect-metadata";
import dotenv from "dotenv";
import { Students } from "../models/typeorm/Students";
import { Course } from "../models/typeorm/Course";
dotenv.config();

const SQL_HOST: string = process.env.SQL_HOST as string;
const SQL_USER: string = process.env.SQL_USER as string;
const SQL_PASSWORD: string = process.env.SQL_PASSWORD as string;
const SQL_DATABASE: string = process.env.SQL_DATABASE as string;

export const AppDataSource = new DataSource({
  type: "mysql",
  host: SQL_HOST,
  port: 3306,
  username: SQL_USER,
  password: SQL_PASSWORD,
  database: SQL_DATABASE,
  synchronize: true,
  logging: false,
  entities: [Students, Course],
  migrations: [],
  subscribers: [],
});
