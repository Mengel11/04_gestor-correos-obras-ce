import { useState, useEffect } from 'react'
import { useConfirmar } from '../context/Confirmar'
import { registrarRevisor, obtenerRevisores, eliminarRevisor, actualizarRevisor } from '../services/revisoresService'
import { validarEmail } from '../utils/validaciones'
import FormularioRevisor from '../components/FormularioRevisor'
import ListaRevisores from '../components/ListaRevisores'


function Revisores() {
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [revisorFormulario, setRevisorFormulario] = useState({nombre:'', apellidoPaterno:'', apellidoMaterno:'', correo:''})
    const [mensaje, setMensaje] = useState('')
    const [revisores, setRevisores] = useState([])

    const confirmarAccion = useConfirmar()

    const cargarRevisores = async () => {
        try {
            const revisoresObtenidos = await obtenerRevisores()
            setRevisores(revisoresObtenidos)
        } catch (error) {
            setMensaje('No se pudieron cargar los revisores, intentelo nuevamente')
            setTimeout(() => { setMensaje('') }, 2000)
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
            setMensaje('Por favor, completa todos los campos')
            setTimeout(() => { setMensaje('') }, 2000)
            return
        }

        //Validar que el correo tenga un formato correcto
        if(!validarEmail(revisorFormulario.correo)) {
            setMensaje('Por favor, ingresa un correo electrónico válido')
            setTimeout(() => { setMensaje('') }, 2000)
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
            setMensaje('Revisor guardado exitosamente')
            setTimeout(() => { setMensaje('') }, 2000)
            cargarRevisores()
        } catch (error) {
            setMensaje('Error al guardar el revisor')
            setTimeout(() => { setMensaje('') }, 2000) }
    }

    const handleEditarRevisor = (revisor) => {
        setMostrarFormulario(true)
        setRevisorFormulario(revisor)
    }

    const handleEliminarRevisor = async (id) => {
        const confirmar = await confirmarAccion('¿Estás seguro de que deseas eliminar este revisor?')
        if (!confirmar) return
        
        try {
            await eliminarRevisor(id)
            setMensaje('Revisor eliminado exitosamente')
            setTimeout(() => { setMensaje('') }, 2000)
            cargarRevisores()
        } catch (error) {
            setMensaje('Error al eliminar el revisor, intente nuevamente')
            setTimeout(() => { setMensaje('') }, 2000)
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
            {mensaje && (
                <p>{mensaje}</p>
            )}
            {revisores.length > 0 ? (
                <ListaRevisores 
                    revisores={revisores}
                    onEditar={handleEditarRevisor}
                    onEliminar={handleEliminarRevisor}
                />
            ): (
                <p>No hay revisores registrados</p>
            )}
        </>
    )
}

export default Revisores