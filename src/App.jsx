import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import LoyaltyDashboard from './pages/LoyaltyDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminLoyalty from './pages/admin/AdminLoyalty';
import AdminEvents from './pages/admin/AdminEvents';

// Protected Routes
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/ProtectedRoute';

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -15 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4
};

function App() {
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleAddToCartFromChatbot = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  return (
    <div className="app-container">
      {/* Chỉ hiển thị Navbar/Footer cho user routes, không hiển thị cho admin */}
      {!location.pathname.startsWith('/admin') && <Navbar />}
      <main className="main-content" style={{ minHeight: '80vh' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/shop" element={<PageWrapper><Shop /></PageWrapper>} />
            <Route path="/product/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
            <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />

            {/* Guest Routes - Chỉ dành cho user chưa đăng nhập */}
            <Route path="/login" element={<GuestRoute><PageWrapper><Login /></PageWrapper></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><PageWrapper><Register /></PageWrapper></GuestRoute>} />

            {/* Protected Routes - Cần đăng nhập */}
            <Route path="/checkout" element={<ProtectedRoute><PageWrapper><Checkout /></PageWrapper></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><PageWrapper><Profile /></PageWrapper></ProtectedRoute>} />
            <Route path="/loyalty" element={<ProtectedRoute><PageWrapper><LoyaltyDashboard /></PageWrapper></ProtectedRoute>} />

            {/* Admin Routes - Chỉ dành cho admin */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/coupons" element={<AdminRoute><AdminCoupons /></AdminRoute>} />
            <Route path="/admin/loyalty" element={<AdminRoute><AdminLoyalty /></AdminRoute>} />
            <Route path="/admin/events" element={<AdminRoute><AdminEvents /></AdminRoute>} />

            {/* 404 Page */}
            <Route path="*" element={
              <PageWrapper>
                <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
                  <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '16px' }}>404</h1>
                  <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', marginBottom: '32px' }}>
                    Trang không tìm thấy
                  </p>
                  <a href="/" className="btn-primary">Về trang chủ</a>
                </div>
              </PageWrapper>
            } />
          </Routes>
        </AnimatePresence>
      </main>
      {!location.pathname.startsWith('/admin') && <Footer />}
      {!location.pathname.startsWith('/admin') && (
        <Chatbot onAddToCart={handleAddToCartFromChatbot} />
      )}
    </div>
  );
}

const PageWrapper = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

export default App;
