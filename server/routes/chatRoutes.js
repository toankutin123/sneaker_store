import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory chat store (replace with DB in production)
const messages = [];

router.post('/message', (req, res) => {
  const { userId, message, sender } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  const newMessage = {
    id: uuidv4(),
    userId,
    message,
    sender: sender || 'user',
    timestamp: new Date().toISOString(),
    read: false,
  };

  messages.push(newMessage);
  res.status(201).json(newMessage);
});

router.get('/messages', (req, res) => {
  res.json(messages.slice(-50));
});

router.post('/clear', (req, res) => {
  messages.length = 0;
  res.json({ success: true });
});

export default router;
