// src/components/charts/LineChart.jsx
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
    
    // 1. Manejo de datos iniciales nulos/vacíos
    if (!data || data.length === 0) {
        // Devolvemos un componente vacío seguro si no hay datos.
        // El renderizado condicional en Dashboard ya maneja la carga, 
        // pero esto es una capa extra de seguridad.
        return <div style={{ height: '400px' }} />;
    }

    // 2. Definiciones de Estilo (Fuera del objeto data)
    // El punto de HOY es el último elemento del array de datos.
    const pointBackgroundColors = data.map((_, index) => 
        index === data.length - 1 
        ? 'rgb(239, 68, 68)' // Rojo para HOY
        : 'rgb(251, 146, 60)' // Naranja para otros días
    );
    const pointRadius = data.map((_, index) => 
        index === data.length - 1 
        ? 6 // Punto más grande para HOY
        : 3 // Punto normal
    );

    // 3. Objeto de Datos FINAL que Chart.js espera.
    const chartData = {
        labels,
        datasets: [
            {
                label: 'Sellados',
                data,
                fill: 'start', 
                // Color del área (sin usar la función de canvas aquí, simplificando con un RGBA)
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

    // 4. Opciones de la gráfica (sin cambios en la lógica)
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    title: function(context) {
                        const index = context[0].dataIndex;
                        const label = context[0].label;
                        // Mostrar "HOY:" solo si es el último punto
                        if (index === data.length - 1) {
                            return 'HOY: ' + label;
                        }
                        return label;
                    },
                    label: function(context) {
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
                    callback: function(val, index) {
                        // Muestra solo el primer y el último punto para etiquetas limpias
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
                    callback: function(value) {
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
        <div style={{ height: '400px' }}>
            <Line data={chartData} options={options} />
        </div>
    );
}