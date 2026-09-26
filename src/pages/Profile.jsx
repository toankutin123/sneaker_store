import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Lock, Camera, Heart, ShoppingBag, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { profileAPI, ordersAPI, wishlistAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Profile.css';

const provinces = [
  { id: 'hanoi', name: 'Hà Nội', districts: [
    { id: 'ba-dinh', name: 'Ba Đình', wards: ['Phường Phúc Xá', 'Phường Trúc Bạch', 'Phường Vĩnh Phúc', 'Phường Cống Vị', 'Phường Liễu Giai', 'Phường Ngọc Hà', 'Phường Điện Biên', 'Phường Đội Cấn', 'Phường Kim Mã', 'Phường Giảng Võ', 'Phường Thành Công'] },
    { id: 'tay-ho', name: 'Tây Hồ', wards: ['Phường Yên Phụ', 'Phường Trích Sài', 'Phường Bưởi', 'Phường Thụy Khuê', 'Phường Thượng Thanh', 'Phường Long Biên', 'Phường Gia Bình', 'Phường Đức Giang', 'Phường Phúc Lợi', 'Phường Giang Biên', 'Phường Đông Hưng'] },
    { id: 'hoan-kiem', name: 'Hoàn Kiếm', wards: ['Phường Hàng Bạc', 'Phường Hàng Gai', 'Phường Cửa Đông', 'Phường Lý Thái Tổ', 'Phường Hàng Bông', 'Phường Hàng Đào', 'Phường Hàng Bồ', 'Phường Cửa Nam', 'Phường Hàng Mã', 'Phường Chương Dương', 'Phường Trần Hưng Đạo', 'Phường Tràng Tiền', 'Phường Trần Phú'] },
    { id: 'thanh-xuan', name: 'Thanh Xuân', wards: ['Phường Thanh Xuân Bắc', 'Phường Thanh Xuân Nam', 'Phường Thanh Xuân Trung', 'Phường Phương Liệt', 'Phường Hạ Đình', 'Phường Khương Đình', 'Phường Khương Mai', 'Phường Thượng Đình', 'Phường Nhân Chính', 'Phường Thanh Xuân'] },
    { id: 'dong-da', name: 'Đống Đa', wards: ['Phường Cát Linh', 'Phường Hàng Bột', 'Phường Láng Hạ', 'Phường Khâm Thiên', 'Phường Thổ Quan', 'Phường Nam Đồng', 'Phường Trung Phụng', 'Phường Quang Trung', 'Phường Trung Liệt', 'Phường Phương Canh', 'Phường Tân Triều'] },
    { id: 'hai-ba-trung', name: 'Hai Bà Trưng', wards: ['Phường Nguyễn Du', 'Phường Bạch Đằng', 'Phường Phạm Đình Hổ', 'Phường Lê Đại Hành', 'Phường Đồng Nhân', 'Phường Đống Mác', 'Phường Thanh Lương', 'Phường Thanh Nhàn', 'Phường Cầu Dền', 'Phường Vĩnh Tuy', 'Phường Bách Khoa'] }
  ]},
  { id: 'hcm', name: 'TP. Hồ Chí Minh', districts: [
    { id: 'quan-1', name: 'Quận 1', wards: ['Phường Tân Định', 'Phường Đa Kao', 'Phường Bến Nghé', 'Phường Bến Thành', 'Phường Nguyễn Thái Bình', 'Phường Phạm Ngũ Lão', 'Phường Cầu Ông Lãnh', 'Phường Cô Giang', 'Phường Nguyễn Cư Trinh', 'Phường Võ Thị Sáu'] },
    { id: 'quan-3', name: 'Quận 3', wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14'] },
    { id: 'quan-5', name: 'Quận 5', wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14'] },
    { id: 'quan-10', name: 'Quận 10', wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14', 'Phường 15'] },
    { id: 'tan-binh', name: 'Quận Tân Bình', wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14', 'Phường 15'] },
    { id: 'phu-nhuan', name: 'Quận Phú Nhuận', wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14', 'Phường 15', 'Phường 17'] },
    { id: 'go-vap', name: 'Quận Gò Vấp', wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14', 'Phường 15', 'Phường 16', 'Phường 17'] },
    { id: 'binh-thanh', name: 'Quận Bình Thạnh', wards: ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14', 'Phường 15'] },
    { id: 'thu-duc', name: 'Thành phố Thủ Đức', wards: ['Phường Linh Trung', 'Phường Linh Chiểu', 'Phường Tam Bình', 'Phường Tam Phú', 'Phường Hiệp Bình Phước', 'Phường Hiệp Bình Chánh', 'Phường Bình Chiểu', 'Phường Bình Thọ', 'Phường Trường Thọ', 'Phường Long Bình', 'Phường Long Phước', 'Phường Long Thạnh Mỹ', 'Phường Tân Phú', 'Phường An Phú', 'Phường Bình Khánh'] }
  ]},
  { id: 'da-nang', name: 'Đà Nẵng', districts: [
    { id: 'hai-chau', name: 'Quận Hải Châu', wards: ['Phường Thạch Thang', 'Phường Thanh Bình', 'Phường Thuận Phước', 'Phường Hải Châu 1', 'Phường Hải Châu 2', 'Phường Phước Ninh', 'Phường Hòa Thuận Đông', 'Phường Hòa Thuận Tây', 'Phường Nam Dương', 'Phường Bình Hiên', 'Phường Bình Thuận'] },
    { id: 'thanh-khe', name: 'Quận Thanh Khê', wards: ['Phường An Xuân', 'Phường An Khê', 'Phường Hòa Khê', 'Phường Tam Thuận', 'Phường Thanh Bình', 'Phường Thanh Lộc', 'Phường Đakao', 'Phường Tân Chính', 'Phường Chính Gián'] },
    { id: 'lien-chieu', name: 'Quận Liên Chiểu', wards: ['Phường Hòa Khánh Bắc', 'Phường Hòa Khánh Nam', 'Phường Hòa Minh', 'Phường Hòa Liên', 'Phường Hòa Ninh'] },
    { id: 'ngu-hanh-son', name: 'Quận Ngũ Hành Sơn', wards: ['Phường Mỹ An', 'Phường Khuê Mỹ', 'Phường Hòa Quý', 'Phường Hòa Hải', 'Phường Mỹ An Đông 1', 'Phường Mỹ An Đông 2'] }
  ]},
  { id: 'can-tho', name: 'Cần Thơ', districts: [
    { id: 'ninh-kieu', name: 'Quận Ninh Kiều', wards: ['Phường Cái Khế', 'Phường An Hòa', 'Phường Thới Bình', 'Phường An Nghiệp', 'Phường Xuân Khánh', 'Phường Tân An', 'Phường Long Tuyền', 'Phường An Bình', 'Phường Bình Thủy', 'Phường Trà Nóc'] }
  ]},
  { id: 'hai-phong', name: 'Hải Phòng', districts: [
    { id: 'hong-bang', name: 'Quận Hồng Bàng', wards: ['Phường Hạ Lý', 'Phường Hùng Vương', 'Phường Quán Toan', 'Phường Sở Dầu', 'Phường Thượng Lý', 'Phường Trại Chuối', 'Phường Hoàng Văn Thụ'] }
  ]}
];

const Profile = () => {
  const { userInfo, setUserInfo } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    street: ''
  });

  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleProvinceChange = (provinceId) => {
    const province = provinces.find(p => p.id === provinceId);
    setFormData({ ...formData, province: provinceId, district: '', ward: '', street: '' });
    setDistricts(province?.districts || []);
    setWards([]);
  };

  const handleDistrictChange = (districtId) => {
    const district = districts.find(d => d.id === districtId);
    setFormData({ ...formData, district: districtId, ward: '' });
    setWards(district?.wards || []);
  };

  useEffect(() => {
    if (userInfo) {
      setFormData({
        username: userInfo.username || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        province: userInfo.province || '',
        district: userInfo.district || '',
        ward: userInfo.ward || '',
        street: userInfo.street || ''
      });
      
      if (userInfo.province) {
        const province = provinces.find(p => p.id === userInfo.province);
        if (province) {
          setDistricts(province.districts);
          if (userInfo.district) {
            const district = province.districts.find(d => d.id === userInfo.district);
            if (district) {
              setWards(district.wards);
            }
          }
        }
      }
    }
  }, [userInfo]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const updatedUser = await profileAPI.update(formData);
      const currentUser = JSON.parse(localStorage.getItem('sneaker_user') || '{}');
      const newUserData = { ...currentUser, ...updatedUser };
      localStorage.setItem('sneaker_user', JSON.stringify(newUserData));
      setUserInfo(newUserData);
      setMessage({ type: 'success', text: 'Cập nhật thành công!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu không khớp!' });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu phải ít nhất 6 ký tự!' });
      setLoading(false);
      return;
    }

    try {
      await profileAPI.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const result = await profileAPI.uploadAvatar(file);
      const currentUser = JSON.parse(localStorage.getItem('sneaker_user') || '{}');
      const newUserData = { ...currentUser, avatar: result.avatar };
      localStorage.setItem('sneaker_user', JSON.stringify(newUserData));
      setUserInfo(newUserData);
      setMessage({ type: 'success', text: 'Cập nhật avatar thành công!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await ordersAPI.getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchWishlist = async () => {
    setLoadingWishlist(true);
    try {
      const data = await wishlistAPI.get();
      setWishlist(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoadingWishlist(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
    else if (activeTab === 'wishlist') fetchWishlist();
  }, [activeTab]);

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#f59e0b', 'Approved': '#10b981', 'Rejected': '#ef4444',
      'Processing': '#3b82f6', 'Shipped': '#8b5cf6', 'Delivered': '#10b981', 'Cancelled': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await ordersAPI.updateStatus(orderId, 'Cancelled');
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o));
      setMessage({ type: 'success', text: 'Đơn hàng đã được hủy!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Không thể hủy đơn hàng!' });
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const selectStyle = (disabled) => ({
    backgroundColor: 'var(--color-bg-alt)',
    width: '100%',
    appearance: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1
  });

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px', fontWeight: 800 }}>
        Tài khoản của tôi
      </motion.h1>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
        {[{ id: 'info', label: 'Hồ sơ', icon: User }, { id: 'password', label: 'Bảo mật', icon: Lock }, { id: 'orders', label: 'Đơn hàng', icon: ShoppingBag }, { id: 'wishlist', label: 'Yêu thích', icon: Heart }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem',
            backgroundColor: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-bg-alt)',
            color: activeTab === tab.id ? '#000' : 'var(--color-text-main)', transition: 'all 0.2s'
          }}>
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      {message.text && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{
          padding: '12px 16px', borderRadius: '8px', marginBottom: '24px',
          backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
          color: message.type === 'success' ? '#065f46' : '#991b1b'
        }}>
          {message.text}
        </motion.div>
      )}

      {activeTab === 'info' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="profile-section">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'var(--color-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '3px solid var(--color-primary)' }}>
                {userInfo?.avatar ? <img src={userInfo.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={48} style={{ color: 'var(--color-text-muted)' }} />}
              </div>
              <label style={{ position: 'absolute', bottom: '0', right: '0', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Camera size={18} color="#000" />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} disabled={uploadingAvatar} />
              </label>
            </div>
            {uploadingAvatar && <p style={{ marginTop: '8px', color: 'var(--color-text-muted)' }}>Đang tải lên...</p>}
          </div>

          <form onSubmit={handleProfileUpdate}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 600 }}><User size={16} /> Họ và tên</label>
                <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="input-field" />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 600 }}><Mail size={16} /> Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 600 }}><Phone size={16} /> Số điện thoại</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="input-field" placeholder="0912 345 678" />
              </div>
            </div>

            <h3 style={{ marginBottom: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={20} /> Địa chỉ giao hàng</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '0.9rem' }}>Tỉnh/Thành phố *</label>
                <div style={{ position: 'relative' }}>
                  <select className="input-field" value={formData.province} onChange={(e) => handleProvinceChange(e.target.value)} style={selectStyle(false)}>
                    <option value="">-- Chọn Tỉnh/Thành phố --</option>
                    {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <ChevronDown size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-text-muted)' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '0.9rem' }}>Quận/Huyện *</label>
                <div style={{ position: 'relative' }}>
                  <select className="input-field" value={formData.district} onChange={(e) => handleDistrictChange(e.target.value)} disabled={!formData.province} style={selectStyle(!formData.province)}>
                    <option value="">-- Chọn Quận/Huyện --</option>
                    {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  <ChevronDown size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-text-muted)' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '0.9rem' }}>Phường/Xã/Thị trấn *</label>
                <div style={{ position: 'relative' }}>
                  <select className="input-field" value={formData.ward} onChange={(e) => setFormData({ ...formData, ward: e.target.value })} disabled={!formData.district} style={selectStyle(!formData.district)}>
                    <option value="">-- Chọn Phường/Xã --</option>
                    {wards.map((w, idx) => <option key={idx} value={w}>{w}</option>)}
                  </select>
                  <ChevronDown size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-text-muted)' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '0.9rem' }}>Số nhà, tên đường *</label>
                <input type="text" value={formData.street} onChange={(e) => setFormData({ ...formData, street: e.target.value })} className="input-field" placeholder="123 Đường ABC, Tầng 5" />
              </div>
            </div>

            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </motion.button>
          </form>
        </motion.div>
      )}

      {activeTab === 'password' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="profile-section">
          <h2 style={{ marginBottom: '24px', fontWeight: 700 }}>Đổi mật khẩu</h2>
          <form onSubmit={handlePasswordChange}>
            <div style={{ maxWidth: '400px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Mật khẩu hiện tại</label>
                <input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className="input-field" required />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Mật khẩu mới</label>
                <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="input-field" required minLength={6} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Xác nhận mật khẩu mới</label>
                <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="input-field" required />
              </div>
              <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary" disabled={loading}>
                {loading ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      {activeTab === 'orders' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 style={{ marginBottom: '24px', fontWeight: 700 }}>Đơn hàng của tôi</h2>
          {loadingOrders ? <p>Đang tải...</p> : orders.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.map(order => (
                <div key={order.id} style={{ backgroundColor: 'var(--color-bg-alt)', borderRadius: '12px', padding: '20px', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>Đơn hàng #{order.id}</p>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{formatDate(order.createdAt)}</p>
                      {order.voucherCode && <p style={{ color: 'var(--color-primary)', fontSize: '0.85rem', marginTop: '4px' }}>Mã giảm giá: {order.voucherCode} (-${order.discount || 0})</p>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, backgroundColor: getStatusColor(order.status), color: '#fff' }}>{order.status}</span>
                      <p style={{ fontWeight: 700, marginTop: '8px' }}>${order.totalPrice}</p>
                      {order.paymentMethod && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>{order.paymentMethod === 'cod' ? 'COD - Tiền mặt' : 'Chuyển khoản'}</p>}
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginBottom: '16px' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>{order.items?.length || 0} sản phẩm</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {order.items?.slice(0, 3).map((item, idx) => <img key={idx} src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />)}
                      {(order.items?.length || 0) > 3 && <div style={{ width: '50px', height: '50px', borderRadius: '8px', backgroundColor: 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600 }}>+{order.items.length - 3}</div>}
                    </div>
                    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {order.items?.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                          <span>{item.name} (Size: {item.size}) x {item.quantity}</span>
                          <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Shipping Address */}
                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px', marginBottom: '12px' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      <strong>Địa chỉ giao hàng:</strong> {order.shippingAddress?.fullName}, {order.shippingAddress?.phone}
                      <br />{order.shippingAddress?.street}, {order.shippingAddress?.ward}, {order.shippingAddress?.district}, {order.shippingAddress?.province}
                    </p>
                  </div>
                  
                  {/* Cancel Button - Only for Pending orders */}
                  {order.status === 'Pending' && (
                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px', textAlign: 'right' }}>
                      <button 
                        onClick={() => {
                          if (window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
                            handleCancelOrder(order.id);
                          }
                        }}
                        style={{
                          padding: '8px 16px', borderRadius: '6px', border: '1px solid #ef4444', 
                          backgroundColor: 'transparent', color: '#ef4444', cursor: 'pointer', fontWeight: 600
                        }}
                      >
                        Hủy đơn hàng
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--color-bg-alt)', borderRadius: '12px' }}>
              <ShoppingBag size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }} />
              <h3 style={{ marginBottom: '8px' }}>Chưa có đơn hàng</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>Bắt đầu mua sắm để xem đơn hàng của bạn!</p>
              <a href="/shop" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>Mua sắm ngay</a>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'wishlist' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 style={{ marginBottom: '24px', fontWeight: 700 }}>Sản phẩm yêu thích</h2>
          {loadingWishlist ? <p>Đang tải...</p> : wishlist.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {wishlist.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--color-bg-alt)', borderRadius: '12px' }}>
              <Heart size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }} />
              <h3 style={{ marginBottom: '8px' }}>Danh sách yêu thích trống</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>Lưu sản phẩm bạn thích vào đây!</p>
              <a href="/shop" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>Khám phá sản phẩm</a>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Profile;
