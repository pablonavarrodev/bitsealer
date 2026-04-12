export default function PublicNavbar() {
  const NAV_HEIGHT = 64 // h-16

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (!el) return

    const y = el.getBoundingClientRect().top + window.pageYOffset - NAV_HEIGHT - 10
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <nav className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-slate-900/60 border-b border-white/20 dark:border-white/10">
      <div className="max-w-6xl mx-auto h-16 px-4 flex items-center gap-4">
        <a href="/" className="inline-flex items-center gap-2">
          <div className="size-8 rounded-lg bg-gradient-to-r from-[#f7931a] to-[#ffcc00] grid place-items-center text-white font-bold">
            B
          </div>
          <div className="text-xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-[#f7931a] to-[#ffcc00] bg-clip-text text-transparent">Bit</span>Sealer
          </div>
        </a>

        <div className="ml-auto hidden sm:flex items-center gap-6 text-sm">
          <button onClick={() => scrollTo('como-funciona')} className="hover:text-[#f7931a]">
            Cómo funciona
          </button>

          <button onClick={() => scrollTo('verificar')} className="hover:text-[#f7931a]">
            Verificar
          </button>

          <button onClick={() => scrollTo('faq')} className="hover:text-[#f7931a]">
            FAQ
          </button>

          {/* ESTE ES EL QUE QUERÍAS */}
          <button onClick={() => scrollTo('precio')} className="hover:text-[#f7931a]">
            Enterprise
          </button>

          <a
            href="/dashboard"
            className="btn btn-primary bg-[#f7931a] hover:bg-[#e67e00] px-4 py-1.5 rounded-md"
          >
            Empezar
          </a>
        </div>
      </div>
    </nav>
  )
}
