import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Calendar, Tag, Percent, Clock, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { eventsAPI } from '../../services/api';

const eventTypes = {
  sale: 'Khuyến mãi',
  flash_sale: 'Flash Sale',
  new_release: 'Sản phẩm mới',
  seasonal: 'Theo mùa',
  loyalty: 'Tích điểm'
};

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'sale',
    discountPercent: '',
    startDate: '',
    endDate: '',
    targetCategories: [],
    minOrder: '',
    maxDiscount: '',
    code: '',
    usageLimit: ''
  });
  const [bannerFile, setBannerFile] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const fileInputRef = useRef(null);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsAPI.getAll();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      type: 'sale',
      discountPercent: '',
      startDate: '',
      endDate: '',
      targetCategories: [],
      minOrder: '',
      maxDiscount: '',
      code: '',
      usageLimit: ''
    });
    setBannerFile(null);
    setError('');
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleOpenForm = (event = null) => {
    if (event) {
      setEditingId(event.id);
      setForm({
        title: event.title,
        description: event.description || '',
        type: event.type,
        discountPercent: event.discountPercent || '',
        startDate: event.startDate?.split('T')[0] || '',
        endDate: event.endDate?.split('T')[0] || '',
        targetCategories: event.targetCategories || [],
        minOrder: event.minOrder || '',
        maxDiscount: event.maxDiscount || '',
        code: event.code || '',
        usageLimit: event.usageLimit || ''
      });
    } else {
      resetForm();
    }
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title || !form.startDate || !form.endDate) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const eventData = {
      title: form.title,
      description: form.description,
      type: form.type,
      discountPercent: form.discountPercent || null,
      startDate: form.startDate,
      endDate: form.endDate,
      targetCategories: form.targetCategories,
      minOrder: form.minOrder || 0,
      maxDiscount: form.maxDiscount || null,
      code: form.code || null,
      usageLimit: form.usageLimit || null
    };

    try {
      if (editingId) {
        const updated = await eventsAPI.update(editingId, eventData, bannerFile);
        setEvents(prev => prev.map(ev => ev.id === editingId ? updated : ev));
      } else {
        const created = await eventsAPI.create(eventData, bannerFile);
        setEvents(prev => [created, ...prev]);
      }
      setShowForm(false);
      resetForm();
    } catch (err) {
      setError(err.message || 'Lỗi khi lưu sự kiện');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sự kiện này?')) return;
    try {
      await eventsAPI.delete(id);
      setEvents(prev => prev.filter(ev => ev.id !== id));
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const handleToggle = async (event) => {
    try {
      const updated = await eventsAPI.toggle(event.id);
      setEvents(prev => prev.map(ev => ev.id === event.id ? updated : ev));
    } catch (err) {
      console.error('Error toggling event:', err);
    }
  };

  const isEventActive = (event) => {
    const now = new Date();
    return event.isActive && new Date(event.startDate) <= now && new Date(event.endDate) >= now;
  };

  const isEventExpired = (event) => {
    return new Date(event.endDate) < new Date();
  };

  const filteredEvents = events.filter(ev => {
    if (activeTab === 'active') return ev.isActive;
    if (activeTab === 'inactive') return !ev.isActive;
    if (activeTab === 'expired') return isEventExpired(ev);
    return true;
  });

  const getStatusBadge = (event) => {
    if (isEventExpired(event)) {
      return <span style={{ background: '#fee2e2', color: '#991b1b', padding: '3px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>Đã hết hạn</span>;
    }
    if (isEventActive(event)) {
      return <span style={{ background: '#d1fae5', color: '#065f46', padding: '3px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>Đang hoạt động</span>;
    }
    if (!event.isActive) {
      return <span style={{ background: '#fee2e2', color: '#991b1b', padding: '3px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>Đã khóa</span>;
    }
    return <span style={{ background: '#fef3c7', color: '#92400e', padding: '3px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>Sắp diễn ra</span>;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.8rem' }}>Quản lý Sự kiện</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '4px' }}>Tạo và quản lý các chương trình khuyến mãi</p>
        </div>
        <button onClick={() => handleOpenForm()} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Tạo Sự kiện
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[
          { key: 'active', label: 'Đang hoạt động', count: events.filter(e => e.isActive).length },
          { key: 'inactive', label: 'Đã khóa', count: events.filter(e => !e.isActive).length },
          { key: 'expired', label: 'Đã hết hạn', count: events.filter(e => isEventExpired(e)).length },
          { key: 'all', label: 'Tất cả', count: events.length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 0.2s',
              backgroundColor: activeTab === tab.key ? 'var(--color-primary)' : 'var(--color-bg-alt)',
              color: activeTab === tab.key ? '#000' : 'var(--color-text)'
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
            onClick={(e) => { if (e.target === e.currentTarget) { setShowForm(false); resetForm(); } }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                backgroundColor: 'var(--color-bg-light)',
                borderRadius: '16px',
                padding: '28px',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1.3rem' }}>
                  {editingId ? 'Chỉnh sửa Sự kiện' : 'Tạo Sự kiện mới'}
                </h2>
                <button onClick={() => { setShowForm(false); resetForm(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {error && (
                  <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
                    {error}
                  </div>
                )}

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem' }}>Tiêu đề sự kiện *</label>
                  <input
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="input-field"
                    placeholder="VD: Summer Sale 2026"
                    required
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem' }}>Mô tả</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="input-field"
                    placeholder="Mô tả chi tiết về sự kiện..."
                    rows={3}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem' }}>Loại sự kiện</label>
                    <select
                      value={form.type}
                      onChange={e => setForm({ ...form, type: e.target.value })}
                      className="input-field"
                    >
                      {Object.entries(eventTypes).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem' }}>Phần trăm giảm (%)</label>
                    <input
                      type="number"
                      value={form.discountPercent}
                      onChange={e => setForm({ ...form, discountPercent: e.target.value })}
                      className="input-field"
                      placeholder="20"
                      min="1"
                      max="100"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem' }}>
                      <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      Ngày bắt đầu *
                    </label>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={e => setForm({ ...form, startDate: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem' }}>
                      <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      Ngày kết thúc *
                    </label>
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={e => setForm({ ...form, endDate: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem' }}>Mã coupon</label>
                    <input
                      value={form.code}
                      onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                      className="input-field"
                      placeholder="SUMMER40"
                      style={{ textTransform: 'uppercase' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem' }}>Giảm tối đa (đ)</label>
                    <input
                      type="number"
                      value={form.maxDiscount}
                      onChange={e => setForm({ ...form, maxDiscount: e.target.value })}
                      className="input-field"
                      placeholder="200"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem' }}>Đơn tối thiểu (đ)</label>
                    <input
                      type="number"
                      value={form.minOrder}
                      onChange={e => setForm({ ...form, minOrder: e.target.value })}
                      className="input-field"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem' }}>Giới hạn sử dụng</label>
                    <input
                      type="number"
                      value={form.usageLimit}
                      onChange={e => setForm({ ...form, usageLimit: e.target.value })}
                      className="input-field"
                      placeholder="Không giới hạn"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem' }}>Danh mục áp dụng</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {['Running', 'Sneakers', 'Casual', 'Basketball', 'Training'].map(cat => (
                      <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', backgroundColor: 'var(--color-bg-alt)', cursor: 'pointer', fontSize: '0.85rem' }}>
                        <input
                          type="checkbox"
                          checked={form.targetCategories.includes(cat)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setForm({ ...form, targetCategories: [...form.targetCategories, cat] });
                            } else {
                              setForm({ ...form, targetCategories: form.targetCategories.filter(c => c !== cat) });
                            }
                          }}
                        />
                        {cat}
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem' }}>Banner sự kiện</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={e => setBannerFile(e.target.files[0])}
                    style={{ fontSize: '0.9rem' }}
                  />
                  {bannerFile && <p style={{ marginTop: '6px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Đã chọn: {bannerFile.name}</p>}
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="btn-outline">
                    Hủy
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingId ? 'Cập nhật' : 'Tạo Sự kiện'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Events List */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ background: 'var(--color-bg-alt)', borderRadius: '12px', height: '200px', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
          textAlign: 'center', padding: '60px 20px', background: 'var(--color-bg-alt)', borderRadius: '14px'
        }}>
          <h3 style={{ fontWeight: 600, marginBottom: '8px' }}>Chưa có sự kiện nào</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>Tạo sự kiện đầu tiên để bắt đầu</p>
          <button onClick={() => handleOpenForm()} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={16} /> Tạo Sự kiện
          </button>
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filteredEvents.map(event => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: 'var(--color-bg-alt)',
                borderRadius: '14px',
                overflow: 'hidden',
                border: event.isActive && isEventActive(event) ? '2px solid var(--color-primary)' : '1px solid var(--color-border)'
              }}
            >
              {/* Card Header */}
              <div style={{
                padding: '16px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderBottom: '1px solid var(--color-border)'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{event.title}</h3>
                    {getStatusBadge(event)}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    {eventTypes[event.type] || event.type}
                  </p>
                </div>
                {event.discountPercent && (
                  <div style={{
                    background: 'var(--color-primary)',
                    color: '#000',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontWeight: 800,
                    fontSize: '1rem'
                  }}>
                    -{event.discountPercent}%
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div style={{ padding: '16px 18px' }}>
                {event.description && (
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '12px', lineHeight: 1.5 }}>
                    {event.description.length > 80 ? event.description.substring(0, 80) + '...' : event.description}
                  </p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)' }}>
                    <Calendar size={14} />
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </div>
                  {event.code && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Tag size={14} style={{ color: 'var(--color-primary)' }} />
                      <code style={{ background: 'rgba(255,200,0,0.15)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, color: 'var(--color-primary)' }}>
                        {event.code}
                      </code>
                    </div>
                  )}
                  {event.targetCategories?.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Áp dụng:</span>
                      {event.targetCategories.map(cat => (
                        <span key={cat} style={{
                          background: 'var(--color-bg-light)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 500
                        }}>
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                  {event.usageLimit && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)' }}>
                      <Clock size={14} />
                      Đã dùng: {event.usedCount || 0} / {event.usageLimit}
                      <div style={{ flex: 1, height: '4px', background: 'var(--color-border)', borderRadius: '2px', maxWidth: '80px' }}>
                        <div style={{
                          width: `${Math.min(100, ((event.usedCount || 0) / event.usageLimit) * 100)}%`,
                          height: '100%',
                          background: 'var(--color-primary)',
                          borderRadius: '2px'
                        }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Actions */}
              <div style={{
                padding: '12px 18px',
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <button
                  onClick={() => handleToggle(event)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    backgroundColor: event.isActive ? '#fee2e2' : '#d1fae5',
                    color: event.isActive ? '#991b1b' : '#065f46',
                    transition: 'all 0.2s'
                  }}
                >
                  {event.isActive ? <><EyeOff size={14} /> Khóa</> : <><Eye size={14} /> Mở khóa</>}
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleOpenForm(event)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      background: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      background: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      color: '#ef4444'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
