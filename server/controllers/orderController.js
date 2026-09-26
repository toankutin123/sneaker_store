import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod, totalPrice, discount, voucherCode } = req.body;
  if (items && items.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  }
  try {
    // Check stock availability for each item
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        res.status(404).json({ message: `Product not found: ${item.name}` });
        return;
      }
      if (product.stock < item.quantity) {
        res.status(400).json({ message: `Insufficient stock for ${item.name}. Available: ${product.stock}` });
        return;
      }
    }

    const order = await Order.create({
      userId: req.user.id,
      items,
      shippingAddress,
      paymentMethod,
      totalPrice,
      discount: discount || 0,
      voucherCode: voucherCode || null,
      status: 'Pending'
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email'] }]
    });
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ where: { userId: req.user.id } });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'username'] }]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // Restore stock if order is cancelled or rejected
    if ((status === 'Cancelled' || status === 'Rejected') && 
        ['Approved', 'Processing', 'Shipped', 'Delivered'].includes(order.status)) {
      for (const item of order.items) {
        await Product.increment('stock', {
          by: item.quantity,
          where: { id: item.productId }
        });
        // Decrement sold when cancelled
        if (order.status === 'Delivered') {
          await Product.decrement('sold', {
            by: item.quantity,
            where: { id: item.productId }
          });
        }
      }
    }

    // Subtract stock when approved
    if (status === 'Approved' && order.status === 'Pending') {
      for (const item of order.items) {
        await Product.decrement('stock', {
          by: item.quantity,
          where: { id: item.productId }
        });
      }
    }

    // Increment sold when delivered (order completed)
    if (status === 'Delivered' && order.status !== 'Delivered') {
      for (const item of order.items) {
        await Product.increment('sold', {
          by: item.quantity,
          where: { id: item.productId }
        });
      }
    }

    await order.update({ status });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
