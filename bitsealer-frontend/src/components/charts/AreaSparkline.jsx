export default function AreaSparkline({ points = [10,20,15,30,28,40,36], height = 48 }) {
    const max = Math.max(...points)
    const w = 120, h = height
    const step = w / (points.length - 1)
    const scaled = points.map((v, i) => [i*step, h - (v/max)*h])

    const path = scaled.map((p,i) => `${i===0?'M':'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
    const area = `${path} L ${w},${h} L 0,${h} Z`

    return (
        <svg width={w} height={h} className="overflow-visible">
        <defs>
            <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopOpacity="0.35" stopColor="rgb(139 92 246)" />
            <stop offset="100%" stopOpacity="0" stopColor="rgb(59 130 246)" />
            </linearGradient>
        </defs>
        <path d={area} fill="url(#grad)"/>
        <path d={path} fill="none" stroke="currentColor" className="text-purple-500" strokeWidth="2"/>
        </svg>
    )
}
