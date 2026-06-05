import { useState, useEffect } from 'react'
import { useRetroalimentacion } from '../context/Retroalimentacion'
import { useConfirmar } from '../context/Confirmar'
import { registrarObra, obtenerObras, eliminarObra, actualizarObra } from '../services/obrasService'
import FormularioObra from '../components/FormularioObra'
import TablaObras from '../components/TablaObras'

function Obras() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
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

  const handleEditarObra = (obra) => {
    setObraFormulario(obra)
    setMostrarFormulario(true)
  }

  const handleEliminarObra = async (obra) => {
    const confirmar = await confirmarAccion('¿Estás seguro que deseas eliminar esta obra?')
    if (!confirmar) return

    try {
      await eliminarObra(obra.id)
      mostrarMensaje({tipo: 'Exito', texto: 'Obra eliminada exitosamente'})
      await cargarObras()
    } catch (error) {
      mostrarMensaje({tipo: 'Error', texto: 'Error al eliminar la obra, intente nuevamente'})
    }
  }

  return (
    <>
      <button onClick={() => setMostrarFormulario(true)}>Nueva Obra</button>
      {mostrarFormulario && (
        <FormularioObra 
          ocultarFormulario={() => setMostrarFormulario(false)}
          onExito={cargarObras}
        />
      )}
      {obras.length > 0 ? (
        <TablaObras 
          obras={obras} 
          onEditar={handleEditarObra}
          onEliminar={handleEliminarObra}
        />
      ) : (
        <p>Aun no hay obras registradas</p>
      )}
    </>
  )
}

export default Obras;
