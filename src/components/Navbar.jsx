import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, LogOut, LayoutDashboard, X, Heart, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { cartCount } = useCart();
  const { userInfo, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Search suggestions data
  const searchSuggestions = {
    brands: ['Nike', 'Adidas', 'Puma', 'New Balance', 'Converse', 'Vans'],
    categories: ['Sneakers', 'Running', 'Casual', 'Basketball', 'Training'],
    popular: ['Air Max', 'Ultraboost', 'Dunk', 'Yeezy', 'Air Force 1']
  };

  const getFilteredSuggestions = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const all = [
      ...searchSuggestions.brands.map(b => ({ type: 'brand', text: b })),
      ...searchSuggestions.categories.map(c => ({ type: 'category', text: c })),
      ...searchSuggestions.popular.map(p => ({ type: 'popular', text: p }))
    ];
    return all.filter(item => item.text.toLowerCase().includes(query)).slice(0, 6);
  };

  const filteredSuggestions = getFilteredSuggestions();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (text) => {
    navigate(`/shop?search=${encodeURIComponent(text)}`);
    setShowSearch(false);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  return (
    <motion.header 
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="container nav-container">
        <Link to="/" className="logo">
          <motion.span whileHover={{ scale: 1.05 }} style={{ display: 'inline-block' }}>
            NXT<span className="accent">STEP</span>
          </motion.span>
        </Link>

        <nav className="nav-links">
          {['/', '/shop'].map((path) => (
            <Link to={path} className={`nav-link ${location.pathname === path ? 'active' : ''}`} key={path}>
              {path === '/' ? 'Trang chủ' : 'Cửa hàng'}
              {location.pathname === path && (
                <motion.div layoutId="underline" className="nav-underline" />
              )}
            </Link>
          ))}
          <Link to="/shop?category=Sale" className="nav-link sale-link">Khuyến mãi</Link>

          {/* Loyalty Link - Chỉ hiện cho user đã đăng nhập */}
          {userInfo && (
            <Link to="/loyalty" className={`nav-link ${location.pathname === '/loyalty' ? 'active' : ''}`}>
              Đặc quyền
              {location.pathname === '/loyalty' && (
                <motion.div layoutId="underline" className="nav-underline" />
              )}
            </Link>
          )}
        </nav>

        <div className="nav-actions">
          {/* Search Button */}
          <motion.button 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }} 
            className="icon-btn"
            onClick={() => setShowSearch(!showSearch)}
            title="Tìm kiếm"
          >
            <Search size={22} />
          </motion.button>
          
          {userInfo ? (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* User Dropdown Menu */}
              <div className="user-menu-container">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="user-menu-trigger"
                  onClick={() => document.getElementById('user-dropdown').classList.toggle('show')}
                >
                  {userInfo.avatar ? (
                    <img
                      src={userInfo.avatar}
                      alt="Avatar"
                      style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-primary)' }}
                    />
                  ) : (
                    <div className="user-avatar-placeholder">
                      <User size={20} />
                    </div>
                  )}
                  <ChevronDown size={16} className="dropdown-arrow" />
                </motion.button>

                <div id="user-dropdown" className="user-dropdown">
                  <div className="dropdown-header">
                    <span className="dropdown-name">{userInfo.username || userInfo.email?.split('@')[0]}</span>
                    <span className="dropdown-email">{userInfo.email}</span>
                  </div>
                  <div className="dropdown-divider" />
                  <Link to="/profile" className="dropdown-item" onClick={() => document.getElementById('user-dropdown').classList.remove('show')}>
                    <User size={18} />
                    <span>Tài khoản của tôi</span>
                  </Link>
                  <Link to="/profile?tab=wishlist" className="dropdown-item" onClick={() => document.getElementById('user-dropdown').classList.remove('show')}>
                    <Heart size={18} />
                    <span>Yêu thích</span>
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="dropdown-item admin-item" onClick={() => document.getElementById('user-dropdown').classList.remove('show')}>
                      <LayoutDashboard size={18} />
                      <span>Bảng quản trị</span>
                    </Link>
                  )}
                  <div className="dropdown-divider" />
                  <button className="dropdown-item logout-item" onClick={() => { logout(); document.getElementById('user-dropdown').classList.remove('show'); }}>
                    <LogOut size={18} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link to="/login" className="icon-btn"><User size={22} /></Link>
            </motion.div>
          )}

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link to="/cart" className="icon-btn cart-btn">
              <ShoppingCart size={22} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span 
                    key={cartCount}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="cart-badge"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'var(--color-bg-alt)',
              padding: '20px',
              borderBottom: '1px solid var(--color-border)',
              zIndex: 99
            }}
          >
            <div className="container" style={{ maxWidth: '800px' }}>
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Tìm kiếm giày, thương hiệu..."
                    autoFocus
                    className="input-field"
                    style={{ flex: 1, marginBottom: 0, paddingRight: '40px' }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => { setSearchQuery(''); setShowSuggestions(false); }}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--color-text-muted)',
                        padding: 0,
                        display: 'flex'
                      }}
                    >
                      <X size={16} />
                    </button>
                  )}
                  {/* Search Suggestions */}
                  <AnimatePresence>
                    {showSuggestions && filteredSuggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="search-suggestions"
                      >
                        {filteredSuggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`suggestion-item suggestion-${suggestion.type}`}
                            onClick={() => handleSuggestionClick(suggestion.text)}
                          >
                            <Search size={14} className="suggestion-icon" />
                            <span>{suggestion.text}</span>
                            <span className="suggestion-label">
                              {suggestion.type === 'brand' ? 'Thương hiệu' :
                               suggestion.type === 'category' ? 'Danh mục' : 'Phổ biến'}
                            </span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary"
                >
                  Tìm kiếm
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  onClick={() => { setShowSearch(false); setShowSuggestions(false); }}
                  style={{
                    padding: '12px',
                    backgroundColor: 'var(--color-bg-light)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <X size={20} />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
