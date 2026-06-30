import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/Auth'
import styles from './Login.module.css'

const CREDENCIALES_INICIALES = { username: '', password: '' }

function Login() {
    const [credenciales, setCredenciales] = useState(CREDENCIALES_INICIALES)
    const [error, setError] = useState('')
    const { autenticado, iniciarSesion } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const destino = location.state?.from?.pathname ?? '/'

    if (autenticado) {
        return <Navigate to="/" replace />
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        if (error) setError('')
        setCredenciales(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await iniciarSesion(credenciales)
            navigate(destino, { replace: true })
        } catch (error) {
            setError(error.message || 'Usuario o contraseña incorrectos')
        }
    }

    return (
        <main className={styles.pagina}>
            <section className={styles.tarjeta} aria-labelledby="login-titulo">
                <div className={styles.encabezado}>
                    <p className={styles.etiqueta}>Acceso temporal</p>
                    <h1 id="login-titulo" className={styles.titulo}>Iniciar sesión</h1>
                    <p className={styles.descripcion}>
                        Usa las credenciales simuladas mientras se integra el backend.
                    </p>
                </div>

                <form className={styles.formulario} onSubmit={handleSubmit}>
                    <label className={styles.campo}>
                        <span>Usuario</span>
                        <input
                            type="text"
                            name="username"
                            value={credenciales.username}
                            onChange={handleChange}
                            autoComplete="username"
                            required
                        />
                    </label>

                    <label className={styles.campo}>
                        <span>Contraseña</span>
                        <input
                            type="password"
                            name="password"
                            value={credenciales.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            required
                        />
                    </label>

                    {error && <p className={styles.error} role="alert">{error}</p>}

                    <button type="submit" className={styles.boton}>
                        Entrar
                    </button>
                </form>

                <div className={styles.ayuda}>
                    <p><strong>Admin:</strong> admin / admin123</p>
                    <p><strong>Miembro:</strong> miembro / miembro123</p>
                </div>
            </section>
        </main>
    )
}

export default Login
