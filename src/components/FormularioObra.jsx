import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useRetroalimentacion } from '../context/Retroalimentacion'
import { obtenerAutores } from '../services/autoresService'
import ListaAutores from './ListaAutores'

function FormularioObra({ obra, onChangeObra, onSubmit, onCancelar }) {
    const [mostrarAutoresDisponibles, setMostrarAutoresDisponibles] = useState(false)
    const [autoresDisponibles, setAutoresDisponibles] = useState([])

    const mostrarMEnsaje = useRetroalimentacion();

    const cargarAutores = async () => {
        try {
            const autoresObtenidos = await obtenerAutores()
            setAutoresDisponibles(autoresObtenidos)
        } catch (error) {
            mostrarMensaje({tipo: 'Error', texto: 'No se pudieron cargar los autores, intentelo nuevamente'})
        }
    }

    useEffect(() => { cargarAutores() }, [])

    const handleClickAutor = (autor) => {
        // Si el autor ya esta en la lista de autores de la obra entonces lo eliminas, si no esta entonces lo añades
        const nuevosAutores = obra.autores.includes(autor.id)
            ? obra.autores.filter(autorId => autorId !== autor.id)
            : [...obra.autores, autor.id]

        onChangeObra({target: { name: 'autores', value: nuevosAutores }})
    }    

    return (
        <form onSubmit={onSubmit}>
          <label>
            Titulo:
            <input type="text" name="titulo" value={obra.titulo} onChange={onChangeObra}/>
          </label>
          <label>
            Clasificación:
            <select name="clasificacion" value={obra.clasificacion} onChange={onChangeObra}>
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
            <>
              <ListaAutores 
                  autores={autoresDisponibles}
                  botones={[
                      { texto: (autor) => (obra.autores.includes(autor.id) ? 'Quitar' : 'Añadir'), onClick: handleClickAutor }
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