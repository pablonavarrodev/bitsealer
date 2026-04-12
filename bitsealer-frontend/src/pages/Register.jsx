import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/public/AuthLayout'
import TextField from '../components/forms/TextField'
import { UserPlus } from 'lucide-react'

export default function Register() {
    const { user, register } = useAuth()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (user) window.location.replace('/dashboard')
    }, [user])

    const onSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
        if (password !== confirm) { setError('Las contraseñas no coinciden'); return }
        try {
        setLoading(true)
        await register({ name, email, password })
        } catch (err) {
        setError(err.message || 'Error al registrar')
        } finally {
        setLoading(false)
        }
    }

    return (
        <AuthLayout
        title="Crea tu cuenta"
        subtitle="Empieza a sellar tus archivos en minutos."
        imageSrc="/assets/auth/hero-register.jpg"
        >
        <form onSubmit={onSubmit} className="space-y-4">
            <TextField label="Nombre" name="name" placeholder="Tu nombre" required value={name} onChange={(e)=>setName(e.target.value)} />
            <TextField label="Email" name="email" type="email" placeholder="tu@email.com" autoComplete="email"
            required value={email} onChange={(e)=>setEmail(e.target.value)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField label="Contraseña" name="password" type="password" placeholder="••••••••" autoComplete="new-password"
                required value={password} onChange={(e)=>setPassword(e.target.value)} />
            <TextField label="Repetir contraseña" name="confirm" type="password" placeholder="••••••••" autoComplete="new-password"
                required value={confirm} onChange={(e)=>setConfirm(e.target.value)} />
            </div>

            {error && <div className="text-sm text-rose-600">{error}</div>}

            <button type="submit" disabled={loading} className="w-full h-11 btn btn-primary bg-[#f7931a] hover:bg-[#e67e00] flex items-center justify-center gap-2">
            <UserPlus className="w-4 h-4" />
            {loading ? 'Creando…' : 'Crear cuenta'}
            </button>

            <p className="text-sm text-slate-600 dark:text-slate-300">
            ¿Ya tienes cuenta? <a href="/login" className="text-[#f7931a] hover:underline">Inicia sesión</a>
            </p>
        </form>
        </AuthLayout>
    )
}
