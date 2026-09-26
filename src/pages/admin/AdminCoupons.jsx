import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Tag, X } from 'lucide-react';
import { couponAPI } from '../../services/api';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', discount: '', type: 'percent', minOrder: '' });
  const [error, setError] = useState('');

  useEffect(() => { fetchCoupons(); }, []);

  const fetchCoupons = async () => {
    try {
      const data = await couponAPI.getAll();
      setCoupons(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const newCoupon = await couponAPI.create({
        code: form.code.toUpperCase(),
        discount: parseFloat(form.discount),
        type: form.type,
        minOrder: parseFloat(form.minOrder) || 0,
      });
      setCoupons(prev => [...prev, newCoupon]);
      setForm({ code: '', discount: '', type: 'percent', minOrder: '' });
      setShowForm(false);
    } catch (err) {
      setError(err.message || 'Lỗi khi tạo coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xoá coupon này?')) return;
    try {
      await couponAPI.delete(id);
      setCoupons(prev => prev.filter(c => c.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleToggleActive = async (coupon) => {
    try {
      await couponAPI.toggle(coupon.id);
      setCoupons(prev => prev.map(c => c.id === coupon.id ? { ...c, active: !c.active } : c));
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.8rem' }}>Quản lý Coupon</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Tạo Coupon
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
          backgroundColor: 'var(--color-bg-alt)', borderRadius: '14px', padding: '24px', marginBottom: '24px',
          border: '1px solid var(--color-border)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontWeight: 700 }}>Tạo Coupon mới</h2>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
          </div>
          <form onSubmit={handleCreate}>
            {error && <p style={{ color: '#ef4444', marginBottom: '12px' }}>{error}</p>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Mã coupon</label>
                <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} className="input-field"
                  placeholder="SAVE20" required style={{ textTransform: 'uppercase' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Giảm giá</label>
                <input type="number" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} className="input-field"
                  placeholder="20" required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Loại</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input-field">
                  <option value="percent">Phần trăm (%)</option>
                  <option value="fixed">Số tiền (đ)</option>
                  <option value="free_shipping">Miễn phí ship</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Đơn hàng tối thiểu</label>
              <input type="number" value={form.minOrder} onChange={e => setForm({ ...form, minOrder: e.target.value })} className="input-field"
                placeholder="0" />
            </div>
            <button type="submit" className="btn-primary">Tạo</button>
          </form>
        </motion.div>
      )}

      {loading ? <p>Đang tải...</p> : (
        <div style={{ backgroundColor: 'var(--color-bg-alt)', borderRadius: '14px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-border)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Mã</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Giảm</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Đơn tối thiểu</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Trạng thái</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(coupon => (
                <tr key={coupon.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Tag size={16} style={{ color: 'var(--color-primary)' }} />
                      {coupon.code}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {coupon.type === 'percent' ? `${coupon.discount}%` : coupon.type === 'free_shipping' ? 'Miễn phí ship' : `${coupon.discount}đ`}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>{coupon.minOrder || 0}đ</td>
                  <td style={{ padding: '14px 16px' }}>
                    <button onClick={() => handleToggleActive(coupon)} style={{
                      padding: '4px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                      backgroundColor: coupon.active ? '#d1fae5' : '#fee2e2',
                      color: coupon.active ? '#065f46' : '#991b1b'
                    }}>
                      {coupon.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button onClick={() => handleDelete(coupon.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
