import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/Auth'
import { IconoFlechaAbajo, IconoGitHub, IconoLinkedIn, IconoLogo, IconoUsuario } from './Iconos'
import styles from './Layout.module.css'

const URL_REPO = 'https://github.com/Mengel11/04_gestor-correos-obras-ce'
const URL_LINKEDIN_MIGUEL = 'https://www.linkedin.com/in/miguel-%C3%A1ngel-hern%C3%A1ndez-ortiz-760508348/'
const URL_LINKEDIN_MAURICIO = 'https://www.linkedin.com/in/'

function Layout() {
    const año = new Date().getFullYear()
    const { usuario, esAdmin, cerrarSesion } = useAuth()
    const navigate = useNavigate()
    const [menuAbierto, setMenuAbierto] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        if (!menuAbierto) return

        const cerrarAlClickExterno = (event) => {
            if (!menuRef.current?.contains(event.target)) {
                setMenuAbierto(false)
            }
        }

        const cerrarConEscape = (event) => {
            if (event.key === 'Escape') setMenuAbierto(false)
        }

        document.addEventListener('mousedown', cerrarAlClickExterno)
        document.addEventListener('keydown', cerrarConEscape)
        return () => {
            document.removeEventListener('mousedown', cerrarAlClickExterno)
            document.removeEventListener('keydown', cerrarConEscape)
        }
    }, [menuAbierto])

    const handleCerrarSesion = async () => {
        setMenuAbierto(false)
        await cerrarSesion()
        navigate('/login', { replace: true })
    }

    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <Link to="/" className={styles.logo} aria-label="Gestor de obras — Inicio">
                    <IconoLogo />
                </Link>
                <div className={styles.headerDerecha}>
                    <nav className={styles.nav}>
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                isActive ? `${styles.enlace} ${styles.enlaceActivo}` : styles.enlace
                            }
                        >
                            Obras
                        </NavLink>
                        <NavLink
                            to="/autores"
                            className={({ isActive }) =>
                                isActive ? `${styles.enlace} ${styles.enlaceActivo}` : styles.enlace
                            }
                        >
                            Autores
                        </NavLink>
                        <NavLink
                            to="/revisores"
                            className={({ isActive }) =>
                                isActive ? `${styles.enlace} ${styles.enlaceActivo}` : styles.enlace
                            }
                        >
                            Revisores
                        </NavLink>
                        {esAdmin && (
                            <NavLink
                                to="/miembros-ce"
                                className={({ isActive }) =>
                                    isActive ? `${styles.enlace} ${styles.enlaceActivo}` : styles.enlace
                                }
                            >
                                Miembros CE
                            </NavLink>
                        )}
                    </nav>
                    <div className={styles.menuUsuario} ref={menuRef}>
                        <button
                            type="button"
                            className={styles.botonMenuUsuario}
                            onClick={() => setMenuAbierto(prev => !prev)}
                            aria-expanded={menuAbierto}
                            aria-haspopup="menu"
                            aria-label="Menú de usuario"
                        >
                            <IconoUsuario />
                            <span className={`${styles.flechaMenu} ${menuAbierto ? styles.flechaMenuAbierta : ''}`}>
                                <IconoFlechaAbajo />
                            </span>
                        </button>
                        {menuAbierto && (
                            <div className={styles.menuDesplegable} role="menu">
                                <div className={styles.menuInfo}>
                                    <span className={styles.menuNombre}>{usuario?.nombre}</span>
                                    <span className={styles.menuRol}>{usuario?.rol}</span>
                                </div>
                                <button
                                    type="button"
                                    role="menuitem"
                                    className={styles.menuSalir}
                                    onClick={handleCerrarSesion}
                                >
                                    Salir
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <main>
                <Outlet />
            </main>
            <footer className={styles.footer}>
                <div className={styles.footerInstitucional}>
                    <p className={styles.footerTitulo}>
                        Gestor de obras del Consejo Editorial — UAM
                    </p>
                    <p className={styles.footerCopyright}>
                        © {año} Consejo Editorial, Universidad Autónoma Metropolitana - Unidad Cuajimalpa
                    </p>
                </div>
                <div className={styles.footerEnlaces} aria-label="Enlaces del proyecto">
                    <a
                        className={styles.footerIcono}
                        href={URL_REPO}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Repositorio del proyecto en GitHub"
                        title="Repositorio en GitHub"
                    >
                        <IconoGitHub />
                    </a>
                    <a
                        className={styles.footerIcono}
                        href={URL_LINKEDIN_MIGUEL}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn de Miguel Angel Hernández Ortiz"
                        title="Miguel Angel Hernández Ortiz — LinkedIn"
                    >
                        <IconoLinkedIn />
                    </a>
                    {/* <a
                        className={styles.footerIcono}
                        href={URL_LINKEDIN_MAURICIO}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn de Mauricio"
                        title="Mauricio — LinkedIn"
                    >
                        <IconoLinkedIn />
                    </a> */}
                </div>
            </footer>
        </div>
    )
}

export default Layout
