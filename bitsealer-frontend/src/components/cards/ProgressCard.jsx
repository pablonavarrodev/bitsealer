export default function ProgressCard({ title, value, percent }) {
    const p = Math.max(0, Math.min(percent ?? 0, 100))
    return (
        <div className="card card-pad">
        <div className="card-title">{title}</div>
        <div className="flex items-end justify-between mt-1">
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm text-gray-500 dark:text-neutral-400">{p}%</div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-gray-200 dark:bg-neutral-700 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400" style={{ width: `${p}%` }} />
        </div>
        </div>
    )
}
