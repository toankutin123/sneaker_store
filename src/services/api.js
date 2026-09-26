// API Service Layer - Kết nối Frontend với Backend

const API_BASE = '/api';
const SERVER_URL = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:5001` : '';

// Helper function cho fetch
async function fetchAPI(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Thêm token nếu có
  const user = JSON.parse(localStorage.getItem('sneaker_user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API Error');
  }

  return data;
}

// ==================== AUTH API ====================

export const authAPI = {
  login: async (email, password) => {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (username, email, password) => {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },
};

// ==================== PRODUCTS API ====================

export const productsAPI = {
  // Lấy tất cả sản phẩm
  getAll: async () => {
    return fetchAPI('/products');
  },

  // Lấy sản phẩm theo ID
  getById: async (id) => {
    return fetchAPI(`/products/${id}`);
  },

  // Tạo sản phẩm mới (Admin only) - hỗ trợ upload ảnh
  create: async (productData, imageFile = null) => {
    if (imageFile) {
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (key === 'sizes') {
          formData.append(key, JSON.stringify(productData[key]));
        } else {
          formData.append(key, productData[key]);
        }
      });
      formData.append('image', imageFile);

      const user = JSON.parse(localStorage.getItem('sneaker_user') || 'null');
      const response = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
          'Authorization': user?.token ? `Bearer ${user.token}` : ''
        },
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'API Error');
      return data;
    }
    return fetchAPI('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // Cập nhật sản phẩm (Admin only) - hỗ trợ upload ảnh
  update: async (id, productData, imageFile = null) => {
    if (imageFile) {
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (key === 'sizes') {
          formData.append(key, JSON.stringify(productData[key]));
        } else {
          formData.append(key, productData[key]);
        }
      });
      formData.append('image', imageFile);

      const user = JSON.parse(localStorage.getItem('sneaker_user') || 'null');
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': user?.token ? `Bearer ${user.token}` : ''
        },
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'API Error');
      return data;
    }
    return fetchAPI(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  // Xóa sản phẩm (Admin only)
  delete: async (id) => {
    return fetchAPI(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== ORDERS API ====================

export const ordersAPI = {
  // Tạo đơn hàng mới
  create: async (orderData) => {
    return fetchAPI('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Lấy đơn hàng theo ID
  getById: async (id) => {
    return fetchAPI(`/orders/${id}`);
  },

  // Lấy đơn hàng của user hiện tại
  getMyOrders: async () => {
    return fetchAPI('/orders/mine');
  },

  // Lấy tất cả đơn hàng (Admin only)
  getAll: async () => {
    return fetchAPI('/orders');
  },

  // Cập nhật trạng thái đơn hàng (Admin only)
  updateStatus: async (id, status) => {
    return fetchAPI(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// ==================== USERS API (Admin) ====================

export const usersAPI = {
  getAll: async () => {
    return fetchAPI('/users/all');
  },
};

// ==================== PROFILE API ====================

export const profileAPI = {
  get: async () => {
    return fetchAPI('/profile');
  },
  update: async (data) => {
    return fetchAPI('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  changePassword: async (currentPassword, newPassword) => {
    return fetchAPI('/profile/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
  uploadAvatar: async (file) => {
    const user = JSON.parse(localStorage.getItem('sneaker_user') || 'null');
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch('/api/profile/avatar', {
      method: 'POST',
      headers: {
        'Authorization': user?.token ? `Bearer ${user.token}` : ''
      },
      body: formData
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Upload failed');
    return data;
  }
};

// ==================== WISHLIST API ====================

export const wishlistAPI = {
  get: async () => {
    return fetchAPI('/wishlist');
  },
  add: async (productId) => {
    return fetchAPI('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  },
  remove: async (productId) => {
    return fetchAPI(`/wishlist/${productId}`, {
      method: 'DELETE',
    });
  },
  check: async (productId) => {
    return fetchAPI(`/wishlist/check/${productId}`);
  }
};

// ==================== REVIEWS API ====================

export const reviewsAPI = {
  getByProduct: async (productId) => {
    return fetchAPI(`/reviews/product/${productId}`);
  },
  create: async (productId, rating, comment) => {
    return fetchAPI(`/reviews/product/${productId}`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    });
  },
  delete: async (reviewId) => {
    return fetchAPI(`/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  },
  checkPurchased: async (productId) => {
    return fetchAPI(`/reviews/check-purchased/${productId}`);
  }
};

