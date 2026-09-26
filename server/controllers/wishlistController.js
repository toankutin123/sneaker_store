import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

// Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Product,
        as: 'product'
      }]
    });
    
    const products = wishlist.map(w => w.product).filter(p => p);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    
    // Check if already in wishlist
    const existing = await Wishlist.findOne({
      where: { userId: req.user.id, productId }
    });
    
    if (existing) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }
    
    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await Wishlist.create({
      userId: req.user.id,
      productId
    });
    
    res.status(201).json({ message: 'Added to wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const deleted = await Wishlist.destroy({
      where: { userId: req.user.id, productId }
    });
    
    if (deleted) {
      res.json({ message: 'Removed from wishlist' });
    } else {
      res.status(404).json({ message: 'Product not in wishlist' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check if product is in wishlist
export const checkWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const exists = await Wishlist.findOne({
      where: { userId: req.user.id, productId }
    });
    
    res.json({ inWishlist: !!exists });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
