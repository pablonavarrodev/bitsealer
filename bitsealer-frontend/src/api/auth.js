import apiClient from './http';

export const login = (credentials) => {
  return apiClient.post('/auth/login', credentials).then(res => res.data);
};

export const register = (newUser) => {
  return apiClient.post('/auth/register', newUser).then(res => res.data);
};

export const getMe = () => {
  return apiClient.get('/users/me').then(res => res.data);
};

export const updatePassword = (payload) => {
  return apiClient.put('/users/me/password', payload).then(res => res.data);
};