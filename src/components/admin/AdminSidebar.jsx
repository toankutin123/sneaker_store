import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import './AdminSidebar.css';

const menuItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/products', icon: Package, label: 'Products' },
  { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { path: '/admin/users', icon: Users, label: 'Users' },
  { path: '/admin/events', icon: CalendarDays, label: 'Sự kiện' },
];

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <motion.aside 
      className="admin-sidebar"
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className="sidebar-header">
        <Link to="/admin" className="sidebar-logo">
          NXT<span className="accent">STEP</span>
          <span className="admin-badge">Admin</span>
        </Link>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <motion.div
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="nav-item-inner"
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </motion.div>
                  {isActive && (
                    <motion.div 
                      className="active-indicator"
                      layoutId="activeNav"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <Link to="/" className="nav-item">
          <motion.div
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
            className="nav-item-inner"
          >
            <Settings size={20} />
            <span>Back to Store</span>
          </motion.div>
        </Link>
        
        <button onClick={logout} className="nav-item logout-btn">
          <motion.div
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
            className="nav-item-inner"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </motion.div>
        </button>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
