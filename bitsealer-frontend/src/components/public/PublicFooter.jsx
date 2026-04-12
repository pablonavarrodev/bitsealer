
export default function PublicFooter() {
    return (
        <footer className="mt-16 border-t border-white/20 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>© {new Date().getFullYear()} BitSealer. Todos los derechos reservados.</div>
            <div className="flex items-center gap-4">
            <a href="#" className="hover:text-[#f7931a]">Privacidad</a>
            <a href="#" className="hover:text-[#f7931a]">Términos</a>
            <a href="#" className="hover:text-[#f7931a]">Contacto</a>
            </div>
        </div>
        </footer>
    )
}
