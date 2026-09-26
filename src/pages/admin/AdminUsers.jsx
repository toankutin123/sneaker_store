import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users as UsersIcon, Mail, Shield, Calendar } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock users data - trong thực tế sẽ gọi API
  useEffect(() => {
    // Simulate fetching users
    setTimeout(() => {
      setUsers([
        {
          _id: '1',
          username: 'admin',
          email: 'admin@sneakerstore.com',
          isAdmin: true,
          createdAt: new Date().toISOString()
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-spinner" />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Page Header */}
        <div className="admin-page-header">
          <h1>Người dùng</h1>
          <p>Quản lý người dùng đã đăng ký</p>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-card-header">
              <h3>Tổng người dùng</h3>
              <div className="stat-card-icon">
                <UsersIcon size={24} />
              </div>
            </div>
            <div className="stat-card-value">{users.length}</div>
          </div>
        </div>

        {/* Users Table */}
        <div className="admin-table-container">
          {users.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Người dùng</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Ngày tham gia</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td style={{ fontWeight: 600 }}>{user.username}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Mail size={16} style={{ color: 'var(--color-text-muted)' }} />
                        {user.email}
                      </div>
                    </td>
                    <td>
                      {user.isAdmin ? (
                        <span className="admin-badge">
                          <Shield size={14} />
                          Quản trị
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)' }}>Khách hàng</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)' }}>
                        <Calendar size={14} />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <h3>Chưa có người dùng nào</h3>
              <p>Người dùng sẽ xuất hiện ở đây khi họ đăng ký.</p>
            </div>
          )}
        </div>

        <div style={{ marginTop: '24px', padding: '20px', backgroundColor: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={18} />
            Ghi chú quản lý người dùng
          </h4>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            Để bật quản lý người dùng đầy đủ, bạn cần tạo <code style={{ backgroundColor: 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: '4px' }}>usersAPI</code> trong file services và thêm users route trong backend.
            Triển khai hiện tại chỉ hiển thị người dùng admin.
          </p>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminUsers;
