import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Grid, List, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../services/api';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initCategory = searchParams.get('category') || '';
  const initSearch = searchParams.get('search') || '';
  
  const [filterCategory, setFilterCategory] = useState(initCategory);
  const [filterBrand, setFilterBrand] = useState('');
  const [maxPrice, setMaxPrice] = useState(300);
  const [searchQuery, setSearchQuery] = useState(initSearch);
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(true);

  // State cho API
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamic categories and brands from products
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))];
    return cats;
  }, [products]);

  const brands = useMemo(() => {
    const brs = [...new Set(products.map(p => p.brand).filter(Boolean))];
    return brs;
  }, [products]);

  // Fetch products từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getAll();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Không thể tải sản phẩm');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    setFilterCategory(searchParams.get('category') || '');
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    // Filter by category
    if (filterCategory === 'Sale') {
      // "Khuyến mãi" category shows products with active discounts (salePrice set)
      result = result.filter(p => p.salePrice && parseFloat(p.salePrice) < parseFloat(p.price));
    } else if (filterCategory) {
      result = result.filter(p => p.category === filterCategory);
    }
    
    // Filter by brand
    if (filterBrand) {
      result = result.filter(p => p.brand === filterBrand);
    }
    
    // Filter by price
    result = result.filter(p => (p.salePrice || p.price) <= maxPrice);
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
    }
    
    // Sort products
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-high':
        result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'bestseller':
        result = result.filter(p => p.isBestSeller);
        break;
      default:
        break;
    }
    
    return result;
  }, [products, filterCategory, filterBrand, maxPrice, searchQuery, sortBy]);

  const clearFilters = () => {
    setFilterCategory('');
    setFilterBrand('');
    setMaxPrice(300);
    setSortBy('default');
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="container" style={{ padding: '40px 20px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      
      {/* Sidebar Filters - Desktop */}
      <aside style={{ 
        flex: '1 1 250px', 
        maxWidth: '300px',
        display: showFilters ? 'block' : 'none'
      }} className="filter-sidebar">
        <div style={{ position: 'sticky', top: '100px' }}>
          <h2 style={{ marginBottom: '24px', fontWeight: 700, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={20} /> Bộ lọc
          </h2>
          
          {/* Search */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '12px', fontSize: '1.1rem', fontWeight: 600 }}>Tìm kiếm</h3>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm sản phẩm..."
              className="input-field"
              style={{ backgroundColor: 'var(--color-bg-alt)' }}
            />
          </div>
          
          {/* Category */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '12px', fontSize: '1.1rem', fontWeight: 600 }}>Danh mục</h3>
            <select 
              value={filterCategory} 
              onChange={e => {
                setFilterCategory(e.target.value);
                const newParams = { ...Object.fromEntries(searchParams) };
                if (e.target.value) {
                  newParams.category = e.target.value;
                } else {
                  delete newParams.category;
                }
                setSearchParams(newParams);
              }}
              className="input-field"
              style={{ backgroundColor: 'var(--color-bg-alt)' }}
            >
              <option value="">Tất cả danh mục</option>
              <option value="Sale" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Khuyến mãi</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Brand */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '12px', fontSize: '1.1rem', fontWeight: 600 }}>Thương hiệu</h3>
            <select 
              value={filterBrand} 
              onChange={e => setFilterBrand(e.target.value)}
              className="input-field"
              style={{ backgroundColor: 'var(--color-bg-alt)' }}
            >
              <option value="">Tất cả thương hiệu</option>
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Price Range */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '12px', fontSize: '1.1rem', fontWeight: 600 }}>
              Giá tối đa: ${maxPrice}
            </h3>
            <input 
              type="range" 
              min="50" 
              max="300" 
              value={maxPrice} 
              onChange={e => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-primary)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              <span>$50</span>
              <span>$300</span>
            </div>
          </div>
          
          {/* Sort By */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '12px', fontSize: '1.1rem', fontWeight: 600 }}>Sắp xếp theo</h3>
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
              className="input-field"
              style={{ backgroundColor: 'var(--color-bg-alt)' }}
            >
              <option value="default">Mặc định</option>
              <option value="price-low">Giá: Thấp đến cao</option>
              <option value="price-high">Giá: Cao đến thấp</option>
              <option value="name">Tên: A-Z</option>
              <option value="rating">Đánh giá cao</option>
              <option value="newest">Mới nhất</option>
              <option value="bestseller">Bán chạy</option>
            </select>
          </div>
        
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-outline" 
            style={{ width: '100%' }}
            onClick={clearFilters}
          >
            Xóa tất cả bộ lọc
          </motion.button>
        </div>
      </aside>

      {/* Product Grid */}
      <main style={{ flex: '3 1 600px' }}>
        {/* Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
              {filterCategory === 'Sale' ? 'Khuyến mãi' : (filterCategory || (searchQuery ? `Kết quả tìm kiếm: "${searchQuery}"` : 'Tất cả giày'))}
            </h2>
            <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{filteredProducts.length} Sản phẩm</span>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Mobile Filter Toggle */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-outline"
              onClick={() => setShowFilters(!showFilters)}
              style={{ display: 'none' }}
              className="mobile-filter-btn"
            >
              <Filter size={18} /> Bộ lọc
            </motion.button>
            
            {/* Sort Dropdown - Mobile */}
            <div style={{ position: 'relative' }}>
              <select 
                value={sortBy} 
                onChange={e => setSortBy(e.target.value)}
                className="input-field"
                style={{ 
                  backgroundColor: 'var(--color-bg-alt)',
                  paddingRight: '36px',
                  minWidth: '180px'
                }}
              >
                <option value="default">Mặc định</option>
                <option value="price-low">Giá: Thấp đến cao</option>
                <option value="price-high">Giá: Cao đến thấp</option>
                <option value="name">Tên: A-Z</option>
                <option value="rating">Đánh giá cao</option>
                <option value="newest">Mới nhất</option>
                <option value="bestseller">Bán chạy</option>
              </select>
              <ChevronDown size={16} style={{ 
                position: 'absolute', 
                right: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: 'var(--color-text-muted)'
              }} />
            </div>
          </div>
        </div>

        {/* Active Filters Tags */}
        {(filterCategory || filterBrand || searchQuery || maxPrice < 300 || sortBy !== 'default') && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {filterCategory && (
              <span style={{
                backgroundColor: 'var(--color-primary)',
                color: '#000',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                {filterCategory}
                <button onClick={() => { setFilterCategory(''); setSearchParams(p => { const n = {...Object.fromEntries(p)}; delete n.category; return n; }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>×</button>
              </span>
            )}
            {filterBrand && (
              <span style={{
                backgroundColor: 'var(--color-bg-alt)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                {filterBrand}
                <button onClick={() => setFilterBrand('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>×</button>
              </span>
            )}
            {searchQuery && (
              <span style={{
                backgroundColor: 'var(--color-bg-alt)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                Tìm: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>×</button>
              </span>
            )}
            {maxPrice < 300 && (
              <span style={{
                backgroundColor: 'var(--color-bg-alt)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                Dưới ${maxPrice}
                <button onClick={() => setMaxPrice(300)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>×</button>
              </span>
            )}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{ 
                backgroundColor: 'var(--color-bg-alt)', 
                borderRadius: 'var(--radius-lg)', 
                height: '350px',
                animation: 'pulse 1.5s ease-in-out infinite'
              }} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div 
            layout
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}
          >
            <AnimatePresence>
              {filteredProducts.map(product => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={product.id}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            style={{ padding: '60px 0', textAlign: 'center', backgroundColor: 'var(--color-bg-alt)', borderRadius: 'var(--radius-lg)' }}
          >
            <h3 style={{ fontWeight: 600, marginBottom: '8px' }}>Không tìm thấy sản phẩm</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary"
              onClick={clearFilters}
            >
              Xóa bộ lọc
            </motion.button>
          </motion.div>
        )}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .filter-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            max-width: 100% !important;
            background-color: var(--color-bg-light) !important;
            z-index: 1000 !important;
            padding: 20px !important;
            overflow-y: auto !important;
          }
          .mobile-filter-btn {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};
export default Shop;
