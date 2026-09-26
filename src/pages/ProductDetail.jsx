import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Check, Star, Heart, User } from 'lucide-react';
import { mockSneakers } from '../data/mockData';
import { productsAPI, reviewsAPI, wishlistAPI } from '../services/api';
import SizeGuideModal from '../components/SizeGuideModal';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'tween', ease: 'easeOut', duration: 0.4 } }
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSize, setSelectedSize] = useState('');
  const [added, setAdded] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(false);
  
  // Wishlist state
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productsAPI.getById(id);
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        const foundProduct = mockSneakers.find(p => p.id === id);
        if (foundProduct) {
          setProduct(foundProduct);
          if (foundProduct.sizes && foundProduct.sizes.length > 0) {
            setSelectedSize(foundProduct.sizes[0]);
          }
        } else {
          setError("Product not found");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    if (product) {
      fetchReviews();
      checkWishlist();
      checkPurchaseStatus();
    }
  }, [product]);

  // Check if user has purchased this product
  const checkPurchaseStatus = async () => {
    if (!isAuthenticated) {
      setHasPurchased(false);
      return;
    }
    
    setCheckingPurchase(true);
    try {
      const data = await reviewsAPI.checkPurchased(id);
      setHasPurchased(data.hasPurchased);
    } catch (err) {
      console.error('Error checking purchase status:', err);
      setHasPurchased(false);
    } finally {
      setCheckingPurchase(false);
    }
  };

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const data = await reviewsAPI.getByProduct(id);
      setReviews(data.reviews || []);
      setReviewStats({
        averageRating: data.averageRating || 0,
        totalReviews: data.totalReviews || 0
      });
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const checkWishlist = async () => {
    if (!isAuthenticated) return;
    try {
      const data = await wishlistAPI.check(id);
      setInWishlist(data.inWishlist);
    } catch (err) {
      console.error('Error checking wishlist:', err);
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setWishlistLoading(true);
    try {
      if (inWishlist) {
        await wishlistAPI.remove(id);
        setInWishlist(false);
      } else {
        await wishlistAPI.add(id);
        setInWishlist(true);
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await reviewsAPI.create(id, newReview.rating, newReview.comment);
      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
      fetchReviews();
    } catch (err) {
      console.error('Error submitting review:', err);
      if (err.message.includes('cần mua sản phẩm')) {
        alert('Bạn cần mua sản phẩm này trước khi đánh giá. Chỉ khách hàng đã mua hàng mới có thể đánh giá.');
      } else {
        alert(err.message || 'Không thể gửi đánh giá');
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  if(loading) return <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}><h2>Đang tải...</h2></div>;
  if(error || !product) return <div className="container" style={{ padding: '80px 20px', textAlign: 'center', color: 'red' }}><h2>{error || 'Không tìm thấy'}</h2></div>;

  const handleAdd = () => {
    addToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const renderStars = (rating, interactive = false, size = 20) => {
    return (
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={size}
            fill={star <= rating ? 'var(--color-primary)' : 'none'}
            color={star <= rating ? 'var(--color-primary)' : 'var(--color-text-muted)'}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
            onClick={() => interactive && setNewReview({ ...newReview, rating: star })}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container" style={{ padding: '60px 20px' }}>
      <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap', marginBottom: '80px' }}>
        {/* Image Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ flex: '1 1 400px', backgroundColor: 'var(--color-bg-alt)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative' }}
        >
          <motion.img 
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            src={product.image} 
            alt={product.name} 
            style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover', cursor: 'crosshair' }} 
          />
          {/* Wishlist Button on Image */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToWishlist}
            disabled={wishlistLoading}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#fff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          >
            <Heart 
              size={24} 
              fill={inWishlist ? '#ef4444' : 'none'} 
              color={inWishlist ? '#ef4444' : '#666'} 
            />
          </motion.button>
        </motion.div>

        {/* Details */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          style={{ flex: '1 1 400px' }}
        >
          <motion.p variants={fadeUp} style={{ color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', fontWeight: 600 }}>
            {product.brand}
          </motion.p>
          <motion.h1 variants={fadeUp} style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.1, letterSpacing: '-1px' }}>{product.name}</motion.h1>
          
          <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            {renderStars(Math.round(reviewStats.averageRating || product.rating || 0))}
            <span style={{ fontWeight: 600 }}>{reviewStats.averageRating || product.rating || 0}</span>
            <span style={{ color: 'var(--color-text-muted)' }}>({reviewStats.totalReviews || product.reviews || 0} đánh giá)</span>
          </motion.div>

          <motion.div variants={fadeUp} style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '24px' }}>
            {product.salePrice ? (
               <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                 <span style={{ color: '#ef4444' }}>${product.salePrice}</span>
                 <span style={{ textDecoration: 'line-through', color: 'var(--color-text-muted)', fontSize: '1.2rem', fontWeight: 500 }}>${product.price}</span>
                 <span style={{ 
                   backgroundColor: '#ef4444', 
                   color: '#fff', 
                   padding: '2px 8px', 
                   borderRadius: '4px', 
                   fontSize: '0.85rem',
                   fontWeight: 600
                 }}>
                   {Math.round((1 - product.salePrice / product.price) * 100)}% OFF
                 </span>
               </div>
            ) : (
              <span>${product.price}</span>
            )}
          </motion.div>

          <motion.p variants={fadeUp} style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '32px', fontSize: '1.05rem' }}>
            {product.description}
          </motion.p>

          <motion.div variants={fadeUp} style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Chọn size</h3>
              <span 
                style={{ color: 'var(--color-text-muted)', textDecoration: 'underline', cursor: 'pointer', fontWeight: 500 }}
                onClick={() => {
                  console.log('=== SIZE GUIDE CLICK ===');
                  console.log('Product:', product);
                  console.log('showSizeGuide before:', showSizeGuide);
                  setShowSizeGuide(true);
                  console.log('Modal should open now');
                }}
              >Hướng dẫn chọn size</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {product.sizes && product.sizes.map(size => (
                <motion.button 
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{ 
                    width: '64px', height: '64px', borderRadius: 'var(--radius-sm)', 
                    border: `2px solid ${selectedSize === size ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    backgroundColor: selectedSize === size ? 'var(--color-primary)' : 'transparent',
                    color: selectedSize === size ? '#000' : 'var(--color-text-main)',
                    fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.2s ease'
                  }}
                >
                  {size}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} style={{ display: 'flex', gap: '16px' }}>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary" 
              style={{ flex: 1, padding: '16px', fontSize: '1.1rem' }}
              onClick={handleAdd}
            >
              {added ? <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}><Check size={20} /> Đã thêm vào giỏ</motion.span> : 'Thêm vào giỏ hàng'}
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-outline" 
              style={{ padding: '16px', fontSize: '1.1rem', borderColor: 'var(--color-text-main)' }}
              onClick={handleAddToWishlist}
              disabled={wishlistLoading}
            >
              <Heart size={20} fill={inWishlist ? '#ef4444' : 'none'} color={inWishlist ? '#ef4444' : 'currentColor'} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-outline" 
              style={{ flex: 1, padding: '16px', fontSize: '1.1rem', borderColor: 'var(--color-text-main)' }}
              onClick={() => {
                handleAdd();
                navigate('/checkout');
              }}
            >
              Mua ngay
            </motion.button>
          </motion.div>

        </motion.div>
      </div>

      {/* Reviews Section */}
      <section style={{ 
        borderTop: '1px solid var(--color-border)', 
        paddingTop: '60px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Đánh giá khách hàng</h2>
          {!isAuthenticated ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-outline"
              onClick={() => navigate('/login')}
            >
              Đăng nhập để đánh giá
            </motion.button>
          ) : !hasPurchased && !checkingPurchase ? (
            <div style={{ 
              padding: '12px 16px', 
              backgroundColor: 'var(--color-bg-alt)', 
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-muted)',
              fontSize: '0.9rem'
            }}>
              Mua sản phẩm này để đánh giá
            </div>
          ) : !showReviewForm && hasPurchased && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary"
              onClick={() => setShowReviewForm(true)}
            >
              Viết đánh giá
            </motion.button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{ 
              backgroundColor: 'var(--color-bg-alt)', 
              padding: '24px', 
              borderRadius: 'var(--radius-lg)', 
              marginBottom: '32px' 
            }}
          >
            <h3 style={{ marginBottom: '16px', fontWeight: 600 }}>Viết đánh giá của bạn</h3>
            <form onSubmit={handleSubmitReview}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Đánh giá</label>
                {renderStars(newReview.rating, true, 28)}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Nhận xét của bạn</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                  className="input-field"
                  rows="4"
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary"
                  disabled={submittingReview}
                >
                  {submittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setShowReviewForm(false);
                    setNewReview({ rating: 5, comment: '' });
                  }}
                  className="btn-outline"
                >
                  Hủy
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Reviews Stats */}
        {reviewStats.totalReviews > 0 && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            marginBottom: '32px',
            padding: '20px',
            backgroundColor: 'var(--color-bg-alt)',
            borderRadius: 'var(--radius-lg)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 800 }}>{reviewStats.averageRating}</div>
              {renderStars(Math.round(reviewStats.averageRating))}
              <div style={{ color: 'var(--color-text-muted)', marginTop: '4px' }}>{reviewStats.totalReviews} đánh giá</div>
            </div>
          </div>
        )}

        {/* Reviews List */}
        {loadingReviews ? (
          <p>Đang tải đánh giá...</p>
        ) : reviews.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {reviews.map(review => (
              <div key={review.id} style={{
                backgroundColor: 'var(--color-bg-alt)',
                padding: '20px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      color: '#000'
                    }}>
                      {review.user?.username?.[0]?.toUpperCase() || <User size={20} />}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600 }}>{review.user?.username || 'Ẩn danh'}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {renderStars(review.rating, false, 14)}
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {review.comment && (
                  <p style={{ color: 'var(--color-text-main)', lineHeight: 1.6 }}>{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            backgroundColor: 'var(--color-bg-alt)', 
            borderRadius: 'var(--radius-lg)' 
          }}>
            <Star size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }} />
            <h3 style={{ marginBottom: '8px' }}>Chưa có đánh giá nào</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>Hãy là người đầu tiên đánh giá sản phẩm này!</p>
          </div>
        )}
      </section>

      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        product={product}
      />
    </div>
  );
};
export default ProductDetail;
