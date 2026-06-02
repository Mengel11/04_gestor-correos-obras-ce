import { useState, useEffect } from 'react'
import { useRetroalimentacion } from '../context/Retroalimentacion'
import { useConfirmar } from '../context/Confirmar'
import { registrarObra, obtenerObras, eliminarObra, actualizarObra } from '../services/obrasService'
import FormularioObra from '../components/FormularioObra'
import TablaObras from '../components/TablaObras'

function Obras() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [obraFormulario, setObraFormulario] = useState({ titulo: '', clasificacion: '', autores: [] })
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

  const handleChangeObra = (e) => {
    const { name, value } = e.target
    setObraFormulario({...obraFormulario, [name]: value})
  }

  const handleCancelarFormulario = () => {
    setMostrarFormulario(false)
    setObraFormulario({titulo: '', clasificacion: '', autores: []})
  }

  const handleSubmitFormulario = async (e) => {
    e.preventDefault()

    // Validar que los campos no estén vacíos
    if(!obraFormulario.titulo.trim() || !obraFormulario.clasificacion || obraFormulario.autores.length === 0) {
      mostrarMensaje({tipo: 'Error', texto: 'Por favor, completa todos los campos'})
      return
    }

    // Si la validación es exitosa entonces guardas la obra, reseteas el formulario y muestras un mensaje de éxito.
    try {
      if (obraFormulario.id) {
        await actualizarObra(obraFormulario.id, obraFormulario)
      } else {
        await registrarObra(obraFormulario)
      }
      handleCancelarFormulario()
      mostrarMensaje({tipo: 'Exito', texto: 'Obra guardada exitosamente'})
      await cargarObras()
    } catch (error) {
      mostrarMensaje({tipo: 'Error', texto: 'Error al guardar la obra'})
    }
  }

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
          obra={obraFormulario}
          onChangeObra={handleChangeObra}
          onSubmit={handleSubmitFormulario}
          onCancelar={handleCancelarFormulario}
        />
      )}
      {obras.length > 0 ? (
        <TablaObras obras={obras} />
      ) : (
        <p>Aun no hay obras registradas</p>
      )}
    </>
  )
}

export default Obras;
