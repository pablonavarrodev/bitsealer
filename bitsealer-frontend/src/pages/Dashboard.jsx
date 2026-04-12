// src/pages/Dashboard.jsx
import { useMemo, useState, useEffect, useCallback } from 'react';
import { getHistory, getBitcoinFee } from '../api/files';
import { format } from 'date-fns';

import StatCard from '../components/cards/StatCard.jsx';
import LineChart from '../components/charts/LineChart.jsx';
import RecentTable from '../components/RecentTable.jsx';
import ActivityTimeline from '../components/ActivityTimeline.jsx';

export default function Dashboard() {
    const [period, setPeriod] = useState('30d');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0); 
    const [btcFee, setBtcFee] = useState('...'); 

    // Función de obtención de datos centralizada
    const fetchHistory = useCallback(() => {
        setLoading(true);
        // 1. Obtener el historial
        getHistory()
            .then(data => {
                setHistory(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching history:", err);
                setLoading(false);
            });
            
        // 2. Obtener la tarifa de BTC
        getBitcoinFee()
            .then(fee => {
                setBtcFee(fee);
            })
            .catch(err => console.error("Could not fetch fee:", err));

    }, []);

    // Ejecuta la obtención de datos al montar y al hacer refresh
    useEffect(() => {
        fetchHistory();
        
        // Recarga automática de la tarifa cada 60 segundos
        const intervalId = setInterval(fetchHistory, 60000); 
        return () => clearInterval(intervalId); // Limpiar al desmontar
    }, [refreshKey, fetchHistory]); 

    // Función para que otros componentes puedan forzar la actualización
    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    // Lógica para determinar el delta y el color
    const getFeeDelta = (fee) => {
        if (typeof fee !== 'number') return 0; // Si aún es '...' o error, neutro

        // Umbrales de coste (ajustables según necesidad)
        if (fee < 15) {
            return 1; // Verde (Positivo - Barato)
        } else if (fee <= 30) {
            return 0; // Naranja (Neutro - Medio)
        } else {
            return -1; // Rojo (Negativo - Caro)
        }
    };

    const feeDelta = getFeeDelta(btcFee);

    // 1. Calcular KPIs Reales y Datos de Tendencia
    const { totalFiles, pendingFiles, trendData, trendLabels, latestFiles  } = useMemo(() => {
        const now = new Date();

        let daysCount = 30;
        if (period === '7d') daysCount = 7;
        if (period === '90d') daysCount = 90;

        const daysMap = {};

        for (let i = daysCount - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(now.getDate() - i);
            const key = format(d, 'yyyy-MM-dd');
            daysMap[key] = 0;
        }

        history.forEach(file => {
            const dbDate = new Date(file.createdAt);
            const dateStr = format(dbDate, 'yyyy-MM-dd');

            if (daysMap[dateStr] !== undefined) {
                daysMap[dateStr]++;
            }
        });

        const pendingFiles = history.filter(file =>
            file.stampStatus === 'PENDING' || file.stampStatus === 'ANCHORING'
        ).length;

        const latestFiles = [...history]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        const sortedKeys = Object.keys(daysMap).sort();

        return {
            totalFiles: history.length,
            pendingFiles,
            trendData: sortedKeys.map(k => daysMap[k]),
            trendLabels: sortedKeys,
            latestFiles
        };
    }, [history, period]);

    // KPI 3: Media diaria de sellados en el período
    const averageFiles = trendData.length > 0 && history.length > 0
        ? (history.length / trendData.length).toFixed(1)
        : 0;
    
    // 3. Procesar datos para la tabla (RecentTable)
    const recentFiles = useMemo(() => {
        return [...history]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(file => ({
                id: file.id,
                stampId: file.stampId,
                nombre: file.originalFilename || "Sin nombre",
                fecha: file.createdAt ? format(new Date(file.createdAt), "yyyy-MM-dd HH:mm") : "N/A",
                hash: file.sha256,
                estado: file.stampStatus || "PENDING",
                sealedAt: file.sealedAt || null
                }));
        }, [history]);


    // 4. Los tres KPIs
    const mainKpis = [
        { title: "Total Archivos", value: totalFiles.toLocaleString(), icon: "" },
        // KPI de COMISIÓN ACTUALIZADO con el delta de color
        { 
            title: "Archivos pendientes",
            value: pendingFiles.toLocaleString(),
            icon: ""
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 p-4 md:p-6"> 
            <main className="space-y-6">
                
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Gráfica (2/3 de la columna) */}
                    <div className="lg:col-span-2 card card-pad bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            {/* Botón de refresco explícito */}
                            <div className="flex items-center gap-3">
                                <div className="text-xl font-bold text-gray-900 dark:text-white">Tendencia de Sellados ({period})</div>
                                <button 
                                    onClick={handleRefresh}
                                    className={`text-sm font-medium transition cursor-pointer 
                                        ${loading 
                                            ? 'text-gray-500 dark:text-neutral-600 cursor-not-allowed' 
                                            : 'text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300'
                                        }`}
                                    title="Refrescar datos del dashboard"
                                    disabled={loading}
                                >
                                    {/* 🚨 TEXTO SIMPLE SIN CAJA */}
                                    {loading ? 'Cargando...' : 'Refrescar'}
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                {['7d', '30d', '90d'].map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setPeriod(p)}
                                        className={`px-3 py-1.5 rounded-lg text-sm transition ${period === p
                                                ? 'bg-orange-500 text-white shadow-md'
                                                : 'bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-neutral-200 hover:bg-gray-200 dark:hover:bg-neutral-700'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {loading || trendData.length === 0 ? (
                            <div className="h-72 flex items-center justify-center text-gray-500 dark:text-neutral-400">
                                {loading ? "Cargando datos..." : "No hay datos para el periodo seleccionado."}
                            </div>
                        ) : (
                            <div className="mt-4">
                                <LineChart 
                                    data={trendData} 
                                    labels={trendLabels} 
                                />
                            </div>
                        )}
                    </div>

                    {/* KPIs Laterales (1/3 de la columna) */}
                    <div className="space-y-4">
                        {mainKpis.map((kpi, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-lg"
                            >
                                <StatCard {...kpi} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Fila media: tabla */}
                <section className="grid grid-cols-1 gap-6">
                    <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-sm">
                        <RecentTable rows={recentFiles} />
                    </div>
                </section>
            </main>
        </div>
    );
}