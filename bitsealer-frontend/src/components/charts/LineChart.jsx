import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    TimeScale
);

export default function LineChart({ data, labels }) {
    if (!data || data.length === 0) {
        return <div className="h-64 sm:h-72 md:h-80" />;
    }

    const pointBackgroundColors = data.map((_, index) =>
        index === data.length - 1
            ? 'rgb(239, 68, 68)'
            : 'rgb(251, 146, 60)'
    );

    const pointRadius = data.map((_, index) =>
        index === data.length - 1
            ? 6
            : 3
    );

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Sellados',
                data,
                fill: 'start',
                backgroundColor: 'rgba(251, 146, 60, 0.3)',
                borderColor: 'rgb(251, 146, 60)',
                tension: 0.4,
                borderWidth: 3,
                pointBackgroundColor: pointBackgroundColors,
                pointRadius: pointRadius,
                pointHoverRadius: 8,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    title: function (context) {
                        const index = context[0].dataIndex;
                        const label = context[0].label;
                        if (index === data.length - 1) {
                            return 'HOY: ' + label;
                        }
                        return label;
                    },
                    label: function (context) {
                        return context.dataset.label + ': ' + context.formattedValue;
                    }
                }
            },
        },
        scales: {
            x: {
                type: 'category',
                grid: {
                    display: false,
                },
                ticks: {
                    maxRotation: 0,
                    minRotation: 0,
                    callback: function (val, index) {
                        if (index === 0 || index === data.length - 1) {
                            return labels[index].substring(5);
                        }
                        return null;
                    },
                    font: {
                        size: 10,
                    },
                }
            },
            y: {
                min: 0,
                ticks: {
                    stepSize: 1,
                    callback: function (value) {
                        return value === 0 ? '' : value;
                    },
                },
                border: {
                    dash: [5, 5],
                },
            },
        },
    };

    return (
        <div className="h-64 sm:h-72 md:h-80 lg:h-96">
            <Line data={chartData} options={options} />
        </div>
    );
}