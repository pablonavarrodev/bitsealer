import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as apiAuth from '../api/auth';

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
      }).catch(err => {
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
    // data tiene { accessToken, refreshToken, user }
    localStorage.setItem('bitsealer_token', data.accessToken);
    localStorage.setItem('bitsealer_user', JSON.stringify(data.user));
    localStorage.setItem('bitsealer_auth', 'ok');
    setUser(data.user);
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
