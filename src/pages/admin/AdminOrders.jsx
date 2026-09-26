import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, X, Package, Truck, CheckCircle, Clock, ChevronDown } from 'lucide-react';
import { ordersAPI } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import './AdminOrders.css';

const statusOptions = ['Pending', 'Approved', 'Rejected', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const statusIcons = {
  Pending: Clock,
  Approved: CheckCircle,
  Rejected: X,
  Processing: Package,
  Shipped: Truck,
  Delivered: CheckCircle,
  Cancelled: X
};

const statusColors = {
  Pending: '#f59e0b',
  Approved: '#10b981',
  Rejected: '#ef4444',
  Processing: '#3b82f6',
  Shipped: '#8b5cf6',
  Delivered: '#10b981',
  Cancelled: '#ef4444'
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersAPI.getAll();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    const orderId = String(order.id || '').toLowerCase();
    const matchesSearch = 
      orderId.includes(searchLower) ||
      order.shippingAddress?.fullName?.toLowerCase().includes(searchLower) ||
      order.user?.email?.toLowerCase().includes(searchLower);
    
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus(true);
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Không thể cập nhật trạng thái đơn hàng.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge class
  const getStatusClass = (status) => {
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

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Page Header */}
        <div className="admin-page-header">
          <h1>Đơn hàng</h1>
          <p>Quản lý và theo dõi đơn hàng của khách hàng</p>
        </div>

        {/* Stats */}
        <div className="orders-stats">
          {statusOptions.map(status => {
            const count = orders.filter(o => o.status === status).length;
            const StatusIcon = statusIcons[status];
            return (
              <motion.div
                key={status}
                className={`orders-stat-card ${statusFilter === status ? 'active' : ''}`}
                onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="orders-stat-icon" style={{ color: statusColors[status] }}>
                  <StatusIcon size={20} />
                </div>
                <div className="orders-stat-info">
                  <span className="orders-stat-count">{count}</span>
                  <span className="orders-stat-label">{status}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Search and Filters */}
        <div className="orders-filters">
          <div className="orders-search">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm theo ID đơn hàng, tên, email hoặc địa chỉ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '48px', marginBottom: 0 }}
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
            style={{ width: 'auto', minWidth: '150px', marginBottom: 0 }}
          >
            <option value="">Tất cả trạng thái</option>
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Orders Table */}
        <div className="admin-table-container">
          {loading ? (
            <div className="loading-spinner" />
          ) : filteredOrders.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID Đơn hàng</th>
                  <th>Khách hàng</th>
                  <th>Sản phẩm</th>
                  <th>Tổng</th>
                  <th>Trạng thái</th>
                  <th>Ngày</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 600 }}>#{String(order.id).padStart(8, '0').slice(-8).toUpperCase()}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{order.shippingAddress?.fullName}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        {order.shippingAddress?.city}, {order.shippingAddress?.state}
                      </div>
                    </td>
                    <td>{order.items?.length || 0} item(s)</td>
                    <td style={{ fontWeight: 600 }}>${order.totalPrice?.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(order.status)}`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                      {formatDate(order.createdAt)}
                    </td>
                    <td>
                      <button 
                        className="action-btn"
                        onClick={() => setSelectedOrder(order)}
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <h3>Không tìm thấy đơn hàng nào</h3>
              <p>{searchTerm || statusFilter ? 'Hãy thử điều chỉnh bộ lọc.' : 'Đơn hàng sẽ xuất hiện ở đây khi khách hàng mua sắm.'}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div 
              className="order-modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div className="modal-header">
                <div>
                  <h2>Đơn hàng #{String(selectedOrder.id).padStart(6, '0')}</h2>
                  <p style={{ color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    Ngày đặt: {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <button className="modal-close" onClick={() => setSelectedOrder(null)}>
                  <X size={24} />
                </button>
              </div>

              {/* Status Update - Action Buttons */}
              {selectedOrder.status === 'Pending' && (
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', padding: '16px', backgroundColor: '#fef3c7', borderRadius: '10px' }}>
                  <button
                    onClick={() => handleStatusChange(selectedOrder.id, 'Approved')}
                    disabled={updatingStatus}
                    style={{
                      flex: 1, padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                      fontWeight: 600, fontSize: '1rem', backgroundColor: '#10b981', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}
                  >
                    <CheckCircle size={18} /> Duyệt đơn
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedOrder.id, 'Rejected')}
                    disabled={updatingStatus}
                    style={{
                      flex: 1, padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                      fontWeight: 600, fontSize: '1rem', backgroundColor: '#ef4444', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}
                  >
                    <X size={18} /> Từ chối
                  </button>
                </div>
              )}

              {/* Status Progress */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', position: 'relative' }}>
                {['Pending', 'Approved', 'Processing', 'Shipped', 'Delivered'].map((status, idx) => {
                  const statusIdx = ['Pending', 'Approved', 'Processing', 'Shipped', 'Delivered'].indexOf(selectedOrder.status);
                  const isActive = idx <= statusIdx;
                  const isCurrent = selectedOrder.status === status;
                  return (
                    <div key={status} style={{ textAlign: 'center', flex: 1, position: 'relative', zIndex: 1 }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%', margin: '0 auto 8px',
                        backgroundColor: isActive ? statusColors[status] : 'var(--color-border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: isCurrent ? '3px solid var(--color-primary)' : 'none'
                      }}>
                        {React.createElement(statusIcons[status], { size: 16, color: '#fff' })}
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: isCurrent ? 700 : 400, color: isActive ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}>
                        {status === 'Approved' ? 'Đã duyệt' : status === 'Pending' ? 'Chờ duyệt' : status === 'Processing' ? 'Đang xử lý' : status === 'Shipped' ? 'Đang giao' : 'Đã giao'}
                      </span>
                    </div>
                  );
                })}
                <div style={{ position: 'absolute', top: '15px', left: '40px', right: '40px', height: '2px', backgroundColor: 'var(--color-border)', zIndex: 0 }} />
              </div>

              {/* Customer Info */}
              <div className="order-section">
                <h3>Thông tin khách hàng</h3>
                <div className="order-info-grid">
                  <div>
                    <label>Họ tên</label>
                    <p>{selectedOrder.shippingAddress?.fullName}</p>
                  </div>
                  <div>
                    <label>Số điện thoại</label>
                    <p>{selectedOrder.shippingAddress?.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label>Email</label>
                    <p>{selectedOrder.user?.email || 'N/A'}</p>
                  </div>
                  <div className="full-width">
                    <label>Địa chỉ giao hàng</label>
                    <p>
                      {selectedOrder.shippingAddress?.street}<br />
                      {selectedOrder.shippingAddress?.ward}, {selectedOrder.shippingAddress?.district}<br />
                      {selectedOrder.shippingAddress?.province}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="order-section">
                <h3>Sản phẩm ({selectedOrder.items?.length || 0})</h3>
                <div className="order-items">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="order-item">
                      <img src={item.image} alt={item.name} />
                      <div className="order-item-info">
                        <span className="order-item-name">{item.name}</span>
                        <span className="order-item-meta">
                          Size: {item.size} | SL: {item.quantity}
                        </span>
                      </div>
                      <span className="order-item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="order-summary">
                <div className="summary-row">
                  <span>Tạm tính</span>
                  <span>${(Number(selectedOrder.totalPrice) + Number(selectedOrder.discount || 0)).toFixed(2)}</span>
                </div>
                {Number(selectedOrder.discount) > 0 && (
                  <div className="summary-row" style={{ color: '#10b981' }}>
                    <span>Mã giảm giá ({selectedOrder.voucherCode})</span>
                    <span>-${Number(selectedOrder.discount).toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Phí vận chuyển</span>
                  <span>Miễn phí</span>
                </div>
                <div className="summary-row total">
                  <span>Tổng cộng</span>
                  <span>${Number(selectedOrder.totalPrice).toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="order-section">
                <h3>Phương thức thanh toán</h3>
                <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {selectedOrder.paymentMethod === 'cod' ? (
                    <>
                      <span style={{ fontSize: '1.5rem' }}>💵</span>
                      <span>Thanh toán khi nhận hàng (COD)</span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: '1.5rem' }}>🏦</span>
                      <span>Chuyển khoản ngân hàng</span>
                    </>
                  )}
                </p>
              </div>

              {/* Quick Status Update (for other statuses) */}
              {selectedOrder.status !== 'Pending' && selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Cancelled' && selectedOrder.status !== 'Rejected' && (
                <div style={{ marginTop: '20px', padding: '16px', backgroundColor: 'var(--color-bg-alt)', borderRadius: '10px' }}>
                  <label style={{ fontWeight: 600, marginBottom: '12px', display: 'block' }}>Cập nhật trạng thái</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['Processing', 'Shipped', 'Delivered'].map(status => {
                      if (['Processing', 'Shipped', 'Delivered'].indexOf(selectedOrder.status) >= ['Processing', 'Shipped', 'Delivered'].indexOf(status)) return null;
                      return (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(selectedOrder.id, status)}
                          disabled={updatingStatus}
                          style={{
                            padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                            fontWeight: 600, backgroundColor: statusColors[status], color: '#fff'
                          }}
                        >
                          {status === 'Processing' ? 'Xử lý' : status === 'Shipped' ? 'Giao hàng' : 'Hoàn thành'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminOrders;
