import { useState } from 'react'

function Obras() {
  const [nuevaObra, setNuevaObra] = useState(false)
  const [mostrarAutoresDisponibles, setMostrarAutoresDisponibles] = useState(false)
  const [obra, setObra] = useState({
    titulo: '', 
    clasificacion: '', 
    autores: []
  })
  const [obras, setObras] = useState([])
  const [autoresDisponibles, setAutoresDisponibles] = useState([
    {id: 1, nombre: 'Autor 1', apellido: 'Apellido 1', email: 'autor1@example.com'},
    {id: 2, nombre: 'Autor 2', apellido: 'Apellido 2', email: 'autor2@example.com'},
    {id: 3, nombre: 'Autor 3', apellido: 'Apellido 3', email: 'autor3@example.com'},
    {id: 4, nombre: 'Autor 4', apellido: 'Apellido 4', email: 'autor4@example.com'},
  ])
  const [mensaje, setMensaje] = useState('')

  const handleChangeObra = (e) => {
    setObra({...obra, [e.target.name]: e.target.value})
  }

  const handleClickAutor = (id) => {
    // Si el autor ya esta en la lista de autores de la obra entonces lo eliminas, si no esta entonces lo añades
    obra.autores.includes(id)
      ? setObra({...obra, autores: obra.autores.filter(autorId => autorId !== id)})
      : setObra({...obra, autores: [...obra.autores, id]})
  }

  const handleCancelarObra = () => {
    setNuevaObra(false)
    setMostrarAutoresDisponibles(false)
    setObra({titulo: '', clasificacion: '', autores: []})
  }

  const handleSubmitObra = (e) => {
    e.preventDefault()

    // Validar que los campos no estén vacíos
    if(!obra.titulo.trim() || !obra.clasificacion || obra.autores.length === 0) {
      setMensaje('Por favor, completa todos los campos')
      setTimeout(() => {
        setMensaje('')
      }, 2000)
      return
    }

    // Si la validación es exitosa entonces guardas la obra, reseteas el formulario y muestras un mensaje de éxito.
    setObras([...obras, obra])
    setObra({titulo: '', clasificacion: '', autores: []})
    setNuevaObra(false)
    setMostrarAutoresDisponibles(false)
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
          </label>
          <button type="button" onClick={() => setMostrarAutoresDisponibles(!mostrarAutoresDisponibles)}>
            {mostrarAutoresDisponibles ? 'Ocultar Autores' : 'Seleccionar Autores'}
          </button>
          {mostrarAutoresDisponibles && (
            <div>
              {autoresDisponibles.map(autor => (
                <div key={autor.id}>
                  <p>{autor.nombre} {autor.apellido}</p>
                  <p>{autor.email}</p>
                  <button type="button" onClick={() => handleClickAutor(autor.id)}>
                    {obra.autores.includes(autor.id) ? 'Eliminar Autor' : 'Añadir Autor'}
                  </button>
                </div>
              ))}
            </div>
          )}
          <button type="submit">Guardar</button>
          <button type="button" onClick={handleCancelarObra}>Cancelar</button>
        </form>
      )}
      <ul>
        {obras.map((obra, index) => (
          <li key={index}>
            {obra.titulo}-{obra.clasificacion}
            {obra.autores.length > 0 && (
              <ul>
                {obra.autores.map(autorId => {
                  const autor = autoresDisponibles.find(a => a.id === autorId)
                  return (
                    <li key={autorId}>{autor.nombre} {autor.apellido}</li>
                  )
                })}
              </ul>
            )}
          </li>
        ))}
      </ul>
      {mensaje && (
        <p>{mensaje}</p>
      )}
    </>
  )
}

export default Obras
