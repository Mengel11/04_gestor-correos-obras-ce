import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useRetroalimentacion } from '../../../context/Retroalimentacion';
import { obtenerAutores } from '../../../services/autoresService';
import ListaAutores from '../../Autores/components/ListaAutores'
import styles from '../styles/FormularioObra.module.css'

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

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])

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
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="titulo-formulario-obra">
          <div className={styles.modal}>
            <h2 id="titulo-formulario-obra" className={styles.titulo}>
              {obraFormulario.id ? 'Editar obra' : 'Nueva obra'}
            </h2>
            <form onSubmit={(e) => onGuardar(e, obraFormulario)} className={styles.formulario}>
              <label className={styles.campo}>
                Título
                <input type="text" name="titulo" className={styles.input} value={obraFormulario.titulo} onChange={handleChangeObra}/>
              </label>
              <label className={styles.campo}>
                Clasificación
                <select name="clasificacion" className={styles.select} value={obraFormulario.clasificacion} onChange={handleChangeObra}>
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
              <div className={styles.seccionAutores}>
                <button type="button" className={styles.toggleAutores} onClick={() => setMostrarAutoresDisponibles(!mostrarAutoresDisponibles)}>
                  {mostrarAutoresDisponibles ? 'Ocultar Autores' : 'Seleccionar Autores'}
                </button>
                {mostrarAutoresDisponibles && (
                  <>
                    <ListaAutores 
                        autores={autoresDisponibles}
                        variante="compacta"
                        botones={[
                            { texto: (autor) => (obraFormulario.autores.includes(autor.id) ? 'Quitar' : 'Añadir'), onClick: handleClickAutor }
                        ]} 
                    />
                    <Link to="/autores" className={styles.enlaceNuevoAutor}>Nuevo Autor</Link>
                  </>
                )}
              </div>
              <div className={styles.botones}>
                <button type="button" className={styles.botonCancelar} onClick={onCancelar}>Cancelar</button>
                <button type="submit" className={styles.botonGuardar}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
    )
}

export default FormularioObra;
