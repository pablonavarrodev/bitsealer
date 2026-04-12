export default function BarMini({ values = [4,8,6,10,7,12,9] }) {
    const max = Math.max(...values)
    return (
        <div className="flex items-end gap-1 h-12">
        {values.map((v,i) => {
            const h = (v/max)*100
            return <div key={i} className="w-2 rounded bg-orange-500/70" style={{height: `${h}%`}} />
        })}
        </div>
    )
}
