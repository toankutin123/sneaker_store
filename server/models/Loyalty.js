import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Loyalty = sequelize.define('loyalty_accounts', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tier: {
    type: DataTypes.ENUM('Bronze', 'Silver', 'Gold', 'Platinum'),
    defaultValue: 'Bronze'
  },
}, {
  tableName: 'loyalty_accounts',
  timestamps: true
});

export default Loyalty;
