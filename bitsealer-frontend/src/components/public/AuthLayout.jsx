export default function AuthLayout({ title, subtitle, imageSrc, children }) {
    return (
        <div className="min-h-screen grid md:grid-cols-2">
        <div className="hidden md:block relative">
            <img src={imageSrc} alt="Auth" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent" />
            <div className="absolute top-6 left-6 text-2xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-[#f7931a] to-[#ffcc00] bg-clip-text text-transparent">Bit</span>
            <span className="text-white">Sealer</span>
            </div>
        </div>

        <div className="flex items-center justify-center p-6 bg-white dark:bg-slate-950">
            <div className="w-full max-w-md">
            <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>}
            <div className="mt-6 card p-6 hover:shadow-lg hover:shadow-orange-200/40 transition">
                {children}
            </div>
            <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
                Al continuar aceptas nuestros <a href="#" className="underline hover:text-[#f7931a]">Términos</a> y <a href="#" className="underline hover:text-[#f7931a]">Privacidad</a>.
            </p>
            </div>
        </div>
        </div>
    )
}
