import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Order = sequelize.define('orders', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  items: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  shippingAddress: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.STRING,
    defaultValue: 'Credit Card'
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Rejected', 'Processing', 'Shipped', 'Delivered', 'Cancelled'),
    defaultValue: 'Pending'
  },
}, {
  tableName: 'orders',
  timestamps: true
});

export default Order;
