import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Search, Image as ImageIcon } from 'lucide-react';
import { productsAPI } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import './AdminProducts.css';

const categories = ['Sneakers', 'Running', 'Casual', 'Sale', 'Basketball', 'Training'];
const brands = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Fictional', 'Aethel', 'Zenith'];
const sizes = ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    salePrice: '',
    image: '',
    description: '',
    sizes: [],
    stock: '',
    isNewRelease: false,
    isBestSeller: false,
    rating: 0,
    reviews: 0
  });
  
  // Image file state
  const [imageFile, setImageFile] = useState(null);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getAll();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => 
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open modal for add/edit
  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        category: product.category || '',
        price: product.price || '',
        salePrice: product.salePrice || '',
        image: product.image || '',
        description: product.description || '',
        sizes: product.sizes || [],
        stock: product.stock || '',
        isNewRelease: product.isNewRelease || false,
        isBestSeller: product.isBestSeller || false,
        rating: product.rating || 0,
        reviews: product.reviews || 0
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        brand: '',
        category: '',
        price: '',
        salePrice: '',
        image: '',
        description: '',
        sizes: [],
        stock: 100,
        isNewRelease: false,
        isBestSeller: false,
        rating: 0,
        reviews: 0
      });
    }
    setImageFile(null);
    setShowModal(true);
  };

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file' && files && files[0]) {
      setImageFile(files[0]);
      // Create preview URL
      const previewUrl = URL.createObjectURL(files[0]);
      setFormData(prev => ({ ...prev, image: previewUrl }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Handle size selection
  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
        stock: Number(formData.stock)
      };

      if (editingProduct) {
        await productsAPI.update(editingProduct.id, productData, imageFile);
      } else {
        await productsAPI.create(productData, imageFile);
      }
      
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Không thể lưu sản phẩm. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (productId) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    
    try {
      await productsAPI.delete(productId);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Không thể xóa sản phẩm.');
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
        <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1>Sản phẩm</h1>
            <p>Quản lý kho hàng của bạn</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary"
            onClick={() => openModal()}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={20} />
            Thêm sản phẩm
          </motion.button>
        </div>

        {/* Search Bar */}
        <div className="products-search">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '48px', marginBottom: 0 }}
          />
        </div>

        {/* Products Table */}
        <div className="admin-table-container">
          {loading ? (
            <div className="loading-spinner" />
          ) : filteredProducts.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Thương hiệu</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Tồn kho</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <motion.tr 
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={product.image || 'https://via.placeholder.com/50'} 
                          alt={product.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <span style={{ fontWeight: 600 }}>{product.name}</span>
                      </div>
                    </td>
                    <td>{product.brand}</td>
                    <td>{product.category}</td>
                    <td>
                      {product.salePrice ? (
                        <div>
                          <span style={{ color: '#ff4444', fontWeight: 600 }}>${product.salePrice}</span>
                          <span style={{ textDecoration: 'line-through', color: 'var(--color-text-muted)', fontSize: '0.85rem', marginLeft: '8px' }}>
                            ${product.price}
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontWeight: 600 }}>${product.price}</span>
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
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {product.isNewRelease && (
                          <span style={{ 
                            backgroundColor: 'var(--color-primary)', 
                            color: '#000',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: 600
                          }}>
                            NEW
                          </span>
                        )}
                        {product.isBestSeller && (
                          <span style={{ 
                            backgroundColor: '#f59e0b', 
                            color: '#fff',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: 600
                          }}>
                            BEST
                          </span>
                        )}
                        {!product.isNewRelease && !product.isBestSeller && (
                          <span style={{ color: 'var(--color-text-muted)' }}>-</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <button 
                        className="action-btn"
                        onClick={() => openModal(product)}
                        title="Sửa"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="action-btn danger"
                        onClick={() => handleDelete(product.id)}
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <h3>Không tìm thấy sản phẩm</h3>
              <p>{searchTerm ? 'Hãy thử điều chỉnh tìm kiếm.' : 'Thêm sản phẩm đầu tiên của bạn để bắt đầu.'}</p>
              {!searchTerm && (
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  className="btn-primary"
                  onClick={() => openModal()}
                >
                  Thêm sản phẩm
                </motion.button>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Product Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div 
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="admin-form" style={{ border: 'none', padding: 0, background: 'transparent' }}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Tên sản phẩm *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="VD: Air Max 270"
                    />
                  </div>

                  <div className="form-group">
                    <label>Thương hiệu *</label>
                    <select
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Chọn thương hiệu</option>
                      {brands.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Danh mục *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Giá *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="form-group">
                    <label>Giá khuyến mãi</label>
                    <input
                      type="number"
                      name="salePrice"
                      value={formData.salePrice}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      placeholder="Để trống nếu không có khuyến mãi"
                    />
                  </div>

                  <div className="form-group">
                    <label>Tồn kho *</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      placeholder="100"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>URL hình ảnh *</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    required
                    placeholder="https://images.unsplash.com/..."
                  />
                  {formData.image && (
                    <div style={{ marginTop: '12px' }}>
                      <img 
                        src={formData.image} 
                        alt="Preview"
                        style={{ 
                          width: '120px', 
                          height: '120px', 
                          objectFit: 'cover', 
                          borderRadius: '12px',
                          border: '1px solid var(--color-border)'
                        }}
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Mô tả *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    placeholder="Mô tả sản phẩm..."
                  />
                </div>

                <div className="form-group">
                  <label>Kích thước có sẵn *</label>
                  <div className="sizes-grid">
                    {sizes.map(size => (
                      <button
                        key={size}
                        type="button"
                        className={`size-btn ${formData.sizes.includes(size) ? 'selected' : ''}`}
                        onClick={() => handleSizeToggle(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ display: 'flex', gap: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="isNewRelease"
                      checked={formData.isNewRelease}
                      onChange={handleInputChange}
                      style={{ width: 'auto' }}
                    />
                    Sản phẩm mới
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="isBestSeller"
                      checked={formData.isBestSeller}
                      onChange={handleInputChange}
                      style={{ width: 'auto' }}
                    />
                    Bán chạy
                  </label>
                </div>

                <div className="form-actions">
                  <button 
                    type="button"
                    className="btn-outline"
                    onClick={() => setShowModal(false)}
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Đang lưu...' : editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminProducts;
