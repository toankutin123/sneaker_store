import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middleware/authMiddleware.js';
import { getUserProfile, updateUserProfile, changePassword, uploadAvatar } from '../controllers/userController.js';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getUserProfile)
  .put(updateUserProfile);

router.put('/change-password', changePassword);
router.post('/avatar', upload.single('avatar'), uploadAvatar);

export default router;
