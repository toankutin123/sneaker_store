import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../services/api';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } }
};

const HERO_IMAGE = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=2000";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsAPI.getAll();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);
  const newReleases = products.filter(p => p.isNewRelease).slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        height: '70vh', 
        minHeight: '600px', 
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#000', 
        color: '#fff',
        overflow: 'hidden'
      }}>
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <img 
            src={HERO_IMAGE}
            alt="Hero Sneakers" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.style.backgroundColor = '#111';
            }}
          />
        </motion.div>
        
        {/* Overlay gradient for better text visibility */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)'
        }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <motion.span 
              variants={fadeUp} 
              style={{ 
                color: '#fbbf24', 
                fontWeight: 700, 
                letterSpacing: '3px', 
                textTransform: 'uppercase', 
                marginBottom: '16px', 
                display: 'block',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}
            >
              New Collection 2026
            </motion.span>
            
            <motion.h1 variants={fadeUp} style={{ 
              fontSize: 'clamp(3rem, 8vw, 5rem)', 
              fontWeight: 800, 
              lineHeight: 1.05, 
              marginBottom: '24px', 
              maxWidth: '700px', 
              letterSpacing: '-1px',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}>
              ELEVATE YOUR <br/><span style={{ color: '#fbbf24' }}>GAME</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} style={{ 
              fontSize: '1.25rem', 
              color: '#eaeaea', 
              marginBottom: '40px', 
              maxWidth: '500px', 
              fontWeight: 300,
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>
              Premium aesthetics meet unmatched performance. Step into the future of streetwear.
            </motion.p>
            
            <motion.div variants={fadeUp} style={{ display: 'flex', gap: '16px' }}>
              <Link to="/shop" className="btn-primary">Mua sắm ngay</Link>
              <Link to="/shop?category=Sale" className="btn-outline" style={{ 
                color: '#fff', 
                borderColor: 'rgba(255,255,255,0.5)', 
                backgroundColor: 'rgba(0,0,0,0.3)',
                backdropFilter: 'blur(5px)'
              }}>Xem ưu đãi</Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container" style={{ padding: '100px 20px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '12px' }}>
            Khám phá
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
            Mua sắm theo danh mục
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}
        >
          {['Sneakers', 'Running', 'Casual', 'Sale'].map((cat, idx) => (
            <motion.div variants={fadeUp} key={idx}>
              <Link to={`/shop?category=${cat}`} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--color-bg-alt)',
                padding: '32px 20px',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center',
                fontWeight: 600,
                fontSize: '1rem',
                border: '1px solid var(--color-border)',
                transition: 'all 0.3s ease',
                color: 'var(--color-text-main)',
                minHeight: '120px'
              }}
              className="category-card"
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                e.currentTarget.style.color = '#000';
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-bg-alt)';
                e.currentTarget.style.color = 'var(--color-text-main)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}>
                {cat}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="container" style={{ padding: '80px 20px 100px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', borderBottom: '1px solid var(--color-border)', paddingBottom: '24px' }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
                Bộ sưu tập
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--color-text-main)' }}>
                Sản phẩm bán chạy
              </h2>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
              <Link to="/shop" style={{ fontWeight: 600, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.2s' }}>
                Xem tất cả
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </motion.div>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '28px'
            }}
          >
            {bestSellers.map(product => (
              <motion.div variants={fadeUp} key={product.id}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* New Releases */}
      {newReleases.length > 0 && (
        <section style={{ backgroundColor: 'var(--color-bg-alt)', padding: '80px 0' }}>
          <div className="container" style={{ padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', borderBottom: '1px solid var(--color-border)', paddingBottom: '24px' }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
                  Cập nhật mới
                </span>
                <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--color-text-main)' }}>
                  Sản phẩm mới
                </h2>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
                <Link to="/shop?isNew=true" style={{ fontWeight: 600, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.2s' }}>
                  Xem tất cả
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </motion.div>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '28px'
              }}
            >
              {newReleases.map(product => (
                <motion.div variants={fadeUp} key={product.id}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* All Products Preview */}
      {!loading && products.length > 0 && bestSellers.length === 0 && newReleases.length === 0 && (
        <section className="container" style={{ padding: '40px 20px 100px' }}>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-1px', marginBottom: '40px' }}
          >
            Featured Products
          </motion.h2>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}
          >
            {products.slice(0, 4).map(product => (
              <motion.div variants={fadeUp} key={product.id}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <section className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Chưa có sản phẩm nào</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>Hãy quay lại sau để xem những sản phẩm mới!</p>
            <Link to="/shop" className="btn-primary">Khám phá cửa hàng</Link>
          </motion.div>
        </section>
      )}

      {/* Brand CTA */}
      <section style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        padding: '100px 20px',
        textAlign: 'center',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(57,255,20,0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          right: '-5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="container"
          style={{ maxWidth: '600px', position: 'relative', zIndex: 1 }}
        >
          <span style={{
            fontSize: '0.85rem',
            color: '#fbbf24',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '3px',
            display: 'block',
            marginBottom: '16px'
          }}>
            Ưu đãi độc quyền
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '20px', letterSpacing: '-1px' }}>
            SẴN SÀNG NÂNG CẤP?
          </h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '40px', fontWeight: 400, color: '#aaa', lineHeight: 1.7 }}>
            Tham gia danh sách VIP để nhận <strong style={{ color: '#fbbf24' }}>ưu đãi 15%</strong> cho đơn hàng đầu tiên và quyền truy cập sớm vào các sản phẩm độc quyền.
          </p>
          <div style={{
            display: 'flex',
            gap: '12px',
            maxWidth: '480px',
            margin: '0 auto',
            background: 'rgba(255,255,255,0.05)',
            padding: '8px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              style={{
                flex: 1,
                padding: '16px 20px',
                border: 'none',
                borderRadius: '8px',
                outline: 'none',
                fontFamily: 'inherit',
                background: '#111',
                color: '#fff',
                fontSize: '1rem'
              }}
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              style={{
                backgroundColor: '#fbbf24',
                color: '#000',
                padding: '0 32px',
                fontWeight: 700,
                borderRadius: '8px',
                cursor: 'pointer',
                border: 'none',
                textTransform: 'uppercase',
                fontSize: '0.9rem',
                letterSpacing: '0.5px',
                whiteSpace: 'nowrap'
              }}
            >
              Tham gia
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
