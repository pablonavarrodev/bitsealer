// src/components/cards/StatCard.jsx
export default function StatCard({ title, value, icon, delta }) {
    
    const isFeeCard = title.includes("Tarifa Rápida");

    // Función de ayuda para determinar el color basado en el delta (1=Barato, 0=Medio, -1=Caro)
    const getFeeClasses = (delta) => {
        if (delta === 1) {
            // Verde: Barato
            return { 
                statusText: 'BARATO', 
                textColor: 'text-emerald-600 dark:text-emerald-400', 
                bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
            };
        } else if (delta === -1) {
            // Rojo: Caro
            return { 
                statusText: 'CARO', 
                textColor: 'text-rose-600 dark:text-rose-400', 
                bgColor: 'bg-rose-100 dark:bg-rose-900/30',
            };
        } else {
            // Naranja/Neutro: Medio o valor inicial '...'
            return { 
                statusText: 'MEDIO', 
                textColor: 'text-orange-600 dark:text-orange-400', 
                bgColor: 'bg-orange-100 dark:bg-orange-900/30',
            };
        }
    };
    
    // Aplica las clases solo si es la tarjeta de la tarifa
    const { statusText, textColor, bgColor } = isFeeCard 
        ? getFeeClasses(delta) 
        : { textColor: 'text-gray-500', bgColor: 'bg-gray-100' }; // Colores neutros si no es la tarjeta de tarifa

    return (
        <div className="p-5 md:p-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-neutral-400 mb-1">{title}</div>
                    <div className="text-3xl font-extrabold text-gray-900 dark:text-white">{value}</div>
                    
                    {/* Indicador de estado para la Tarifa BTC */}
                    {isFeeCard && (
                        <div className={`mt-2 flex items-center text-sm font-medium ${textColor} ${bgColor} px-2 py-1 rounded-full w-fit`}>
                            {statusText}
                        </div>
                    )}

                    {/* Lógica original de delta (si se usara para otras tarjetas) */}
                    {typeof delta === 'number' && !isFeeCard && (
                        <div className={`mt-1 text-xs font-medium ${delta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}% (últimas 24h)
                        </div>
                    )}
                </div>
                {icon && <div className={`text-4xl ${isFeeCard ? textColor : 'text-gray-400/70'}`}>{icon}</div>}
            </div>
        </div>
    )
}