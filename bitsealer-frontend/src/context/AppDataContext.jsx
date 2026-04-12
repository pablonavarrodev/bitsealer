import { createContext, useContext, useEffect, useState } from 'react';
import { getDashboard } from '../api/files';
import { useAuth } from './AuthContext'; // Asegúrate de que exista este contexto

const AppDataCtx = createContext(null);

export function AppDataProvider({ children }) {
  const { token } = useAuth();  // solo usamos el token para saber si está logueado
  const [kpis, setKpis] = useState([]);
  const [recent, setRecent] = useState([]);
  const [charts, setCharts] = useState({ line: null, bar: null, donut: null });

  useEffect(() => {
    // Solo llama a getDashboard si hay token
    if (token) {
      getDashboard()
        .then(data => {
          setKpis(data.kpis || []);
          setRecent(data.recent || []);
          setCharts(data.charts || { line: null, bar: null, donut: null });
        })
        .catch(err => {
          console.error("Error fetching dashboard data", err);
        });
    }
  }, [token]); // se ejecuta solo cuando el token cambia

  const value = { kpis, recent, charts };
  return <AppDataCtx.Provider value={value}>{children}</AppDataCtx.Provider>;
}

export function useAppData() {
  return useContext(AppDataCtx);
}
