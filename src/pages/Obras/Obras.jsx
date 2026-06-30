import { useState, useEffect } from 'react'
import { useAuth } from '../../context/Auth'
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
  const { esAdmin, puedeEscribir, listo, autenticado } = useAuth()
  const mostrarMensaje = useRetroalimentacion()
  const confirmarAccion = useConfirmar()

  const cargarObras = async () => {
    try {
      const obrasObtenidas = await obtenerObras()
      setObras(obrasObtenidas)
    } catch (error) {
      console.error('Error al cargar obras:', error)
      const texto = error.code === 'permission-denied'
        ? 'Firestore bloqueó la lectura. Actualiza las reglas de seguridad en Firebase Console.'
        : 'No se pudieron cargar las obras, intentelo nuevamente'
      mostrarMensaje({ tipo: 'Error', texto })
    }
  }

  useEffect(() => {
    if (!listo || !autenticado) return
    cargarObras()
  }, [listo, autenticado])

  const handleCancelarFormulario = () => {
    setMostrarFormulario(false)
    setObraAEditar({ titulo: '', clasificacion: '', autores: [] })
  }

  const handleSubmitFormulario = async (e, obraFormulario) => {
    e.preventDefault()
    if (!puedeEscribir) return

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
    if (!puedeEscribir) return
    setObraAEditar(obra)
    setMostrarFormulario(true)
  }

  const handleEliminarObra = async (obra) => {
    if (!puedeEscribir) return
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
        {puedeEscribir && (
          <button type="button" className={styles.botonNuevo} onClick={() => setMostrarFormulario(true)}>
            Nueva Obra
          </button>
        )}
      </div>
      {puedeEscribir && mostrarFormulario && (
        <FormularioObra 
          obraAEditar={obraAEditar}
          onGuardar={handleSubmitFormulario}
          onCancelar={handleCancelarFormulario}
        />
      )}
      {obras.length > 0 ? (
        <TablaObras 
          obras={obras}
          puedeVerDetalle={esAdmin}
          botones={puedeEscribir ? [
                {texto: 'Editar', onClick: handleEditarObra},
                {texto: 'Eliminar', onClick: handleEliminarObra}
          ] : []}
        />
      ) : (
        <p className={styles.vacio}>Aun no hay obras registradas</p>
      )}
    </div>
  )
}

export default Obras;
