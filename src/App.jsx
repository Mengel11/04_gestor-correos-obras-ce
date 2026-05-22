import { useState } from 'react'

function App() {
  const [nuevaObra, setNuevaObra] = useState(false)
  const [obra, setObra] = useState({titulo: '', clasificacion: ''})
  const [obras, setObras] = useState([])
  const [mensaje, setMensaje] = useState('')

  const handleChangeObra = (e) => {
    setObra({...obra, [e.target.name]: e.target.value})
  }

  const handleCancelarObra = () => {
    setNuevaObra(false)
    setObra({titulo: '', clasificacion: ''})
  }

  const handleSubmitObra = (e) => {
    e.preventDefault()

    // Validar que los campos no estén vacíos
    if(!obra.titulo.trim() || !obra.clasificacion) {
      setMensaje('Por favor, completa todos los campos')
      setTimeout(() => {
        setMensaje('')
      }, 2000)
      return
    }

    // Si la validación es exitosa entonces guardar la obra, escondes el formulario y muestras un mensaje de éxito
    setObras([...obras, obra])
    setObra({titulo: '', clasificacion: ''})
    setNuevaObra(false)
    setMensaje('Obra guardada exitosamente')
    setTimeout(() => {
      setMensaje('')
    }, 2000)
  }

  return (
    <>
      <button onClick={() => setNuevaObra(true)}>Nueva Obra</button>
      {nuevaObra && (
        <form onSubmit={handleSubmitObra}>
          <label>
            Titulo:
            <input type="text" name="titulo" value={obra.titulo} onChange={handleChangeObra}/>
          </label>
          <label>
            Clasificación:
            <select name="clasificacion" value={obra.clasificacion} onChange={handleChangeObra}>
              <option value="" disabled hidden>Selecciona una opción</option>
              <option value="libro de texto">Libro de texto</option>
              <option value="libro cientifico">Libro científico</option>
              <option value="notas de curso normal">Notas de curso normal</option>
              <option value="notas de curso especial">Notas de curso especial</option>
              <option value="paquete de computo de docencia">Paquete de computo de docencia</option>
              <option value="paquete de computo cientifico">Paquete de cómputo científico</option>
              <option value="libro de divulgacion">Libro de divulgación</option>
            </select>
            <button type="submit">Guardar</button>
            <button type="button" onClick={handleCancelarObra}>Cancelar</button>
          </label>
        </form>
      )}
      <ul>
        {obras.map((obra, index) => (
          <li key={index}>{obra.titulo}-{obra.clasificacion}</li>
        ))}
      </ul>
      {mensaje && (
        <p>{mensaje}</p>
      )}
    </>
  )
}

export default App
