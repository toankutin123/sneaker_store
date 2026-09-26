import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getWishlist, addToWishlist, removeFromWishlist, checkWishlist } from '../controllers/wishlistController.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getWishlist)
  .post(addToWishlist);

router.get('/check/:productId', checkWishlist);
router.delete('/:productId', removeFromWishlist);

export default router;
