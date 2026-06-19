import "reflect-metadata";
import { DataSource } from "typeorm";
import { Users } from "../entities/users";
import { Ads } from "../entities/ads";
import { AdImages } from "../entities/adImages";
import { FlowerDetails } from "../entities/flowerDetails";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "flower_store",
  entities: [Users, Ads, AdImages, FlowerDetails],
  synchronize: false,
  logging: false,
});