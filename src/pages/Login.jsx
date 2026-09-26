import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await login(email, password);
      if (res.success) {
        // Kiểm tra nếu là admin thì chuyển đến trang admin
        const savedUser = JSON.parse(localStorage.getItem('sneaker_user') || '{}');
        if (savedUser.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(res.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError('Lỗi server. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '80px 20px', maxWidth: '500px', margin: '0 auto' }}>
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '24px', textAlign: 'center', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px' }}
      >
        Chào mừng trở lại
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
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Địa chỉ Email</label>
          <input type="email" required className="input-field" value={email} onChange={e => setEmail(e.target.value)} style={{ backgroundColor: 'var(--color-bg-light)' }} />
        </div>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
             <label style={{ fontWeight: 600 }}>Mật khẩu</label>
             <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', cursor: 'pointer' }}>Quên?</span>
          </div>
          <input type="password" required className="input-field" value={password} onChange={e => setPassword(e.target.value)} style={{ backgroundColor: 'var(--color-bg-light)' }} />
        </div>
        <motion.button 
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          type="submit" 
          className="btn-primary" 
          style={{ width: '100%', marginBottom: '24px', padding: '16px', fontSize: '1.1rem', opacity: loading ? 0.7 : 1 }}
          disabled={loading}
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </motion.button>
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Chưa có tài khoản? <Link to="/register" style={{ color: 'var(--color-text-main)', fontWeight: 700, textDecoration: 'underline' }}>Đăng ký</Link>
        </p>
      </motion.form>
    </div>
  );
};
export default Login;
