import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Event = sequelize.define('events', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('sale', 'flash_sale', 'new_release', 'seasonal', 'loyalty'),
    defaultValue: 'sale'
  },
  discountPercent: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  bannerImage: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  targetCategories: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  minOrder: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  maxDiscount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  usedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'events',
  timestamps: true
});

export default Event;
