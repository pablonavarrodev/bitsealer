import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as apiAuth from '../api/auth';
import { trackEvent } from '../utils/analytics';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Efecto: comprobar token almacenado al montar (auto-login)
  useEffect(() => {
    const token = localStorage.getItem('bitsealer_token');
    if (token) {
      // Intentar obtener perfil para verificar token
      apiAuth.getMe().then(u => {
        setUser(u);
      }).catch(() => {
        // Token inválido: limpiar
        localStorage.removeItem('bitsealer_token');
        localStorage.removeItem('bitsealer_user');
        localStorage.removeItem('bitsealer_auth');
        setUser(null);
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  // Login function: realiza API call y guarda token + user
  const login = async ({ email, password }) => {
    const data = await apiAuth.login({ email, password });

    localStorage.setItem('bitsealer_token', data.accessToken);
    localStorage.setItem('bitsealer_user', JSON.stringify(data.user));
    localStorage.setItem('bitsealer_auth', 'ok');
    setUser(data.user);

    trackEvent('login', {
      user_email_domain: data.user?.email?.split('@')[1] || 'unknown',
    });

    // Redirigir a la ruta intentada o dashboard
    const from = location.state?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
  };

  // Register function: similar a login (autologin tras registro)
  const register = async ({ name, email, password }) => {
    const data = await apiAuth.register({ name, email, password });

    localStorage.setItem('bitsealer_token', data.accessToken);
    localStorage.setItem('bitsealer_user', JSON.stringify(data.user));
    localStorage.setItem('bitsealer_auth', 'ok');
    setUser(data.user);

    trackEvent('register', {
      user_email_domain: data.user?.email?.split('@')[1] || 'unknown',
    });

    navigate('/dashboard', { replace: true });
  };

  // Logout function: borra datos y vuelve a login
  const logout = () => {
    localStorage.removeItem('bitsealer_token');
    localStorage.removeItem('bitsealer_user');
    localStorage.removeItem('bitsealer_auth');
    setUser(null);
    navigate('/login');
  };

  const value = { user, loading, login, register, logout };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

// Hook de conveniencia para usar el contexto
export function useAuth() {
  return useContext(AuthCtx);
}