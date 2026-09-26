import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Coupon = sequelize.define('coupons', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  discount: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('percent', 'fixed', 'free_shipping'),
    defaultValue: 'percent'
  },
  minOrder: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'coupons',
  timestamps: true
});

const CouponUsage = sequelize.define('coupon_usages', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  couponId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'coupons',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'coupon_usages',
  timestamps: true
});

Coupon.hasMany(CouponUsage, { foreignKey: 'couponId', as: 'usages' });
CouponUsage.belongsTo(Coupon, { foreignKey: 'couponId', as: 'coupon' });

export default Coupon;
export { CouponUsage };
