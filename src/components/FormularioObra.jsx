import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useRetroalimentacion } from '../context/Retroalimentacion';
import { obtenerAutores } from '../services/autoresService';
import ListaAutores from './ListaAutores'

function FormularioObra({ obraAEditar, onGuardar, onCancelar }) {
    const [obraFormulario, setObraFormulario] = useState(obraAEditar)
    const [mostrarAutoresDisponibles, setMostrarAutoresDisponibles] = useState(false)
    const [autoresDisponibles, setAutoresDisponibles] = useState([])

    const mostrarMensaje = useRetroalimentacion()

    const cargarAutores = async () => {
        try {
            const autoresObtenidos = await obtenerAutores()
            setAutoresDisponibles(autoresObtenidos)
        } catch (error) {
            mostrarMensaje({tipo: 'Error', texto: 'No se pudieron cargar los autores, intentelo nuevamente'})
        }
    }

    useEffect(() => { cargarAutores() }, [])

    const handleChangeObra = (e) => {
      const { name, value } = e.target
      setObraFormulario({...obraFormulario, [name]: value})
    }

    const handleClickAutor = (autor) => {
        // Si el autor ya esta en la lista de autores de la obra entonces lo eliminas, si no esta entonces lo añades
        const nuevosAutores = obraFormulario.autores.includes(autor.id)
            ? obraFormulario.autores.filter(autorId => autorId !== autor.id)
            : [...obraFormulario.autores, autor.id]

        handleChangeObra({target: { name: 'autores', value: nuevosAutores }})
    }

    return (
        <form onSubmit={(e) => onGuardar(e, obraFormulario)}>
          <label>
            Titulo:
            <input type="text" name="titulo" value={obraFormulario.titulo} onChange={handleChangeObra}/>
          </label>
          <label>
            Clasificación:
            <select name="clasificacion" value={obraFormulario.clasificacion} onChange={handleChangeObra}>
              <option value="" disabled hidden>Selecciona una opción</option>
              <option value="Libro de texto">Libro de texto</option>
              <option value="Libro cientifico">Libro científico</option>
              <option value="Notas de curso normal">Notas de curso normal</option>
              <option value="Notas de curso especial">Notas de curso especial</option>
              <option value="Paquete de computo de docencia">Paquete de computo de docencia</option>
              <option value="Paquete de computo cientifico">Paquete de cómputo científico</option>
              <option value="Libro de divulgacion">Libro de divulgación</option>
            </select>
          </label>
          <button type="button" onClick={() => setMostrarAutoresDisponibles(!mostrarAutoresDisponibles)}>
            {mostrarAutoresDisponibles ? 'Ocultar Autores' : 'Seleccionar Autores'}
          </button>
          {mostrarAutoresDisponibles && (
            <>
              <ListaAutores 
                  autores={autoresDisponibles}
                  botones={[
                      { texto: (autor) => (obraFormulario.autores.includes(autor.id) ? 'Quitar' : 'Añadir'), onClick: handleClickAutor }
                  ]} 
              />
              <Link to="/autores">Nuevo Autor</Link>
            </>
          )}
          <button type="submit">Guardar</button>
          <button type="button" onClick={onCancelar}>Cancelar</button>
        </form>
    )
}

export default FormularioObra;