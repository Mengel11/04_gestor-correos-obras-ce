import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth'
import Obras from './pages/Obras/Obras'
import Autores from './pages/Autores/Autores'
import Revisores from './pages/Revisores/Revisores'
import MiembrosCE from './pages/MiembrosCE/MiembrosCE'
import DetallesObra from './pages/DetallesObra/DetallesObra'
import Login from './pages/Login/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Obras />} />
            <Route path="autores" element={<Autores />} />
            <Route path="revisores" element={<Revisores />} />
            <Route element={<RequireAuth soloAdmin />}>
              <Route path="miembros-ce" element={<MiembrosCE />} />
              <Route path="obras/:obraId" element={<DetallesObra />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
