import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Obras from './pages/Obras'
import Autores from './pages/Autores'
import Revisores from './pages/Revisores'
import DetallesObra from './pages/DetallesObra'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Obras />} />
          <Route path="/autores" element={<Autores />} />
          <Route path="/revisores" element={<Revisores />} />
          <Route path="/obras/:id" element={<DetallesObra />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
