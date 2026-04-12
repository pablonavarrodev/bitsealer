import { useAuth } from '../context/AuthContext'

export default function Topbar() {
    const { user, logout } = useAuth()

    return (
        <header className="h-14 border-b border-white/10 px-4 flex items-center justify-between">

            {/* Espacio vacío izquierda */}
            <div></div>

            {/* Usuario y logout a la derecha */}
            <div className="flex items-center gap-3">
                {user && (
                    <span className="text-sm text-slate-500 dark:text-slate-300">
                        {user.email}
                    </span>
                )}

                <button
                    onClick={logout}
                    className="px-3 py-1.5 rounded-md text-sm bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15"
                >
                    Salir
                </button>
            </div>

        </header>
    )
}