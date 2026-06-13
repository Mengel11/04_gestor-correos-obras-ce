import { useState, useEffect } from 'react'
import { useConfirmar } from '../context/Confirmar'
import { useRetroalimentacion } from '../context/Retroalimentacion'
import { registrarRevisor, obtenerRevisores, eliminarRevisor, actualizarRevisor } from '../services/revisoresService'
import { validarEmail } from '../utils/validaciones'
import FormularioRevisor from '../components/FormularioRevisor'
import ListaRevisores from '../components/ListaRevisores'


function Revisores() {
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [revisorFormulario, setRevisorFormulario] = useState({nombre:'', apellidoPaterno:'', apellidoMaterno:'', correo:''})
    const [revisores, setRevisores] = useState([])

    const confirmarAccion = useConfirmar()
    const mostrarMensaje = useRetroalimentacion()

    const cargarRevisores = async () => {
        try {
            const revisoresObtenidos = await obtenerRevisores()
            setRevisores(revisoresObtenidos)
        } catch (error) {
            mostrarMensaje({tipo: 'Error', texto: 'No se pudieron cargar los revisores, intentelo nuevamente'})
            console.error(error)
        }
    }

    useEffect(() => { cargarRevisores() }, [])
    
    const handleChangeRevisor = (e) => {
        const { name, value } = e.target
        setRevisorFormulario(prev => ({ ...prev, [name]: value }))
    }

    const handleCancelarFormulario = () => {
        setMostrarFormulario(false)
        setRevisorFormulario({nombre:'', apellidoPaterno:'', apellidoMaterno:'', correo:''})
    }
    
    const handleSubmitFormulario = async (e) => {
        e.preventDefault()

        // Validar que los campos no estén vacíos
        if(!revisorFormulario.nombre.trim() || !revisorFormulario.apellidoPaterno.trim() || !revisorFormulario.apellidoMaterno.trim() || !revisorFormulario.correo.trim()) {
            mostrarMensaje({tipo: 'Informar', texto: 'Por favor, completa todos los campos'})
            return
        }

        //Validar que el correo tenga un formato correcto
        if(!validarEmail(revisorFormulario.correo)) {
            mostrarMensaje({tipo: 'Informar', texto: 'Por favor, ingresa un correo electrónico válido'})
            return
        }

        // Si la validación es exitosa entonces guardas el revisor, reseteas el formulario y muestras un mensaje de éxito.
        try {
            if (revisorFormulario.id) {
                await actualizarRevisor(revisorFormulario.id, revisorFormulario)
            } else { 
                await registrarRevisor(revisorFormulario)
            }
            handleCancelarFormulario()
            mostrarMensaje({tipo: 'Éxito', texto: 'Revisor guardado exitosamente'})
            cargarRevisores()
        } catch (error) {
            mostrarMensaje({tipo: 'Error', texto: 'Error al guardar el revisor'})
        }
    }

    const handleEditarRevisor = (revisor) => {
        setMostrarFormulario(true)
        setRevisorFormulario(revisor)
    }

    const handleEliminarRevisor = async (revisor) => {
        const confirmar = await confirmarAccion('¿Estás seguro de que deseas eliminar este revisor?')
        if (!confirmar) return
        
        try {
            await eliminarRevisor(revisor.id)
            mostrarMensaje({tipo: 'Éxito', texto: 'Revisor eliminado exitosamente'})
            cargarRevisores()
        } catch (error) {
            mostrarMensaje({tipo: 'Error', texto: 'Error al eliminar el revisor, intente nuevamente'})
        }
    }
    

    return (
        <>
            <button onClick={() => setMostrarFormulario(true)}>Nuevo Revisor</button>
            {mostrarFormulario && (
                <FormularioRevisor 
                    revisor={revisorFormulario}
                    onChangeRevisor={handleChangeRevisor}
                    onSubmit={handleSubmitFormulario}
                    onCancelar={handleCancelarFormulario}
                />
            )}
            {revisores.length > 0 ? (
                <ListaRevisores 
                    revisores={revisores}
                    botones={[
                        { texto: 'Editar', onClick: handleEditarRevisor },
                        { texto: 'Eliminar', onClick: handleEliminarRevisor }
                    ]}
                />
            ): (
                <p>No hay revisores registrados</p>
            )}
        </>
    )
}

export default Revisores