import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebaseConfig'
import { getCurrentSession, login, logout, clearStoredSession, ROLES } from '../services/authService'

const AuthContext = createContext()

function AuthProvider({ children }) {
    const [sesion, setSesion] = useState(null)
    const [listo, setListo] = useState(false)
    const usuario = sesion?.usuario ?? null
    const esAdmin = usuario?.rol === ROLES.ADMIN

    useEffect(() => {
        return onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setSesion(getCurrentSession())
            } else {
                clearStoredSession()
                setSesion(null)
            }
            setListo(true)
        })
    }, [])

    const iniciarSesion = async (credenciales) => {
        const nuevaSesion = await login(credenciales)
        setSesion(nuevaSesion)
        return nuevaSesion
    }

    const cerrarSesion = async () => {
        await logout()
        setSesion(null)
    }

    const valor = useMemo(() => ({
        usuario,
        autenticado: Boolean(usuario),
        esAdmin,
        puedeEscribir: esAdmin,
        listo,
        iniciarSesion,
        cerrarSesion,
    }), [usuario, esAdmin, listo])

    return (
        <AuthContext.Provider value={valor}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
