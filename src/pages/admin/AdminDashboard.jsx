import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, DollarSign, Users, TrendingUp, Clock } from 'lucide-react';
import { ordersAPI, productsAPI, usersAPI } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    recentOrders: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch products count
        const products = await productsAPI.getAll();
        
        // Fetch all orders (Admin)
        const orders = await ordersAPI.getAll();
        
        // Fetch all users (Admin)
        const users = await usersAPI.getAll();

        // Calculate stats
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        
        // Get recent orders (last 5)
        const recentOrders = [...orders]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue,
          totalUsers: users.length,
          recentOrders,
          topProducts: products.slice(0, 5)
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Tổng sản phẩm',
      value: stats.totalProducts,
      icon: Package,
      color: '#3b82f6',
      change: '+12% so với tháng trước'
    },
    {
      title: 'Tổng đơn hàng',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: '#10b981',
      change: '+8% so với tháng trước'
    },
    {
      title: 'Tổng doanh thu',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: '#f59e0b',
      change: '+15% so với tháng trước'
    },
    {
      title: 'Tổng người dùng',
      value: stats.totalUsers,
      icon: Users,
      color: '#8b5cf6',
      change: '+5% so với tháng trước'
    }
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
          <h1>Bảng điều khiển</h1>
          <p>Chào mừng trở lại! Đây là tổng quan về cửa hàng của bạn.</p>
        </div>

        {/* Stats Grid */}
        <div className="admin-stats">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={stat.title}
                className="stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="stat-card-header">
                  <h3>{stat.title}</h3>
                  <div className="stat-card-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                    <Icon size={24} />
                  </div>
                </div>
                <div className="stat-card-value">{stat.value}</div>
                <div className="stat-card-change">
                  <TrendingUp size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  {stat.change}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="dashboard-grid">
          {/* Recent Orders */}
          <div className="admin-table-container">
            <div className="admin-table-header">
              <h2>Đơn hàng gần đây</h2>
              <Link to="/admin/orders" className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Xem tất cả
              </Link>
            </div>
            
            {stats.recentOrders.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID Đơn hàng</th>
                  <th>Khách hàng</th>
                  <th>Tổng</th>
                  <th>Trạng thái</th>
                  <th>Ngày</th>
                </tr>
              </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: 600 }}>#{String(order.id).padStart(6, '0')}</td>
                      <td>{order.shippingAddress?.fullName || 'N/A'}</td>
                      <td style={{ fontWeight: 600 }}>${order.totalPrice?.toLocaleString()}</td>
                      <td>
                        <span className={`status-badge ${getStatusColor(order.status)}`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)' }}>
                          <Clock size={14} />
                          {formatDate(order.createdAt)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <h3>Chưa có đơn hàng nào</h3>
                <p>Đơn hàng sẽ xuất hiện ở đây khi khách hàng mua sắm.</p>
              </div>
            )}
          </div>

          {/* Top Products */}
          <div className="admin-table-container">
            <div className="admin-table-header">
              <h2>Sản phẩm hàng đầu</h2>
              <Link to="/admin/products" className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Quản lý
              </Link>
            </div>
            
            {stats.topProducts.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Thương hiệu</th>
                  <th>Giá</th>
                  <th>Tồn kho</th>
                </tr>
              </thead>
                <tbody>
                  {stats.topProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img 
                            src={product.image} 
                            alt={product.name}
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }}
                          />
                          <span style={{ fontWeight: 600 }}>{product.name}</span>
                        </div>
                      </td>
                      <td>{product.brand}</td>
                      <td style={{ fontWeight: 600 }}>
                        {product.salePrice ? (
                          <span style={{ color: '#ff4444' }}>${product.salePrice}</span>
                        ) : (
                          `$${product.price}`
                        )}
                      </td>
                      <td>
                        <span style={{ 
                          color: product.stock > 10 ? '#10b981' : product.stock > 0 ? '#f59e0b' : '#ff4444',
                          fontWeight: 600
                        }}>
                          {product.stock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <h3>Chưa có sản phẩm nào</h3>
                <p>Thêm sản phẩm để xem chúng ở đây.</p>
                <Link to="/admin/products" className="btn-primary" style={{ display: 'inline-block' }}>
                  Thêm sản phẩm
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminDashboard;
