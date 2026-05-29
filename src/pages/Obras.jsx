import { useState } from 'react'
import FormularioObra from '../components/FormularioObra'

function Obras() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [obraFormulario, setObraFormulario] = useState({ titulo: '', clasificacion: '', autores: [] })
  const [obras, setObras] = useState([])
  const [mensaje, setMensaje] = useState('')

  const handleChangeObra = (e) => {
    const { name, value } = e.target
    setObraFormulario({...obraFormulario, [name]: value})
  }

  const handleCancelarFormulario = () => {
    setMostrarFormulario(false)
    setMostrarAutoresDisponibles(false)
    setObraFormulario({titulo: '', clasificacion: '', autores: []})
  }

  const handleSubmitFormulario = (e) => {
    e.preventDefault()

    // Validar que los campos no estén vacíos
    if(!obraFormulario.titulo.trim() || !obraFormulario.clasificacion || obraFormulario.autores.length === 0) {
      setMensaje('Por favor, completa todos los campos')
      setTimeout(() => { setMensaje('') }, 2000)
      return
    }

    // Si la validación es exitosa entonces guardas la obra, reseteas el formulario y muestras un mensaje de éxito.
    setObras([...obras, obraFormulario])
    setObraFormulario({titulo: '', clasificacion: '', autores: []})
    setMostrarFormulario(false)
    setMostrarAutoresDisponibles(false)
    setMensaje('Obra guardada exitosamente')
    setTimeout(() => { setMensaje('') }, 2000)
  }

  return (
    <>
      <button onClick={() => setMostrarFormulario(true)}>Nueva Obra</button>
      {mostrarFormulario && (
        <FormularioObra 
          obra={obraFormulario}
          onChangeObra={handleChangeObra}
          onSubmit={handleSubmitFormulario}
          onCancelar={handleCancelarFormulario}
        />
      )}
      <ul>
        {obras.map((obra, index) => (
          <li key={index}>
            {obra.titulo}-{obra.clasificacion}
            {obra.autores.length}
          </li>
        ))}
      </ul>
      {mensaje && (
        <p>{mensaje}</p>
      )}
    </>
  )
}

export default Obras;
