import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define('products', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  brand: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  salePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  sizes: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  category: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isNewRelease: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isBestSeller: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0
  },
  reviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  sold: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'products',
  timestamps: true
});

export default Product;
