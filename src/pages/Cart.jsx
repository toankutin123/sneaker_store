import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const { cart, cartTotal, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '1000px' }}>
      <motion.h1 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ marginBottom: '32px', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px' }}
      >
        Your Cart
      </motion.h1>
      
      {cart.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', padding: '80px 0', backgroundColor: 'var(--color-bg-alt)', borderRadius: 'var(--radius-lg)' }}
        >
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px', fontSize: '1.2rem', fontWeight: 500 }}>Your cart is empty.</p>
          <Link to="/shop" className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>Browse Shop</Link>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
          
          <div style={{ flex: '2 1 500px' }}>
            <AnimatePresence>
              {cart.map(item => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, x: '-10%' }}
                  transition={{ duration: 0.2 }}
                  key={`${item.id}-${item.size}`} 
                  style={{ display: 'flex', gap: '24px', padding: '24px 0', borderBottom: '1px solid var(--color-border)' }}
                >
                  <img src={item.image} alt={item.name} style={{ width: '140px', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: 700 }}>{item.name}</h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>Size: {item.size}</p>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>
                        ${item.salePrice || item.price}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '6px' }}>
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} style={{ padding: '4px' }}><Minus size={16}/></motion.button>
                        <span style={{ fontWeight: 600, width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} style={{ padding: '4px' }}><Plus size={16}/></motion.button>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.1, color: '#ff0000' }} 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromCart(item.id, item.size)} 
                        style={{ color: '#ff3b3b', background:'none', border:'none', cursor:'pointer' }}
                      >
                        <Trash2 size={22} />
                      </motion.button>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ flex: '1 1 300px', backgroundColor: 'var(--color-bg-alt)', padding: '32px', borderRadius: 'var(--radius-lg)', height: 'fit-content' }}
          >
            <h2 style={{ marginBottom: '24px', fontSize: '1.5rem', fontWeight: 700 }}>Order Summary</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              <span>Subtotal</span>
              <span>${cartTotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--color-border)', fontSize: '1.3rem', fontWeight: 800 }}>
              <span>Total</span>
              <span>${cartTotal}</span>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary" 
              style={{ width: '100%', marginTop: '32px', padding: '16px', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px' }}
              onClick={() => navigate('/checkout')}
            >
              Checkout Now
            </motion.button>
          </motion.div>

        </div>
      )}
    </div>
  );
};
export default Cart;
