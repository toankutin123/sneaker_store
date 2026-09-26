import dotenv from 'dotenv';

dotenv.config();

import sequelize from './config/database.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

const users = [
  {
    username: 'Admin User',
    email: 'admin@gmail.com',
    password: '123456',
    isAdmin: true,
  },
  {
    username: 'Normal User',
    email: 'user@nxtstep.com',
    password: 'password123',
    isAdmin: false,
  }
];

const products = [
  {
    name: 'Nike Air Max 270',
    brand: 'Nike',
    category: 'Running',
    price: 160,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    description: 'Boasting the first-ever Max Air unit created specifically for Nike Sportswear, the Nike Air Max 270 delivers an Air unit that absorbs and gives back energy with every springy step.',
    sizes: ['8', '9', '10', '11', '12'],
    stock: 50,
    isNewRelease: true,
    isBestSeller: true,
    rating: 4.8,
    reviews: 124,
    sold: 856
  },
  {
    name: 'Adidas Ultraboost 22',
    brand: 'Adidas',
    category: 'Running',
    price: 190,
    image: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&q=80&w=800',
    description: 'Say hello to supreme energy return. The adidas Ultraboost 22 running shoes serve up comfort and responsiveness.',
    sizes: ['7', '8', '9', '10', '11'],
    stock: 45,
    isNewRelease: false,
    isBestSeller: true,
    rating: 4.7,
    reviews: 210,
    sold: 1240
  },
  {
    name: 'Nike Dunk Low Retro',
    brand: 'Nike',
    category: 'Sneakers',
    price: 110,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800',
    description: 'Created for the hardwood but taken to the streets, the 80s b-ball icon returns with perfectly shined overlays and classic team colors.',
    sizes: ['6', '7', '8', '9', '10'],
    stock: 120,
    isNewRelease: false,
    isBestSeller: false,
    rating: 4.9,
    reviews: 350,
    sold: 3420
  },
  {
    name: 'Puma RS-X3 Puzzle',
    brand: 'Puma',
    category: 'Casual',
    price: 120,
    salePrice: 95,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=800',
    description: 'Extreme. Exaggerated. Remixed. X marks extreme. Extrapolated from the archived RS design, we\'re stripping it down to the basics.',
    sizes: ['8', '9', '10', '11', '12'],
    stock: 30,
    isNewRelease: false,
    isBestSeller: false,
    rating: 4.5,
    reviews: 67,
    sold: 580
  },
  {
    name: 'Adidas Yeezy Boost 350 V2',
    brand: 'Adidas',
    category: 'Sneakers',
    price: 230,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800',
    description: 'The YEEZY BOOST 350 V2 features an upper composed of re-engineered Primeknit. The post-dyed monofilament side stripe is woven into the upper.',
    sizes: ['9', '10', '11', '12'],
    stock: 15,
    isNewRelease: true,
    isBestSeller: true,
    rating: 4.9,
    reviews: 540,
    sold: 2100
  },
  {
    name: 'Nike Air Force 1 \'07',
    brand: 'Nike',
    category: 'Casual',
    price: 110,
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=800',
    description: 'The radiance lives on in the Nike Air Force 1 \'07, the b-ball OG that puts a fresh spin on what you know best.',
    sizes: ['7', '8', '9', '10', '11', '12'],
    stock: 200,
    isNewRelease: false,
    isBestSeller: true,
    rating: 4.8,
    reviews: 1200,
    sold: 5420
  }
];

const importData = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');
    
    // Only sync if tables don't exist (use migrations for schema changes!)
    await sequelize.sync();
    console.log('Database synchronized');
    
    await User.bulkCreate(users);
    await Product.bulkCreate(products);
    
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();