// ==================== LOYALTY API ====================

export const loyaltyAPI = {
  getProfile: async () => {
    return fetchAPI('/loyalty/profile');
  },
  getTiers: async () => {
    return fetchAPI('/loyalty/tiers');
  },
  previewPoints: async (amount) => {
    return fetchAPI('/loyalty/preview', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  },
  redeem: async (points, orderId = null) => {
    return fetchAPI('/loyalty/redeem', {
      method: 'POST',
      body: JSON.stringify({ points, orderId }),
    });
  },
  getHistory: async () => {
    return fetchAPI('/loyalty/history');
  },
  applyReferral: async (referralCode) => {
    return fetchAPI('/loyalty/referral', {
      method: 'POST',
      body: JSON.stringify({ referralCode }),
    });
  }
};

// ==================== COUPON API ====================

export const couponAPI = {
  getAll: async () => {
    return fetchAPI('/coupons');
  },
  getPublic: async () => {
    return fetchAPI('/coupons/public');
  },
  validate: async (code, orderAmount) => {
    return fetchAPI('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, orderAmount }),
    });
  },
  create: async (couponData) => {
    return fetchAPI('/coupons', {
      method: 'POST',
      body: JSON.stringify(couponData),
    });
  },
  update: async (id, couponData) => {
    return fetchAPI(`/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(couponData),
    });
  },
  delete: async (id) => {
    return fetchAPI(`/coupons/${id}`, {
      method: 'DELETE',
    });
  },
  toggle: async (id) => {
    return fetchAPI(`/coupons/${id}/toggle`, {
      method: 'PATCH',
    });
  },
  getAnalytics: async () => {
    return fetchAPI('/coupons/analytics/overview');
  }
};

// ==================== EVENTS API ====================

export const eventsAPI = {
  getAll: async () => {
    return fetchAPI('/events');
  },
  getPublic: async () => {
    return fetchAPI('/events/public');
  },
  getById: async (id) => {
    return fetchAPI(`/events/${id}`);
  },
  create: async (eventData, bannerFile = null) => {
    if (bannerFile) {
      const formData = new FormData();
      Object.keys(eventData).forEach(key => {
        if (Array.isArray(eventData[key])) {
          formData.append(key, JSON.stringify(eventData[key]));
        } else {
          formData.append(key, eventData[key]);
        }
      });
      formData.append('banner', bannerFile);

      const user = JSON.parse(localStorage.getItem('sneaker_user') || 'null');
      const response = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: {
          'Authorization': user?.token ? `Bearer ${user.token}` : ''
        },
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'API Error');
      return data;
    }
    return fetchAPI('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },
  update: async (id, eventData, bannerFile = null) => {
    if (bannerFile) {
      const formData = new FormData();
      Object.keys(eventData).forEach(key => {
        if (Array.isArray(eventData[key])) {
          formData.append(key, JSON.stringify(eventData[key]));
        } else {
          formData.append(key, eventData[key]);
        }
      });
      formData.append('banner', bannerFile);

      const user = JSON.parse(localStorage.getItem('sneaker_user') || 'null');
      const response = await fetch(`${API_BASE}/events/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': user?.token ? `Bearer ${user.token}` : ''
        },
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'API Error');
      return data;
    }
    return fetchAPI(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  },
  toggle: async (id) => {
    return fetchAPI(`/events/${id}/toggle`, {
      method: 'PATCH',
    });
  },
  delete: async (id) => {
    return fetchAPI(`/events/${id}`, {
      method: 'DELETE',
    });
  },
};

export default {
  auth: authAPI,
  products: productsAPI,
  orders: ordersAPI,
  users: usersAPI,
  profile: profileAPI,
  wishlist: wishlistAPI,
  reviews: reviewsAPI,
  loyalty: loyaltyAPI,
  coupons: couponAPI,
  events: eventsAPI
};
