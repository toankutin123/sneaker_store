import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getProductReviews, createReview, deleteReview, checkPurchased } from '../controllers/reviewController.js';

const router = express.Router();

// Public - get reviews for a product
router.get('/product/:productId', getProductReviews);

// Protected - create a review
router.post('/product/:productId', protect, createReview);

// Protected - delete a review
router.delete('/:reviewId', protect, deleteReview);

// Protected - check if user purchased a product
router.get('/check-purchased/:productId', protect, checkPurchased);

export default router;
