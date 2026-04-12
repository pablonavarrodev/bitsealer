export default function ActivityTimeline({ items = [] }) {
    return (
        <div className="card card-pad">
        <div className="text-base font-semibold mb-3">Actividad</div>
        <ol className="relative border-l border-gray-200 dark:border-neutral-700 pl-4">
            {items.map((it,i)=>(
            <li key={i} className="mb-5">
                <span className="absolute -left-1.5 w-3 h-3 rounded-full bg-blue-500" />
                <div className="text-sm font-semibold">{it.title}</div>
                <div className="text-xs text-gray-500 dark:text-neutral-400">{it.time}</div>
                <div className="text-sm mt-1">{it.description}</div>
            </li>
            ))}
        </ol>
        </div>
    )
}
