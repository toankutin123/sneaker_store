import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Gift, TrendingUp, Award, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loyaltyAPI } from '../services/api';

const tierConfig = {
  Bronze: { min: 0, color: '#cd7f32', benefits: ['Tích điểm 1%', 'Quà sinh nhật'] },
  Silver: { min: 500, color: '#c0c0c0', benefits: ['Tích điểm 2%', 'Miễn phí vận chuyển', 'Quà sinh nhật'] },
  Gold: { min: 2000, color: '#ffd700', benefits: ['Tích điểm 3%', 'Miễn phí vận chuyển', 'Giảm 5% orders', 'Quà sinh nhật'] },
  Platinum: { min: 5000, color: '#e5e4e2', benefits: ['Tích điểm 5%', 'Miễn phí vận chuyển', 'Giảm 10% orders', 'Ưu tiên hỗ trợ', 'Quà sinh nhật'] },
};

const rewards = [
  { id: 1, name: 'Giảm 50.000đ', points: 500, type: 'voucher' },
  { id: 2, name: 'Miễn phí vận chuyển', points: 300, type: 'shipping' },
  { id: 3, name: 'Giảm 10%', points: 1000, type: 'discount' },
  { id: 4, name: 'Giảm 20%', points: 2000, type: 'discount' },
];

const LoyaltyDashboard = () => {
  const { userInfo } = useAuth();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchAccount();
  }, []);

  const fetchAccount = async () => {
    if (!userInfo?.id) { setLoading(false); return; }
    try {
      // Try to get loyalty data via loyaltyAPI
      const data = await loyaltyAPI.getProfile();
      setAccount({ userId: userInfo.id, points: data.points || 0, tier: data.tier || 'Bronze', history: data.history || [] });
    } catch {
      setAccount({ userId: userInfo.id, points: 0, tier: 'Bronze', history: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleEarn = async () => {
    if (!userInfo?.id) return;
    try {
      // Simulate earn by calling preview
      await loyaltyAPI.previewPoints(100000);
      await fetchAccount();
      setMessage({ type: 'success', text: 'Bạn đã tích được điểm!' });
    } catch {
      setMessage({ type: 'error', text: 'Lỗi khi tích điểm' });
    }
  };

  const handleRedeem = async (reward) => {
    if (!userInfo?.id || !account) return;
    if (account.points < reward.points) {
      setMessage({ type: 'error', text: 'Không đủ điểm để đổi!' });
      return;
    }
    setRedeeming(reward.id);
    try {
      await loyaltyAPI.redeem(reward.points);
      await fetchAccount();
      setMessage({ type: 'success', text: `Đã đổi "${reward.name}" thành công!` });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Lỗi khi đổi điểm' });
    } finally {
      setRedeeming(null);
    }
  };

  const currentTier = account?.tier || 'Bronze';
  const nextTier = Object.keys(tierConfig).find(t => tierConfig[t].min > (account?.points || 0));
  const progress = nextTier ? ((account?.points || 0) / tierConfig[nextTier].min) * 100 : 100;

  if (loading) return <div style={{ padding: '100px 20px', textAlign: 'center' }}>Đang tải...</div>;

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Award size={36} style={{ color: 'var(--color-primary)' }} /> Khoá tích điểm
      </motion.h1>

      {message.text && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{
          padding: '12px 16px', borderRadius: '8px', marginBottom: '24px',
          backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
          color: message.type === 'success' ? '#065f46' : '#991b1b'
        }}>
          {message.text}
        </motion.div>
      )}

      {/* Points Card */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{
        background: `linear-gradient(135deg, ${tierConfig[currentTier].color}22, ${tierConfig[currentTier].color}44)`,
        border: `2px solid ${tierConfig[currentTier].color}`,
        borderRadius: '20px', padding: '32px', marginBottom: '32px', textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <Star size={24} style={{ color: tierConfig[currentTier].color }} />
          <span style={{ fontWeight: 800, fontSize: '1.5rem', color: tierConfig[currentTier].color }}>{currentTier}</span>
        </div>
        <div style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1 }}>{account?.points || 0}</div>
        <div style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>điểm tích luỹ</div>

        {nextTier && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
              <span>Tiến tới {nextTier}</span>
              <span>{tierConfig[nextTier].min - (account?.points || 0)} điểm nữa</span>
            </div>
            <div style={{ backgroundColor: 'var(--color-border)', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(progress, 100)}%` }}
                style={{ height: '100%', backgroundColor: tierConfig[currentTier].color, borderRadius: '10px' }} />
            </div>
          </div>
        )}

        <button onClick={handleEarn} className="btn-primary" style={{ marginTop: '20px' }}>
          <TrendingUp size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
          Tích điểm thử (test +100đ)
        </button>
      </motion.div>

      {/* Benefits */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ marginBottom: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Gift size={24} style={{ color: 'var(--color-primary)' }} /> Quyền lợi {currentTier}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
          {tierConfig[currentTier].benefits.map((b, i) => (
            <div key={i} style={{ backgroundColor: 'var(--color-bg-alt)', padding: '14px 18px', borderRadius: '10px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981' }}>✓</span> {b}
            </div>
          ))}
        </div>
      </div>

      {/* Rewards */}
      <div>
        <h2 style={{ marginBottom: '16px', fontWeight: 700 }}>Đổi thưởng</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
          {rewards.map(reward => (
            <motion.div key={reward.id} whileHover={{ scale: 1.03 }} style={{
              backgroundColor: 'var(--color-bg-alt)', borderRadius: '14px', padding: '20px',
              border: '1px solid var(--color-border)', textAlign: 'center',
              opacity: account?.points >= reward.points ? 1 : 0.5
            }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>{reward.name}</div>
              <div style={{ color: 'var(--color-text-muted)', marginBottom: '16px', fontSize: '0.9rem' }}>{reward.points} điểm</div>
              <button
                onClick={() => handleRedeem(reward)}
                disabled={account?.points < reward.points || redeeming === reward.id}
                className="btn-primary"
                style={{ fontSize: '0.85rem', padding: '8px 16px', opacity: account?.points < reward.points ? 0.5 : 1 }}
              >
                {redeeming === reward.id ? 'Đang đổi...' : 'Đổi ngay'}
                <ChevronRight size={16} style={{ display: 'inline', marginLeft: '4px' }} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* History */}
      {account?.history?.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <h2 style={{ marginBottom: '16px', fontWeight: 700 }}>Lịch sử tích/đổi điểm</h2>
          <div style={{ backgroundColor: 'var(--color-bg-alt)', borderRadius: '12px', overflow: 'hidden' }}>
            {account.history.slice().reverse().map((h, i) => (
              <div key={i} style={{ padding: '14px 20px', borderBottom: i < account.history.length - 1 ? '1px solid var(--color-border)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{h.description}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{new Date(h.date).toLocaleDateString('vi-VN')}</div>
                </div>
                <span style={{ color: h.type === 'earn' ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                  {h.type === 'earn' ? '+' : '-'}{h.points} đ
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoyaltyDashboard;
