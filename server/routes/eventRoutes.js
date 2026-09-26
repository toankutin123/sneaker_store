import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory storage for demo (in production, use database)
let eventIdCounter = 3;
const events = {
  1: {
    id: 1,
    title: 'Summer Sale 2026',
    description: 'Giảm giá mùa hè - Lên đến 40% cho tất cả sản phẩm',
    type: 'sale',
    discountPercent: 40,
    startDate: '2026-05-01',
    endDate: '2026-06-30',
    isActive: true,
    bannerImage: '',
    targetCategories: ['Running', 'Casual'],
    minOrder: 0,
    maxDiscount: 200,
    code: 'SUMMER40',
    usageLimit: 1000,
    usedCount: 156
  },
  2: {
    id: 2,
    title: 'Flash Sale Cuối Tuần',
    description: 'Chỉ 24 giờ - Giảm 25% cho sneakers',
    type: 'flash_sale',
    discountPercent: 25,
    startDate: '2026-05-15',
    endDate: '2026-05-17',
    isActive: true,
    bannerImage: '',
    targetCategories: ['Sneakers'],
    minOrder: 100,
    maxDiscount: 100,
    code: 'FLASH25',
    usageLimit: 500,
    usedCount: 89
  }
};

// Multer config for banner uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `event_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// GET all events (admin)
router.get('/', (req, res) => {
  const eventList = Object.values(events).sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  res.json(eventList);
});

// GET public events (active & current)
router.get('/public', (req, res) => {
  const now = new Date();
  const publicEvents = Object.values(events)
    .filter(e => e.isActive && new Date(e.startDate) <= now && new Date(e.endDate) >= now)
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  res.json(publicEvents);
});

// GET single event
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const event = events[id];
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.json(event);
});

// POST create event
router.post('/', upload.single('banner'), (req, res) => {
  const { title, description, type, discountPercent, startDate, endDate, isActive, targetCategories, minOrder, maxDiscount, code, usageLimit } = req.body;

  if (!title || !startDate || !endDate) {
    return res.status(400).json({ error: 'Title, start date, and end date are required' });
  }

  const id = ++eventIdCounter;
  const newEvent = {
    id,
    title,
    description: description || '',
    type: type || 'sale',
    discountPercent: discountPercent ? parseInt(discountPercent) : null,
    startDate,
    endDate,
    isActive: isActive !== 'false',
    bannerImage: req.file ? `/uploads/${req.file.filename}` : '',
    targetCategories: targetCategories ? (typeof targetCategories === 'string' ? JSON.parse(targetCategories) : targetCategories) : [],
    minOrder: minOrder ? parseFloat(minOrder) : 0,
    maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
    code: code || null,
    usageLimit: usageLimit ? parseInt(usageLimit) : null,
    usedCount: 0
  };

  events[id] = newEvent;
  res.status(201).json(newEvent);
});

// PUT update event
router.put('/:id', upload.single('banner'), (req, res) => {
  const id = parseInt(req.params.id);
  const event = events[id];
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const { title, description, type, discountPercent, startDate, endDate, isActive, targetCategories, minOrder, maxDiscount, code, usageLimit } = req.body;

  if (title) event.title = title;
  if (description !== undefined) event.description = description;
  if (type) event.type = type;
  if (discountPercent !== undefined) event.discountPercent = discountPercent ? parseInt(discountPercent) : null;
  if (startDate) event.startDate = startDate;
  if (endDate) event.endDate = endDate;
  if (isActive !== undefined) event.isActive = isActive === 'true' || isActive === true;
  if (req.file) event.bannerImage = `/uploads/${req.file.filename}`;
  if (targetCategories !== undefined) event.targetCategories = typeof targetCategories === 'string' ? JSON.parse(targetCategories) : targetCategories;
  if (minOrder !== undefined) event.minOrder = minOrder ? parseFloat(minOrder) : 0;
  if (maxDiscount !== undefined) event.maxDiscount = maxDiscount ? parseFloat(maxDiscount) : null;
  if (code !== undefined) event.code = code || null;
  if (usageLimit !== undefined) event.usageLimit = usageLimit ? parseInt(usageLimit) : null;

  res.json(event);
});

// PATCH toggle active
router.patch('/:id/toggle', (req, res) => {
  const id = parseInt(req.params.id);
  const event = events[id];
  if (!event) return res.status(404).json({ error: 'Event not found' });
  event.isActive = !event.isActive;
  res.json(event);
});

// DELETE event
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (!events[id]) return res.status(404).json({ error: 'Event not found' });
  delete events[id];
  res.json({ success: true });
});

export default router;
