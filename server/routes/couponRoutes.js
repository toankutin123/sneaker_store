import express from 'express';

const router = express.Router();

let couponIdCounter = 10;
const coupons = {
  1: { id: 1, code: 'WELCOME10', discount: 10, type: 'percent', minOrder: 0, active: true },
  2: { id: 2, code: 'SAVE20', discount: 20, type: 'percent', minOrder: 50, active: true },
  3: { id: 3, code: 'FREESHIP', discount: 0, type: 'free_shipping', minOrder: 0, active: true },
};

router.get('/', (req, res) => {
  res.json(Object.values(coupons));
});

router.get('/public', (req, res) => {
  res.json(Object.values(coupons).filter(c => c.active));
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const coupon = coupons[id];
  if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
  res.json(coupon);
});

router.post('/create', (req, res) => {
  const { code, discount, type, minOrder } = req.body;
  if (!code || discount === undefined) return res.status(400).json({ error: 'Code and discount required' });
  const upperCode = code.toUpperCase();
  const existing = Object.values(coupons).find(c => c.code === upperCode);
  if (existing) return res.status(400).json({ error: 'Coupon code already exists' });
  const id = ++couponIdCounter;
  coupons[id] = { id, code: upperCode, discount: parseFloat(discount), type: type || 'percent', minOrder: parseFloat(minOrder) || 0, active: true };
  res.status(201).json(coupons[id]);
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const coupon = coupons[id];
  if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
  const { active } = req.body;
  if (active !== undefined) coupon.active = active;
  res.json(coupon);
});

router.patch('/:id/toggle', (req, res) => {
  const id = parseInt(req.params.id);
  const coupon = coupons[id];
  if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
  coupon.active = !coupon.active;
  res.json(coupon);
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (!coupons[id]) return res.status(404).json({ error: 'Coupon not found' });
  delete coupons[id];
  res.json({ success: true });
});

router.post('/validate', (req, res) => {
  const { code, orderTotal } = req.body;
  const coupon = Object.values(coupons).find(c => c.code === code.toUpperCase());
  if (!coupon) return res.status(404).json({ valid: false, error: 'Coupon not found' });
  if (!coupon.active) return res.status(400).json({ valid: false, error: 'Coupon is inactive' });
  if (orderTotal < coupon.minOrder) {
    return res.status(400).json({ valid: false, error: `Minimum order ${coupon.minOrder} required` });
  }
  res.json({ valid: true, coupon });
});

export default router;
