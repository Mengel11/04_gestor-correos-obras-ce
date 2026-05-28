import { useState, useEffect } from 'react'
import { useConfirmar } from '../context/Confirmar'
import { registrarAutor, obtenerAutores, eliminarAutor, actualizarAutor } from '../services/autoresService'
import { validarEmail } from '../utils/validaciones'
import FormularioAutor from '../components/FormularioAutor'
import ListaAutores from '../components/ListaAutores'


function Autores() {
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [autorFormulario, setAutorFormulario] = useState({nombre:'', apellidoPaterno:'', apellidoMaterno:'', correo:''})
    const [mensaje, setMensaje] = useState('')
    const [autores, setAutores] = useState([])

    const confirmarAccion = useConfirmar()

    const cargarAutores = async () => {
        try {
            const autoresObtenidos = await obtenerAutores()
            setAutores(autoresObtenidos)
        } catch (error) {
            setMensaje('No se pudieron cargar los autores, intentelo nuevamente')
            setTimeout(() => {
                setMensaje('')
            }, 2000)
        }
    }

    useEffect(() => { cargarAutores() }, [])
    
    const handleChangeAutor = (e) => {
        const { name, value } = e.target
        setAutorFormulario(prev => ({ ...prev, [name]: value }))
    }

    const handleCancelarFormulario = () => {
        setMostrarFormulario(false)
        setAutorFormulario({nombre:'', apellidoPaterno:'', apellidoMaterno:'', correo:''})
    }
    
    const handleSubmitFormulario = async (e) => {
        e.preventDefault()

        // Validar que los campos no estén vacíos
        if(!autorFormulario.nombre.trim() || !autorFormulario.apellidoPaterno.trim() || !autorFormulario.apellidoMaterno.trim() || !autorFormulario.correo.trim()) {
            setMensaje('Por favor, completa todos los campos')
            setTimeout(() => {
                setMensaje('')
            }, 2000)
            return
        }

        //Validar que el correo tenga un formato correcto
        if(!validarEmail(autorFormulario.correo)) {
            setMensaje('Por favor, ingresa un correo electrónico válido')
            setTimeout(() => {
                setMensaje('')
            }, 2000)
            return
        }

        // Si la validación es exitosa entonces guardas el autor, reseteas el formulario y muestras un mensaje de éxito.
        try {
            if (autorFormulario.id) {
                await actualizarAutor(autorFormulario.id, autorFormulario)
            } else { 
                await registrarAutor(autorFormulario)
            }
            handleCancelarFormulario()
            setMensaje('Autor guardado exitosamente')
            setTimeout(() => {
                setMensaje('')
            }, 2000)
            cargarAutores()
        } catch (error) {
            setMensaje('Error al guardar el autor')
            setTimeout(() => {
                setMensaje('')
            }, 2000)
        }
    }

    const handleEditarAutor = (autor) => {
        setMostrarFormulario(true)
        setAutorFormulario(autor)
    }

    const handleEliminarAutor = async (id) => {
        const confirmar = await confirmarAccion('¿Estás seguro de que deseas eliminar este autor?')
        if (!confirmar) return
        
        try {
            await eliminarAutor(id)
            setMensaje('Autor eliminado exitosamente')
            setTimeout(() => { setMensaje('') }, 2000)
            cargarAutores()
        } catch (error) {
            setMensaje('Error al eliminar el autor, intente nuevamente')
            setTimeout(() => { setMensaje('') }, 2000)
        }
    }
    

    return (
        <>
            <button onClick={() => setMostrarFormulario(true)}>Nuevo Autor</button>
            {mostrarFormulario && (
                <FormularioAutor 
                    autor={autorFormulario}
                    onChangeAutor={handleChangeAutor}
                    onSubmit={handleSubmitFormulario}
                    onCancelar={handleCancelarFormulario}
                />
            )}
            {mensaje && (
                <p>{mensaje}</p>
            )}
            {autores.length > 0 ? (
                <ListaAutores 
                    autores={autores}
                    onEditar={handleEditarAutor}
                    onEliminar={handleEliminarAutor}
                />
            ): (
                <p>No hay autores registrados</p>
            )}
        </>
    )
}

export default Autores