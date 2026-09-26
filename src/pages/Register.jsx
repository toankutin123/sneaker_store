import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // For pure frontend mock:
    if (username && email && password) {
      register(username, email, password).then(res => {
        navigate('/');
      }).catch(() => navigate('/'));
    }
  };

  return (
    <div className="container" style={{ padding: '80px 20px', maxWidth: '500px', margin: '0 auto' }}>
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '24px', textAlign: 'center', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px' }}
      >
        Create Account
      </motion.h1>
      {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ backgroundColor: '#ffcccc', color: '#ff0000', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>{error}</motion.div>}
      
      <motion.form 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        onSubmit={handleSubmit} 
        style={{ backgroundColor: 'var(--color-bg-alt)', padding: '40px 32px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}
      >
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Username</label>
          <input type="text" required className="input-field" value={username} onChange={e => setUsername(e.target.value)} style={{ backgroundColor: 'var(--color-bg-light)' }} />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Email Address</label>
          <input type="email" required className="input-field" value={email} onChange={e => setEmail(e.target.value)} style={{ backgroundColor: 'var(--color-bg-light)' }} />
        </div>
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Password</label>
          <input type="password" required className="input-field" value={password} onChange={e => setPassword(e.target.value)} style={{ backgroundColor: 'var(--color-bg-light)' }} />
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit" 
          className="btn-primary" 
          style={{ width: '100%', marginBottom: '24px', padding: '16px', fontSize: '1.1rem' }}
        >
          Register
        </motion.button>
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--color-text-main)', fontWeight: 700, textDecoration: 'underline' }}>Login</Link>
        </p>
      </motion.form>
    </div>
  );
};
export default Register;
