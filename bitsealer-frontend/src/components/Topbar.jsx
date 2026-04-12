import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const mobileNavItems = [
    { label: 'Inicio', href: '/dashboard' },
    { label: 'Sellar archivo', href: '/upload' },
    { label: 'Historial', href: '/history' },
    { label: 'Ajustes', href: '/settings' },
]

export default function Topbar() {
    const { user, logout } = useAuth()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        function handlePointerOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMobileMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handlePointerOutside)
        document.addEventListener('touchstart', handlePointerOutside)

        return () => {
            document.removeEventListener('mousedown', handlePointerOutside)
            document.removeEventListener('touchstart', handlePointerOutside)
        }
    }, [])

    return (
        <header className="relative h-14 border-b border-white/10 px-4 flex items-center justify-between">
            <div className="relative lg:hidden" ref={menuRef}>
                <button
                    type="button"
                    onClick={() => setMobileMenuOpen((prev) => !prev)}
                    className="inline-flex items-center px-3 py-1.5 rounded-md text-sm bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15"
                >
                    Menú
                </button>

                {mobileMenuOpen && (
                    <div className="absolute left-0 top-12 z-50 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
                        <nav className="flex flex-col gap-1">
                            {mobileNavItems.map((item) => (
                                <NavLink
                                    key={item.href}
                                    to={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        [
                                            'rounded-lg px-3 py-2 text-sm font-medium transition',
                                            isActive
                                                ? 'bg-gray-900 text-white dark:bg-white dark:text-black'
                                                : 'text-gray-700 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-800',
                                        ].join(' ')
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            ))}

                            <button
                                type="button"
                                onClick={() => {
                                    setMobileMenuOpen(false)
                                    logout()
                                }}
                                className="mt-1 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                            >
                                Salir
                            </button>
                        </nav>
                    </div>
                )}
            </div>

            <div className="hidden lg:block" />

            <div className="flex items-center gap-3 ml-auto min-w-0">
                {user && (
                    <span className="hidden md:block truncate text-sm text-slate-500 dark:text-slate-300 max-w-[220px]">
                        {user.email}
                    </span>
                )}

                <button
                    onClick={logout}
                    className="hidden lg:inline-flex px-3 py-1.5 rounded-md text-sm bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15"
                >
                    Salir
                </button>
            </div>
        </header>
    )
}