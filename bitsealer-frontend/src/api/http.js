import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' }
    });

    // Interceptor para incluir token JWT en cada petición
    apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('bitsealer_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
    });

    // Interceptor de respuesta para manejar 401 globalmente
    apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
        // Token inválido o expirado: cerrar sesión y redirigir a /login
        localStorage.removeItem('bitsealer_token');
        localStorage.removeItem('bitsealer_user');
        localStorage.removeItem('bitsealer_auth');
        window.location.href = '/login';
        }
        return Promise.reject(error);
    }
    );

export default apiClient;
