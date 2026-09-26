import express from 'express';

const router = express.Router();

// In-memory loyalty store (replace with DB in production)
const loyaltyAccounts = {};

router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const account = loyaltyAccounts[userId] || { userId, points: 0, tier: 'Bronze', history: [] };
  res.json(account);
});

router.post('/earn', (req, res) => {
  const { userId, points, description } = req.body;
  if (!userId || !points) return res.status(400).json({ error: 'userId and points required' });

  if (!loyaltyAccounts[userId]) {
    loyaltyAccounts[userId] = { userId, points: 0, tier: 'Bronze', history: [] };
  }

  loyaltyAccounts[userId].points += parseInt(points);
  loyaltyAccounts[userId].history.push({
    type: 'earn',
    points: parseInt(points),
    description,
    date: new Date().toISOString(),
  });

  // Update tier
  const p = loyaltyAccounts[userId].points;
  if (p >= 5000) loyaltyAccounts[userId].tier = 'Platinum';
  else if (p >= 2000) loyaltyAccounts[userId].tier = 'Gold';
  else if (p >= 500) loyaltyAccounts[userId].tier = 'Silver';

  res.json(loyaltyAccounts[userId]);
});

router.post('/redeem', (req, res) => {
  const { userId, points } = req.body;
  if (!userId || !points) return res.status(400).json({ error: 'userId and points required' });

  if (!loyaltyAccounts[userId]) return res.status(404).json({ error: 'Account not found' });
  if (loyaltyAccounts[userId].points < points) return res.status(400).json({ error: 'Insufficient points' });

  loyaltyAccounts[userId].points -= parseInt(points);
  loyaltyAccounts[userId].history.push({
    type: 'redeem',
    points: parseInt(points),
    description: 'Reward redemption',
    date: new Date().toISOString(),
  });

  res.json(loyaltyAccounts[userId]);
});

export default router;
