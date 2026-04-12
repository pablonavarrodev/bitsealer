import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Podemos retornar un spinner o nulo mientras se determina auth
    return <div></div>;
  }
  if (!user) {
    // Redirigir a login, guardando la ruta actual para volver después de login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
