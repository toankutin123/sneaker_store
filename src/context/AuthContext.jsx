import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    const savedUser = localStorage.getItem('sneaker_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Kiểm tra có phải admin không
  const isAdmin = userInfo?.isAdmin || false;

  // Kiểm tra có đang đăng nhập không
  const isAuthenticated = !!userInfo;

  // Lấy token
  const getToken = () => userInfo?.token || null;

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setUserInfo(data);
        localStorage.setItem('sneaker_user', JSON.stringify(data));
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Server error' };
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setUserInfo(data);
        localStorage.setItem('sneaker_user', JSON.stringify(data));
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Server error' };
    }
  };

  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem('sneaker_user');
    // Chuyển hướng về trang chủ sau khi logout
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ 
      userInfo, 
      setUserInfo,
      login, 
      register, 
      logout,
      isAdmin,
      isAuthenticated,
      getToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};
