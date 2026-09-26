import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '.env') });

import express from 'express';
import cors from 'cors';
import { sequelize } from './models/index.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import loyaltyRoutes from './routes/loyaltyRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Create uploads directory if not exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// User profile routes (auth required)
import userProfileRoutes from './routes/userProfileRoutes.js';
app.use('/api/profile', userProfileRoutes);

// Wishlist routes
import wishlistRoutes from './routes/wishlistRoutes.js';
app.use('/api/wishlist', wishlistRoutes);

// Review routes
import reviewRoutes from './routes/reviewRoutes.js';
app.use('/api/reviews', reviewRoutes);

// Chat routes
app.use('/api/chat', chatRoutes);

// Loyalty routes
app.use('/api/loyalty', loyaltyRoutes);

// Coupon routes
app.use('/api/coupons', couponRoutes);

// Event routes
app.use('/api/events', eventRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected');
    
    // Only sync if tables don't exist (don't use force: true in production!)
    await sequelize.sync();
    console.log('Database synchronized');
    
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.log('Database Connection Error:', error);
  }
};

startServer();
