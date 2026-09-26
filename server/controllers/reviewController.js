import Review from '../models/Review.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

// Get reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const reviews = await Review.findAll({
      where: { productId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatar']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    // Calculate average rating
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    
    res.json({
      reviews,
      averageRating: avgRating.toFixed(1),
      totalReviews: reviews.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a review
export const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    
    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if user has purchased this product (order must be Delivered)
    const orders = await Order.findAll({ 
      where: { 
        userId: req.user.id,
        status: 'Delivered'
      }
    });
    
    const hasPurchased = orders.some(order => {
      return order.items.some(item => {
        const itemProductId = item.productId?.toString() || item.id?.toString();
        return itemProductId === productId.toString();
      });
    });
    
    if (!hasPurchased) {
      return res.status(403).json({ 
        message: 'Bạn cần mua sản phẩm này trước khi đánh giá. Chỉ khách hàng đã mua hàng mới có thể đánh giá.' 
      });
    }
    
    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      where: { userId: req.user.id, productId }
    });
    
    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.comment = comment;
      await existingReview.save();
      return res.json(existingReview);
    }
    
    const review = await Review.create({
      userId: req.user.id,
      productId,
      rating,
      comment
    });
    
    // Update product rating
    const allReviews = await Review.findAll({ where: { productId } });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    product.rating = avgRating.toFixed(1);
    product.reviews = allReviews.length;
    await product.save();
    
    const reviewWithUser = await Review.findByPk(review.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatar']
      }]
    });
    
    res.status(201).json(reviewWithUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    const review = await Review.findByPk(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Only allow user who created the review or admin to delete
    if (review.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await review.destroy();
    
    // Update product rating
    const product = await Product.findByPk(review.productId);
    if (product) {
      const allReviews = await Review.findAll({ where: { productId: review.productId } });
      product.rating = allReviews.length > 0
        ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
        : 0;
      product.reviews = allReviews.length;
      await product.save();
    }
    
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check if user has purchased a product
export const checkPurchased = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Find all delivered orders for this user
    const orders = await Order.findAll({ 
      where: { 
        userId: req.user.id,
        status: 'Delivered'
      }
    });
    
    const hasPurchased = orders.some(order => {
      return order.items.some(item => {
        const itemProductId = item.productId?.toString() || item.id?.toString();
        return itemProductId === productId.toString();
      });
    });
    
    res.json({ hasPurchased });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
