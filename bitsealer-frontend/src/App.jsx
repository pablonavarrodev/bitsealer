import { AuthProvider } from './context/AuthContext'
import { AppDataProvider } from './context/AppDataContext'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <AppRoutes />
      </AppDataProvider>
    </AuthProvider>
  )
}
