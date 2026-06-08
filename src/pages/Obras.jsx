import { useState, useEffect } from 'react'
import { useRetroalimentacion } from '../context/Retroalimentacion'
import { obtenerObras, registrarObra, actualizarObra } from '../services/obrasService'
import FormularioObra from '../components/FormularioObra'
import TablaObras from '../components/TablaObras'

function Obras() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [obraAEditar, setObraAEditar] = useState({ titulo: '', clasificacion: '', autores: [] })
  const [obras, setObras] = useState([])
  const mostrarMensaje = useRetroalimentacion()

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
        await actualizarObra(obraFormulario.id, obraFormulario)
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

  return (
    <>
      <button onClick={() => setMostrarFormulario(true)}>Nueva Obra</button>
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
          onEditarObra={handleEditarObra}
        />
      ) : (
        <p>Aun no hay obras registradas</p>
      )}
    </>
  )
}

export default Obras;
