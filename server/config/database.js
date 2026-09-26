import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const sequelize = new Sequelize(
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
