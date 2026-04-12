import { useMemo, useState, useEffect, useCallback } from 'react';
import { getHistory, getBitcoinFee } from '../api/files';
import { format } from 'date-fns';

import StatCard from '../components/cards/StatCard.jsx';
import LineChart from '../components/charts/LineChart.jsx';
import RecentTable from '../components/RecentTable.jsx';

export default function Dashboard() {
    const [period, setPeriod] = useState('30d');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const [btcFee, setBtcFee] = useState('...');

    const fetchHistory = useCallback(() => {
        setLoading(true);

        getHistory()
            .then(data => {
                setHistory(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching history:", err);
                setLoading(false);
            });

        getBitcoinFee()
            .then(fee => {
                setBtcFee(fee);
            })
            .catch(err => console.error("Could not fetch fee:", err));
    }, []);

    useEffect(() => {
        fetchHistory();

        const intervalId = setInterval(fetchHistory, 60000);
        return () => clearInterval(intervalId);
    }, [refreshKey, fetchHistory]);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    const getFeeDelta = (fee) => {
        if (typeof fee !== 'number') return 0;

        if (fee < 15) {
            return 1;
        } else if (fee <= 30) {
            return 0;
        } else {
            return -1;
        }
    };

    const feeDelta = getFeeDelta(btcFee);

    const { totalFiles, pendingFiles, trendData, trendLabels } = useMemo(() => {
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

        const sortedKeys = Object.keys(daysMap).sort();

        return {
            totalFiles: history.length,
            pendingFiles,
            trendData: sortedKeys.map(k => daysMap[k]),
            trendLabels: sortedKeys,
        };
    }, [history, period]);

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

    const mainKpis = [
        { title: "Total Archivos", value: totalFiles.toLocaleString(), icon: "" },
        {
            title: "Archivos pendientes",
            value: pendingFiles.toLocaleString(),
            icon: ""
        },
        {
            title: "Tarifa Rápida BTC",
            value: typeof btcFee === 'number' ? `${btcFee} sat/vB` : btcFee,
            icon: "",
            delta: feeDelta
        },
    ];

    return (
        <div className="space-y-6">
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card card-pad bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-lg">
                    <div className="flex flex-col gap-4 mb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0">
                                <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                    Tendencia de Sellados ({period})
                                </div>

                                <button
                                    onClick={handleRefresh}
                                    className={`w-fit text-sm font-medium transition cursor-pointer ${loading
                                            ? 'text-gray-500 dark:text-neutral-600 cursor-not-allowed'
                                            : 'text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300'
                                        }`}
                                    title="Refrescar datos del dashboard"
                                    disabled={loading}
                                >
                                    {loading ? 'Cargando...' : 'Refrescar'}
                                </button>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
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
                    </div>

                    {loading || trendData.length === 0 ? (
                        <div className="h-64 sm:h-72 flex items-center justify-center text-center text-gray-500 dark:text-neutral-400">
                            {loading ? "Cargando datos..." : "No hay datos para el periodo seleccionado."}
                        </div>
                    ) : (
                        <div className="mt-2">
                            <LineChart
                                data={trendData}
                                labels={trendLabels}
                            />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
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

            <section className="grid grid-cols-1 gap-6">
                <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-sm">
                    <RecentTable rows={recentFiles} />
                </div>
            </section>
        </div>
    );
}