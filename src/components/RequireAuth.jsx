import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/Auth'

function RequireAuth({ soloAdmin = false }) {
    const { autenticado, esAdmin, listo } = useAuth()
    const location = useLocation()

    if (!listo) return null

    if (!autenticado) {
        return <Navigate to="/login" replace state={{ from: location }} />
    }

    if (soloAdmin && !esAdmin) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

export default RequireAuth
