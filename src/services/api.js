import axios from 'axios';

// ============================================
// BASE API URL
// ============================================
const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') 
  || 'https://game-hub-backend-production-f730.up.railway.app';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// REQUEST INTERCEPTOR (إضافة التوكن تلقائيًا)
// ============================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================
// RESPONSE INTERCEPTOR (تعامل مع الأخطاء)
// ============================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH APIs
// ============================================
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
  verifyEmail: (email, code) => api.post('/auth/verify-email', { email, code }),
  resendCode: (email) => api.post('/auth/resend-code', { email }),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  updatePassword: (passwords) => api.put('/auth/updatepassword', passwords),
  updateDetails: (userData) => api.put('/auth/updatedetails', userData),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwords) => api.put('/auth/change-password', passwords),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
};

// ============================================
// PRODUCTS APIs
// ============================================
export const productsAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
  search: (query) => api.get('/products', { params: { search: query } }),
  addReview: (productId, review) => api.post(`/products/${productId}/reviews`, review),
};

// ============================================
// CART APIs
// ============================================
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (productId, quantity = 1) => api.post('/cart/add', { productId, quantity }),
  update: (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity }),
  remove: (itemId) => api.delete(`/cart/${itemId}`),
  clear: () => api.delete('/cart/clear/all'),
  getCount: () => api.get('/cart/count'),
};

// ============================================
// WISHLIST APIs
// ============================================
export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  add: (productId) => api.post(`/wishlist/${productId}`),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
  clear: () => api.delete('/wishlist'),
  toggle: (productId) => api.post(`/wishlist/${productId}`),
};

// ============================================
// ORDERS APIs
// ============================================
export const ordersAPI = {
  getAll: (params = {}) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (orderData) => api.post('/orders', orderData),
  cancel: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),
  getStatus: (id) => api.get(`/orders/${id}/status`),
  updateStatus: (id, status, note) => api.put(`/orders/${id}/status`, { status, note }),
};

// ============================================
// ADMIN APIs
// ============================================
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getDashboard: () => api.get('/admin/dashboard'),

  // Users
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (userId, role) => api.put(`/admin/users/${userId}/role`, { role }),
  toggleUserStatus: (userId, isActive) => api.put(`/admin/users/${userId}/status`, { isActive }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),

  // Orders
  getOrders: () => api.get('/admin/orders'),
  getOrderById: (id) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (orderId, status, note = '') => api.put(`/admin/orders/${orderId}/status`, { status, note }),
  deleteOrder: (orderId) => api.delete(`/admin/orders/${orderId}`),

  // Products
  getProducts: () => api.get('/admin/products'),
  updateStock: (productId, stock) => api.put(`/admin/products/${productId}/stock`, { stock }),
};

// ============================================
// CATEGORIES APIs
// ============================================
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
};

// ============================================
// UPLOAD APIs
// ============================================
export const uploadAPI = {
  uploadImage: (formData) => api.post('/upload/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadImages: (formData) => api.post('/upload/images', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteImage: (imageId) => api.delete(`/upload/image/${imageId}`),
};

// ============================================
// CONTACT APIs
// ============================================
export const contactAPI = {
  send: (messageData) => api.post('/contact', messageData),
};

// ============================================
// NEWSLETTER APIs
// ============================================
export const newsletterAPI = {
  subscribe: (email) => api.post('/newsletter/subscribe', { email }),
  unsubscribe: (email) => api.post('/newsletter/unsubscribe', { email }),
};

// ============================================
// PAYMENT APIs
// ============================================
export const paymentAPI = {
  createIntent: (orderId) => api.post('/payment/create-intent', { orderId }),
  confirmPayment: (paymentIntentId) => api.post('/payment/confirm', { paymentIntentId }),
  getStatus: (orderId) => api.get(`/payment/status/${orderId}`),
};

// ============================================
// NOTIFICATIONS APIs
// ============================================
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (notificationId) => api.delete(`/notifications/${notificationId}`),
  clearAll: () => api.delete('/notifications/clear'),
};

export default api;
