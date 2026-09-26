import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envCandidates = [
  path.resolve(__dirname, '..', '.env.production'),
  path.resolve(__dirname, '..', '.env')
];
const envPath = envCandidates.find((candidate) => fs.existsSync(candidate)) || envCandidates[0];

dotenv.config({ path: envPath });

const isProduction = process.env.NODE_ENV === 'production';

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: isProduction
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false
            }
          }
        : {},
      underscored: true,
      freezeTableName: true,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    })
  : new Sequelize(
      process.env.DB_NAME || 'sneaker_store',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'postgres123',
      {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 5433,
        dialect: 'postgres',
        logging: false,
        underscored: true,
        freezeTableName: true,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    );

export default sequelize;
