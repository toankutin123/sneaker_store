import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const { userInfo } = useAuth();

  // Kiểm tra đăng nhập và quyền admin
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (!userInfo.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
