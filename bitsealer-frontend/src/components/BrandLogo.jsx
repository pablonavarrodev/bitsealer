export default function BrandLogo({ className = '' }) {
return (
    <div
    className={`select-none leading-none ${className}`}
    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.35)' }}
    aria-label="BitSealer"
    >
    <span className="font-extrabold tracking-tight">
        <span className="text-orange-500">Bit</span>
        <span className="text-gray-900 dark:text-white">Sealer</span>
    </span>
    </div>
);
}
