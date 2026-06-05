import { useState, useEffect } from 'react'
import { useRetroalimentacion } from '../context/Retroalimentacion'
import { useConfirmar } from '../context/Confirmar'
import { obtenerObras } from '../services/obrasService'
import FormularioObra from '../components/FormularioObra'
import TablaObras from '../components/TablaObras'

function Obras() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [obraAEditar, setObraAEditar] = useState(null)
  const [obras, setObras] = useState([])

  const cargarObras = async () => {
    try {
      const obrasObtenidas = await obtenerObras()
      setObras(obrasObtenidas)
    } catch (error) {
      mostrarMensaje({tipo: 'Error', texto: 'No se pudieron cargar las obras, intentelo nuevamente'})
    }
  }

  useEffect(() => { cargarObras() }, [])

  const handleMostrarFormulario = (obra = { titulo: '', clasificacion: '', autores: [] }) => {
    setMostrarFormulario(true)
    setObraAEditar(obra)
  }

  return (
    <>
      <button onClick={() => handleMostrarFormulario()}>Nueva Obra</button>
      {mostrarFormulario && (
        <FormularioObra 
          obraAEditar={obraAEditar}
          ocultarFormulario={() => setMostrarFormulario(false)}
          onExito={cargarObras}
        />
      )}
      {obras.length > 0 ? (
        <TablaObras 
          obras={obras}
          handleMostrarFormulario={handleMostrarFormulario}
        />
      ) : (
        <p>Aun no hay obras registradas</p>
      )}
    </>
  )
}

export default Obras;
