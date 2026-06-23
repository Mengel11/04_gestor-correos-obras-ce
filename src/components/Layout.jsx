import { Link, NavLink, Outlet } from 'react-router-dom'
import styles from './Layout.module.css'

function Layout() {
    return (
        <>
            <header className={styles.header}>
                <Link to="/" className={styles.logo}>
                    Gestor de obras
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
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default Layout
