import { useState, useEffect } from 'react'
import { useConfirmar } from '../../context/Confirmar'
import { useRetroalimentacion } from '../../context/Retroalimentacion'
import { registrarAutor, obtenerAutores, eliminarAutor, actualizarAutor } from '../../services/autoresService'
import { validarEmail } from '../../utils/validaciones'
import FormularioAutor from './components/FormularioAutor'
import ListaAutores from './components/ListaAutores'


function Autores() {
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [autorFormulario, setAutorFormulario] = useState({nombre:'', apellidoPaterno:'', apellidoMaterno:'', correo:''})
    const [autores, setAutores] = useState([])

    const confirmarAccion = useConfirmar()
    const mostrarMensaje = useRetroalimentacion()

    const cargarAutores = async () => {
        try {
            const autoresObtenidos = await obtenerAutores()
            setAutores(autoresObtenidos)
        } catch (error) {
            mostrarMensaje({tipo: 'Error', texto: 'No se pudieron cargar los autores, intentelo nuevamente'})
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
            mostrarMensaje({tipo: 'Informar', texto: 'Por favor, completa todos los campos'})
            return
        }

        //Validar que el correo tenga un formato correcto
        if(!validarEmail(autorFormulario.correo)) {
            mostrarMensaje({tipo: 'Informar', texto: 'Por favor, ingresa un correo electrónico válido'})
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
            mostrarMensaje({tipo: 'Éxito', texto: 'Autor guardado exitosamente'})
            await cargarAutores()
        } catch (error) {
            mostrarMensaje({tipo: 'Error', texto: 'Error al guardar el autor, intente nuevamente'})
        }
    }

    const handleEditarAutor = (autor) => {
        setMostrarFormulario(true)
        setAutorFormulario(autor)
    }

    const handleEliminarAutor = async (autor) => {
        const confirmar = await confirmarAccion('¿Estás seguro de que deseas eliminar este autor?')
        if (!confirmar) return
        
        try {
            await eliminarAutor(autor.id)
            mostrarMensaje({tipo: 'Éxito', texto: 'Autor eliminado exitosamente'})
            await cargarAutores()
        } catch (error) {
            mostrarMensaje({tipo: 'Error', texto: 'Error al eliminar el autor, intente nuevamente'})
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
            {autores.length > 0 ? (
                <ListaAutores 
                    autores={autores}
                    botones={[
                        { texto: 'Editar', onClick: handleEditarAutor },
                        { texto: 'Eliminar', onClick: handleEliminarAutor }
                    ]}
                />
            ): (
                <p>No hay autores registrados</p>
            )}
        </>
    )
}

export default Autores