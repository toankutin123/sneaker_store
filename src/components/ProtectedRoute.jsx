import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute - Bảo vệ các route yêu cầu đăng nhập
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Lưu lại URL hiện tại để redirect sau khi login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

/**
 * AdminRoute - Bảo vệ các route chỉ dành cho admin
 */
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    // Redirect về trang chủ nếu không phải admin
    return <Navigate to="/" replace />;
  }

  return children;
};

/**
 * GuestRoute - Chỉ cho phép user chưa đăng nhập (ví dụ: trang login/register)
 */
export const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};
