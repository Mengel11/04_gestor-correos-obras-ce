import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../firebaseConfig'

const STORAGE_KEY = 'gestorCorreosAuth'

export const ROLES = {
    ADMIN: 'admin',
    MIEMBRO: 'miembro',
}

const USUARIOS_SIMULADOS = [
    {
        id: 'admin-local',
        username: 'admin',
        password: 'admin123',
        nombre: 'Administrador',
        rol: ROLES.ADMIN,
    },
    {
        id: 'miembro-local',
        username: 'miembro',
        password: 'miembro123',
        nombre: 'Miembro CE',
        rol: ROLES.MIEMBRO,
    },
]

const correoFirebase = (username) => `${username.trim()}@gestor-ce.local`

const crearSesion = (cuenta) => ({
    usuario: {
        id: cuenta.id,
        username: cuenta.username,
        nombre: cuenta.nombre,
        rol: cuenta.rol,
    },
    token: `local-${cuenta.rol}`,
})

export const login = async ({ username, password }) => {
    const usuario = USUARIOS_SIMULADOS.find(
        cuenta => cuenta.username === username.trim() && cuenta.password === password
    )

    if (!usuario) {
        throw new Error('Credenciales inválidas')
    }

    try {
        await signInWithEmailAndPassword(auth, correoFirebase(username), password)
    } catch (error) {
        console.error('Error al autenticar con Firebase:', error)
        throw new Error('No se pudo conectar con Firebase. Verifica que existan los usuarios en Firebase Auth.')
    }

    const sesion = crearSesion(usuario)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sesion))
    return sesion
}

export const logout = async () => {
    localStorage.removeItem(STORAGE_KEY)
    await signOut(auth)
}

export const clearStoredSession = () => {
    localStorage.removeItem(STORAGE_KEY)
}

export const getCurrentSession = () => {
    const sesionGuardada = localStorage.getItem(STORAGE_KEY)
    if (!sesionGuardada) return null

    try {
        return JSON.parse(sesionGuardada)
    } catch {
        localStorage.removeItem(STORAGE_KEY)
        return null
    }
}
