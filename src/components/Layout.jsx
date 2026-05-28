import { Link, Outlet } from 'react-router-dom'

function Layout() {
    return (
        <>
            <nav>
                <Link to="/">Obras</Link>
                <Link to="/autores">Autores</Link>
                <Link to="/revisores">Revisores</Link>
            </nav>
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default Layout