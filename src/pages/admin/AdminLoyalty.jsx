import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp, Users } from 'lucide-react';
import { usersAPI, loyaltyAPI } from '../../services/api';

const tierConfig = {
  Bronze: { color: '#cd7f32', min: 0 },
  Silver: { color: '#c0c0c0', min: 500 },
  Gold: { color: '#ffd700', min: 2000 },
  Platinum: { color: '#e5e4e2', min: 5000 },
};

const AdminLoyalty = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAccounts(); }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    const all = [];
    try {
      const users = await usersAPI.getAll();
      for (const user of Array.isArray(users) ? users : []) {
        try {
          const loyaltyData = await loyaltyAPI.getProfile();
          if (loyaltyData?.points > 0) {
            all.push({ ...user, loyalty: loyaltyData });
          }
        } catch {}
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
    setAccounts(all);
  };

  const getTierDistribution = () => {
    const dist = { Bronze: 0, Silver: 0, Gold: 0, Platinum: 0 };
    accounts.forEach(a => {
      if (tierConfig[a.loyalty?.tier]) dist[a.loyalty.tier]++;
    });
    return dist;
  };

  const dist = getTierDistribution();
  const totalPoints = accounts.reduce((sum, a) => sum + (a.loyalty?.points || 0), 0);

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontWeight: 800, fontSize: '1.8rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Award size={28} style={{ color: 'var(--color-primary)' }} /> Quản lý Loyalty
      </h1>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: 'var(--color-bg-alt)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
            <Users size={18} /> Thành viên
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{accounts.length}</div>
        </div>
        <div style={{ backgroundColor: 'var(--color-bg-alt)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
            <TrendingUp size={18} /> Tổng điểm
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{totalPoints.toLocaleString()}</div>
        </div>
        {Object.entries(dist).map(([tier, count]) => (
          <div key={tier} style={{ backgroundColor: 'var(--color-bg-alt)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Award size={18} style={{ color: tierConfig[tier].color }} />
              <span style={{ fontWeight: 600 }}>{tier}</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: tierConfig[tier].color }}>{count}</div>
          </div>
        ))}
      </div>

      {/* Accounts Table */}
      <div style={{ backgroundColor: 'var(--color-bg-alt)', borderRadius: '14px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-border)' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Khách hàng</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Hạng</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Điểm</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: '20px', textAlign: 'center' }}>Đang tải...</td></tr>
            ) : accounts.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Chưa có thành viên loyalty</td></tr>
            ) : (
              accounts.map(account => (
                <tr key={account.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>{account.username}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>{account.email}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '20px', fontWeight: 600, fontSize: '0.85rem',
                      backgroundColor: `${tierConfig[account.loyalty?.tier]?.color}22`,
                      color: tierConfig[account.loyalty?.tier]?.color
                    }}>
                      {account.loyalty?.tier || 'Bronze'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700 }}>
                    {(account.loyalty?.points || 0).toLocaleString()} đ
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLoyalty;
