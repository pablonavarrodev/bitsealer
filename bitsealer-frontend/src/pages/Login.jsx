import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/public/AuthLayout'
import TextField from '../components/forms/TextField'
import { Eye, EyeOff, LogIn } from 'lucide-react'

export default function Login() {
    const { user, login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (user) window.location.replace('/dashboard')
    }, [user])

    const onSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
        setLoading(true)
        await login({ email, password })
        } catch (err) {
        setError(err.message || 'Error al iniciar sesión')
        } finally {
        setLoading(false)
        }
    }

    return (
        <AuthLayout
        title="Inicia sesión"
        subtitle="Accede a tu panel para sellar y verificar archivos."
        imageSrc="/assets/auth/hero-login.jpg"
        >
        <form onSubmit={onSubmit} className="space-y-4">
            <TextField label="Email" name="email" type="email" placeholder="tu@email.com" autoComplete="email"
            required value={email} onChange={(e)=>setEmail(e.target.value)} />

            <label className="block">
            <span className="text-sm font-medium">Contraseña</span>
            <div className="mt-1 relative">
                <input
                name="password"
                type={show ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className="w-full h-11 pl-3 pr-10 rounded-lg bg-slate-100/80 dark:bg-white/10 border border-white/20 dark:border-white/10 outline-none text-sm focus:border-[#f7931a] focus:ring-2 focus:ring-[#f7931a]/30"
                />
                <button type="button" onClick={()=>setShow(s=>!s)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-black/5 dark:hover:bg-white/10" aria-label="Mostrar/ocultar">
                {show ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4" />}
                </button>
            </div>
            </label>

            {error && <div className="text-sm text-rose-600">{error}</div>}

            <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2">
                <input type="checkbox" className="accent-[#f7931a]" />
                <span>Recordarme</span>
            </label>
            <a href="#" className="text-[#f7931a] hover:underline">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" disabled={loading} className="w-full h-11 btn btn-primary bg-[#f7931a] hover:bg-[#e67e00] flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4" />
            {loading ? 'Entrando…' : 'Entrar'}
            </button>

            <p className="text-sm text-slate-600 dark:text-slate-300">
            ¿No tienes cuenta? <a href="/register" className="text-[#f7931a] hover:underline">Crear cuenta</a>
            </p>
        </form>
        </AuthLayout>
    )
}
