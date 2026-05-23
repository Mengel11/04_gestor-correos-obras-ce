import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Obras from './pages/Obras'
import Autores from './pages/Autores'
import Layout from './components/Layout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Obras />} />
          <Route path="/autores" element={<Autores />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
