import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, MapPin, ChevronDown, Tag, CreditCard, Banknote, Truck, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { ordersAPI } from '../services/api';

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

// Sample vouchers
const vouchers = [
  { code: 'NEWCUSTOMER', discount: 10, type: 'percent', minOrder: 100, maxDiscount: 50, label: 'Giảm 10% cho khách hàng mới' },
  { code: 'SUMMER2024', discount: 15, type: 'percent', minOrder: 150, maxDiscount: 75, label: 'Summer Sale - Giảm 15%' },
  { code: 'FREESHIP', discount: 5, type: 'shipping', minOrder: 0, maxDiscount: 0, label: 'Miễn phí vận chuyển' },
  { code: 'VIP50', discount: 50, type: 'fixed', minOrder: 200, maxDiscount: 0, label: 'Giảm $50 cho đơn từ $200' }
];

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showVoucherList, setShowVoucherList] = useState(false);
  const [useSavedAddress, setUseSavedAddress] = useState(true);
  
  const [address, setAddress] = useState({
    fullName: userInfo?.username || '',
    phone: userInfo?.phone || '',
    province: userInfo?.province || '',
    district: userInfo?.district || '',
    ward: userInfo?.ward || '',
    street: userInfo?.street || ''
  });
  
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // Load saved address on mount
  useEffect(() => {
    if (userInfo) {
      setAddress({
        fullName: userInfo.username || '',
        phone: userInfo.phone || '',
        province: userInfo.province || '',
        district: userInfo.district || '',
        ward: userInfo.ward || '',
        street: userInfo.street || ''
      });
      
      // Load districts if province exists
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
  
  // Voucher state
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState('');
  
  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const handleProvinceChange = (provinceId) => {
    const province = provinces.find(p => p.id === provinceId);
    setAddress({ ...address, province: provinceId, district: '', ward: '' });
    setDistricts(province?.districts || []);
    setWards([]);
  };

  const handleDistrictChange = (districtId) => {
    const district = districts.find(d => d.id === districtId);
    setAddress({ ...address, district: districtId, ward: '' });
    setWards(district?.wards || []);
  };

  // Toggle address mode
  const toggleAddressMode = (useSaved) => {
    setUseSavedAddress(useSaved);
    if (useSaved && userInfo) {
      // Load saved address
      setAddress({
        fullName: userInfo.username || '',
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
            if (district) setWards(district.wards);
          }
        }
      }
    } else {
      // Clear address for new entry
      setAddress({
        fullName: userInfo?.username || '',
        phone: '',
        province: '',
        district: '',
        ward: '',
        street: ''
      });
      setDistricts([]);
      setWards([]);
    }
  };

  // Calculate discount
  const calculateDiscount = () => {
    if (!appliedVoucher) return 0;
    
    if (appliedVoucher.type === 'percent') {
      const discount = (cartTotal * appliedVoucher.discount) / 100;
      return Math.min(discount, appliedVoucher.maxDiscount || discount);
    } else if (appliedVoucher.type === 'fixed') {
      return appliedVoucher.discount;
    } else if (appliedVoucher.type === 'shipping') {
      return 5; // Free shipping value
    }
    return 0;
  };

  const discount = calculateDiscount();
  const shippingFee = appliedVoucher?.type === 'shipping' ? 0 : (cartTotal > 100 ? 0 : 5);
  const finalTotal = cartTotal - discount + shippingFee;

  const applyVoucher = () => {
    setVoucherError('');
    const voucher = vouchers.find(v => v.code.toUpperCase() === voucherInput.toUpperCase());
    
    if (!voucher) {
      setVoucherError('Mã voucher không hợp lệ');
      return;
    }
    
    if (cartTotal < voucher.minOrder) {
      setVoucherError(`Đơn hàng tối thiểu $${voucher.minOrder} để sử dụng mã này`);
      return;
    }
    
    setAppliedVoucher(voucher);
    setVoucherInput('');
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    setVoucherInput('');
    setVoucherError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(cart.length === 0) {
      setError('Giỏ hàng trống'); 
      return;
    }
    if (!address.province || !address.district || !address.ward || !address.street) {
      setError('Vui lòng điền đầy đủ địa chỉ');
      return;
    }
    if (!address.phone || address.phone.length < 10) {
      setError('Vui lòng nhập số điện thoại hợp lệ');
      return;
    }
    
    setError('');
    setIsProcessing(true);
    
    try {
      const provinceName = provinces.find(p => p.id === address.province)?.name || '';
      const districtName = districts.find(d => d.id === address.district)?.name || '';
      const wardName = address.ward;
      
      const fullAddress = `${address.street}, ${wardName}, ${districtName}, ${provinceName}`;
      
      const orderData = {
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          image: item.image,
          size: item.size,
          price: item.salePrice || item.price,
          quantity: item.quantity
        })),
        shippingAddress: {
          fullName: address.fullName,
          phone: address.phone,
          address: fullAddress,
          province: provinceName,
          district: districtName,
          ward: wardName,
          street: address.street
        },
        totalPrice: finalTotal,
        discount: discount,
        voucherCode: appliedVoucher?.code || null,
        paymentMethod: paymentMethod
      };
      
      await ordersAPI.create(orderData);
      
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
      setTimeout(() => { navigate('/'); }, 4000);
    } catch (err) {
      console.error('Order error:', err);
      setError(err.message || 'Có lỗi xảy ra');
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="container" 
        style={{ padding: '100px 20px', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
      >
        <motion.div
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.1 }}
        >
          <CheckCircle2 size={100} color="#10b981" style={{ marginBottom: '24px' }} />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ fontSize: '3rem', marginBottom: '16px', fontWeight: 800, letterSpacing: '-1px' }}>Đặt hàng thành công!</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', fontWeight: 500 }}>Cảm ơn bạn đã mua hàng. Đang chuyển về trang chủ...</motion.p>
      </motion.div>
    );
  }

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '1200px' }}>
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '32px', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px' }}
      >
        Thanh toán
      </motion.h1>
      
      {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontWeight: 500 }}>{error}</motion.div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px', alignItems: 'start' }}>
        {/* Left Column - Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <form onSubmit={handleSubmit}>
            {/* Shipping Info */}
            <div style={{ backgroundColor: 'var(--color-bg-alt)', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '1.2rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={20} /> Thông tin giao hàng
              </h3>
              
              {/* Saved Address Banner */}
              {userInfo?.province && (
                <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#fff', borderRadius: '10px', border: useSavedAddress ? '2px solid var(--color-primary)' : '2px solid transparent' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Địa chỉ đã lưu</div>
                    {useSavedAddress && <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--color-primary)', color: '#000', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>Đang dùng</span>}
                  </div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--color-text-main)' }}>
                    {userInfo.username} - {userInfo.phone}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    {userInfo.street}, {userInfo.ward}, {userInfo.district}, {userInfo.province}
                  </div>
                </div>
              )}
              
              {/* Toggle Address Mode */}
              {userInfo?.province && (
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <button 
                    type="button"
                    onClick={() => toggleAddressMode(true)}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600,
                      border: useSavedAddress ? '2px solid var(--color-primary)' : '2px solid var(--color-border)',
                      backgroundColor: useSavedAddress ? 'rgba(234, 179, 8, 0.1)' : '#fff',
                      color: useSavedAddress ? 'var(--color-primary)' : 'var(--color-text-muted)'
                    }}
                  >
                    Dùng địa chỉ đã lưu
                  </button>
                  <button 
                    type="button"
                    onClick={() => toggleAddressMode(false)}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600,
                      border: !useSavedAddress ? '2px solid var(--color-primary)' : '2px solid var(--color-border)',
                      backgroundColor: !useSavedAddress ? 'rgba(234, 179, 8, 0.1)' : '#fff',
                      color: !useSavedAddress ? 'var(--color-primary)' : 'var(--color-text-muted)'
                    }}
                  >
                    Nhập địa chỉ mới
                  </button>
                </div>
              )}
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '0.9rem' }}>Họ và tên *</label>
                  <input 
                    type="text" 
                    placeholder="Nguyễn Văn A" 
                    className="input-field" 
                    required 
                    value={address.fullName} 
                    onChange={e => setAddress({...address, fullName: e.target.value})} 
                    style={{ backgroundColor: '#fff' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '0.9rem' }}>Số điện thoại *</label>
                  <input 
                    type="tel" 
                    placeholder="0912 345 678" 
                    className="input-field" 
                    required 
                    value={address.phone} 
                    onChange={e => setAddress({...address, phone: e.target.value})} 
                    style={{ backgroundColor: '#fff' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '0.9rem' }}>Tỉnh/Thành phố *</label>
                  <div style={{ position: 'relative' }}>
                    <select 
                      className="input-field" 
                      required
                      value={address.province}
                      onChange={e => handleProvinceChange(e.target.value)}
                      style={{ backgroundColor: '#fff', width: '100%', appearance: 'none', cursor: 'pointer' }}
                    >
                      <option value="">-- Chọn Tỉnh/Thành phố --</option>
                      {provinces.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-text-muted)' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '0.9rem' }}>Quận/Huyện *</label>
                  <div style={{ position: 'relative' }}>
                    <select 
                      className="input-field" 
                      required
                      disabled={!address.province}
                      value={address.district}
                      onChange={e => handleDistrictChange(e.target.value)}
                      style={{ backgroundColor: '#fff', width: '100%', appearance: 'none', cursor: !address.province ? 'not-allowed' : 'pointer', opacity: !address.province ? 0.5 : 1 }}
                    >
                      <option value="">-- Chọn Quận/Huyện --</option>
                      {districts.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-text-muted)' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '0.9rem' }}>Phường/Xã *</label>
                  <div style={{ position: 'relative' }}>
                    <select 
                      className="input-field" 
                      required
                      disabled={!address.district}
                      value={address.ward}
                      onChange={e => setAddress({...address, ward: e.target.value})}
                      style={{ backgroundColor: '#fff', width: '100%', appearance: 'none', cursor: !address.district ? 'not-allowed' : 'pointer', opacity: !address.district ? 0.5 : 1 }}
                    >
                      <option value="">-- Chọn Phường/Xã --</option>
                      {wards.map((w, idx) => (
                        <option key={idx} value={w}>{w}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-text-muted)' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '0.9rem' }}>Số nhà, tên đường *</label>
                  <input 
                    type="text" 
                    placeholder="123 Đường ABC, Tầng 5" 
                    className="input-field" 
                    required
                    value={address.street}
                    onChange={e => setAddress({...address, street: e.target.value})}
                    style={{ backgroundColor: '#fff' }} 
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div style={{ backgroundColor: 'var(--color-bg-alt)', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '1.2rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={20} /> Phương thức thanh toán
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ 
                  display: 'flex', alignItems: 'center', gap: '16px', 
                  padding: '16px', borderRadius: '10px', cursor: 'pointer',
                  border: paymentMethod === 'cod' ? '2px solid var(--color-primary)' : '2px solid var(--color-border)',
                  backgroundColor: paymentMethod === 'cod' ? 'rgba(234, 179, 8, 0.1)' : '#fff',
                  transition: 'all 0.2s'
                }}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} style={{ accentColor: 'var(--color-primary)', width: '20px', height: '20px' }} />
                  <Banknote size={24} style={{ color: paymentMethod === 'cod' ? 'var(--color-primary)' : 'var(--color-text-muted)' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Thanh toán khi nhận hàng (COD)</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Trả tiền mặt cho shipper khi nhận được hàng</div>
                  </div>
                </label>
                
                <label style={{ 
                  display: 'flex', alignItems: 'center', gap: '16px', 
                  padding: '16px', borderRadius: '10px', cursor: 'pointer',
                  border: paymentMethod === 'banking' ? '2px solid var(--color-primary)' : '2px solid var(--color-border)',
                  backgroundColor: paymentMethod === 'banking' ? 'rgba(234, 179, 8, 0.1)' : '#fff',
                  transition: 'all 0.2s'
                }}>
                  <input type="radio" name="payment" value="banking" checked={paymentMethod === 'banking'} onChange={() => setPaymentMethod('banking')} style={{ accentColor: 'var(--color-primary)', width: '20px', height: '20px' }} />
                  <CreditCard size={24} style={{ color: paymentMethod === 'banking' ? 'var(--color-primary)' : 'var(--color-text-muted)' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Chuyển khoản ngân hàng</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Chuyển khoản trước qua tài khoản ngân hàng</div>
                  </div>
                </label>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit" 
              disabled={isProcessing}
              className="btn-primary" 
              style={{ width: '100%', padding: '18px', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: isProcessing ? 0.7 : 1 }}
            >
              {isProcessing ? 'Đang xử lý...' : `Đặt hàng ngay - $${finalTotal.toFixed(2)}`}
            </motion.button>
          </form>
        </motion.div>

        {/* Right Column - Order Summary */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ position: 'sticky', top: '100px' }}
        >
          <div style={{ backgroundColor: 'var(--color-bg-alt)', padding: '24px', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '1.2rem', fontWeight: 600 }}>Đơn hàng của bạn</h3>
            
            {/* Product List */}
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '16px' }}>
              {cart.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ position: 'relative' }}>
                    <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                    <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: 'var(--color-primary)', color: '#000', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                      {item.quantity}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{item.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Size: {item.size}</div>
                    <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>${((item.salePrice || item.price) * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Voucher */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Tag size={16} /> Mã giảm giá
                </span>
                <button 
                  onClick={() => setShowVoucherList(!showVoucherList)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                >
                  {showVoucherList ? 'Ẩn mã' : 'Xem mã'}
                </button>
              </div>
              
              {appliedVoucher ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#d1fae5', padding: '10px 12px', borderRadius: '8px' }}>
                  <div>
                    <span style={{ fontWeight: 600, color: '#065f46' }}>{appliedVoucher.code}</span>
                    <span style={{ marginLeft: '8px', fontSize: '0.8rem', color: '#065f46' }}>{appliedVoucher.label}</span>
                  </div>
                  <button onClick={removeVoucher} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 700 }}>×</button>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="Nhập mã voucher"
                      value={voucherInput}
                      onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                      className="input-field"
                      style={{ flex: 1, backgroundColor: '#fff' }}
                    />
                    <button onClick={applyVoucher} className="btn-primary" style={{ padding: '10px 16px' }}>Áp dụng</button>
                  </div>
                  {voucherError && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '6px' }}>{voucherError}</p>}
                </div>
              )}

              {/* Voucher List */}
              {showVoucherList && !appliedVoucher && (
                <div style={{ marginTop: '12px', backgroundColor: '#fff', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Mã giảm giá có sẵn:</div>
                  {vouchers.map((v, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => { setVoucherInput(v.code); setVoucherError(''); }}
                      style={{ padding: '8px', borderRadius: '6px', marginBottom: '6px', backgroundColor: 'var(--color-bg-alt)', cursor: 'pointer', border: '1px dashed var(--color-border)' }}
                    >
                      <div style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '0.9rem' }}>{v.code}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{v.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price Summary */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Tạm tính</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#10b981' }}>Giảm giá</span>
                  <span style={{ color: '#10b981' }}>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Phí vận chuyển</span>
                <span style={{ color: shippingFee === 0 ? '#10b981' : 'inherit' }}>
                  {shippingFee === 0 ? 'Miễn phí' : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--color-border)', marginTop: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Tổng cộng</span>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-primary)' }}>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                <ShieldCheck size={16} style={{ color: '#10b981' }} />
                <span>Thanh toán an toàn 100%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                <Truck size={16} style={{ color: '#3b82f6' }} />
                <span>Giao hàng trong 2-5 ngày</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
