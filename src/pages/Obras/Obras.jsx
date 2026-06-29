import { useState, useEffect } from 'react'
import { useRetroalimentacion } from '../../context/Retroalimentacion'
import { useConfirmar } from '../../context/Confirmar'
import { obtenerObras, registrarObra, actualizarObra, eliminarObra } from '../../services/obrasService'
import { aplicarEfectosCambioClasificacion } from '../../utils/obraUtils'
import FormularioObra from './components/FormularioObra'
import TablaObras from './components/TablaObras'
import styles from './styles/Obras.module.css'

function Obras() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [obraAEditar, setObraAEditar] = useState({ titulo: '', clasificacion: '', autores: [] })
  const [obras, setObras] = useState([])
  const mostrarMensaje = useRetroalimentacion()
  const confirmarAccion = useConfirmar()

  const cargarObras = async () => {
    try {
      const obrasObtenidas = await obtenerObras()
      setObras(obrasObtenidas)
    } catch (error) {
      mostrarMensaje({tipo: 'Error', texto: 'No se pudieron cargar las obras, intentelo nuevamente'})
    }
  }

  useEffect(() => { cargarObras() }, [])

  const handleCancelarFormulario = () => {
    setMostrarFormulario(false)
    setObraAEditar({ titulo: '', clasificacion: '', autores: [] })
  }

  const handleSubmitFormulario = async (e, obraFormulario) => {
    e.preventDefault()

    // Validar que los campos no estén vacíos
    if(!obraFormulario.titulo.trim() || !obraFormulario.clasificacion || obraFormulario.autores.length === 0) {
      mostrarMensaje({tipo: 'Error', texto: 'Por favor, completa todos los campos'})
      return
    }

    // Si la validación es exitosa entonces guardas la obra, reseteas el formulario y muestras un mensaje de éxito.
    try {
      if (obraFormulario.id) {
        const obraOriginal = obras.find(obra => obra.id === obraFormulario.id)
        await actualizarObra(obraFormulario.id, {
          ...obraFormulario,
          ...aplicarEfectosCambioClasificacion(obraOriginal, obraFormulario.clasificacion),
        })
      } else {
        await registrarObra(obraFormulario)
      }
      cargarObras()
      handleCancelarFormulario()
      mostrarMensaje({tipo: 'Exito', texto: 'Obra guardada exitosamente'})
    } catch (error) {
      mostrarMensaje({tipo: 'Error', texto: 'Error al guardar la obra'})
    }
  }

  const handleEditarObra = (obra) => {
    setObraAEditar(obra)
    setMostrarFormulario(true)
  }

  const handleEliminarObra = async (obra) => {
    const confirmar = await confirmarAccion('¿Estás seguro que deseas eliminar esta obra?')
    if (!confirmar) return

    try {
      await eliminarObra(obra.id)
      mostrarMensaje({tipo: 'Exito', texto: 'Obra eliminada exitosamente'})
      cargarObras()
    } catch (error) {
      mostrarMensaje({tipo: 'Error', texto: 'Error al eliminar la obra, intente nuevamente'})
    }
  }

  return (
    <div className={styles.pagina}>
      <div className={styles.encabezado}>
        <div className={styles.titulos}>
          <h1 className={styles.titulo}>Obras</h1>
          <p className={styles.subtitulo}>Gestión de obras del Consejo Editorial</p>
        </div>
        <button type="button" className={styles.botonNuevo} onClick={() => setMostrarFormulario(true)}>
          Nueva Obra
        </button>
      </div>
      {mostrarFormulario && (
        <FormularioObra 
          obraAEditar={obraAEditar}
          onGuardar={handleSubmitFormulario}
          onCancelar={handleCancelarFormulario}
        />
      )}
      {obras.length > 0 ? (
        <TablaObras 
          obras={obras}
          botones={[
                {texto: 'Editar', onClick: handleEditarObra},
                {texto: 'Eliminar', onClick: handleEliminarObra}
          ]}
        />
      ) : (
        <p className={styles.vacio}>Aun no hay obras registradas</p>
      )}
    </div>
  )
}

export default Obras;
