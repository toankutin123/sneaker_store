import sequelize from '../config/database.js';
import User from './User.js';
import Product from './Product.js';
import Order from './Order.js';
import Review from './Review.js';
import Wishlist from './Wishlist.js';
import Loyalty from './Loyalty.js';
import Coupon, { CouponUsage } from './Coupon.js';

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Product.hasMany(Review, { foreignKey: 'productId', as: 'productReviews' });
Review.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

User.hasMany(Wishlist, { foreignKey: 'userId', as: 'wishlist' });
Wishlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Product.hasMany(Wishlist, { foreignKey: 'productId', as: 'productWishlists' });
Wishlist.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

User.hasOne(Loyalty, { foreignKey: 'userId', as: 'loyalty' });
Loyalty.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { sequelize, User, Product, Order, Review, Wishlist, Loyalty, Coupon, CouponUsage };
