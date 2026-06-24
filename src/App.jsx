import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Obras from './pages/Obras/Obras'
import Autores from './pages/Autores/Autores'
import Revisores from './pages/Revisores/Revisores'
import MiembrosCE from './pages/MiembrosCE/MiembrosCE'
import DetallesObra from './pages/DetallesObra/DetallesObra'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Obras />} />
          <Route path="autores" element={<Autores />} />
          <Route path="revisores" element={<Revisores />} />
          <Route path="miembros-ce" element={<MiembrosCE />} />
          <Route path="obras/:obraId" element={<DetallesObra />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
