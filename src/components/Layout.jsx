import { Link, NavLink, Outlet } from 'react-router-dom'
import { IconoGitHub, IconoLinkedIn, IconoLogo } from './Iconos'
import styles from './Layout.module.css'

const URL_REPO = 'https://github.com/Mengel11/04_gestor-correos-obras-ce'
const URL_LINKEDIN_MIGUEL = 'https://www.linkedin.com/in/miguel-%C3%A1ngel-hern%C3%A1ndez-ortiz-760508348/'
const URL_LINKEDIN_MAURICIO = 'https://www.linkedin.com/in/'

function Layout() {
    const año = new Date().getFullYear()

    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <Link to="/" className={styles.logo} aria-label="Gestor de obras — Inicio">
                    <IconoLogo />
                </Link>
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
                    <NavLink
                        to="/miembros-ce"
                        className={({ isActive }) =>
                            isActive ? `${styles.enlace} ${styles.enlaceActivo}` : styles.enlace
                        }
                    >
                        Miembros CE
                    </NavLink>
                </nav>
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
                    <a
                        className={styles.footerIcono}
                        href={URL_LINKEDIN_MAURICIO}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn de Mauricio"
                        title="Mauricio — LinkedIn"
                    >
                        <IconoLinkedIn />
                    </a>
                </div>
            </footer>
        </div>
    )
}

export default Layout
