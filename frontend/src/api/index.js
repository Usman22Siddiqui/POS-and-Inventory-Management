import api from './client';

export const authApi = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  getProfile: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

export const productsApi = {
  getAll: async (params) => {
    const res = await api.get('/products', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
  search: async (params) => {
    const res = await api.get('/products/search', { params });
    return res.data;
  },
  getLowStock: async () => {
    const res = await api.get('/products/low-stock');
    return res.data;
  },
  create: async (formData) => {
    const res = await api.post('/products', formData, {
      headers: formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return res.data;
  },
  update: async (id, formData) => {
    const res = await api.put(`/products/${id}`, formData, {
      headers: formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },
};

export const posApi = {
  lookup: async (sku) => {
    const res = await api.get(`/pos/lookup?sku=${encodeURIComponent(sku)}`);
    return res.data;
  },
  checkout: async (payload) => {
    const res = await api.post('/pos/checkout', payload);
    return res.data;
  },
  getMyTransactions: async (params) => {
    const res = await api.get('/pos/my-transactions', { params });
    return res.data;
  },
};

export const usersApi = {
  getAll: async () => {
    const res = await api.get('/users');
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },
};

export const statsApi = {
  getOverview: async () => {
    const res = await api.get('/stats/overview');
    return res.data;
  },
};
