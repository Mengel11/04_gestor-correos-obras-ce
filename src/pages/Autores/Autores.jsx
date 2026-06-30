import { useState, useEffect } from 'react'
import { useAuth } from '../../context/Auth'
import { useConfirmar } from '../../context/Confirmar'
import { useRetroalimentacion } from '../../context/Retroalimentacion'
import { registrarAutor, obtenerAutores, eliminarAutor, actualizarAutor } from '../../services/autoresService'
import { validarEmail } from '../../utils/validaciones'
import FormularioAutor from './components/FormularioAutor'
import ListaAutores from './components/ListaAutores'
import styles from './styles/Autores.module.css'


function Autores() {
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [autorFormulario, setAutorFormulario] = useState({nombre:'', apellidoPaterno:'', apellidoMaterno:'', correo:''})
    const [autores, setAutores] = useState([])
    const { puedeEscribir } = useAuth()

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
        if (!puedeEscribir) return

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
            mostrarMensaje({tipo: 'Exito', texto: 'Autor guardado exitosamente'})
            await cargarAutores()
        } catch (error) {
            mostrarMensaje({tipo: 'Error', texto: 'Error al guardar el autor, intente nuevamente'})
        }
    }

    const handleEditarAutor = (autor) => {
        if (!puedeEscribir) return
        setMostrarFormulario(true)
        setAutorFormulario(autor)
    }

    const handleEliminarAutor = async (autor) => {
        if (!puedeEscribir) return
        const confirmar = await confirmarAccion('¿Estás seguro de que deseas eliminar este autor?')
        if (!confirmar) return
        
        try {
            await eliminarAutor(autor.id)
            mostrarMensaje({tipo: 'Exito', texto: 'Autor eliminado exitosamente'})
            await cargarAutores()
        } catch (error) {
            mostrarMensaje({tipo: 'Error', texto: 'Error al eliminar el autor, intente nuevamente'})
        }
    }
    

    return (
        <div className={styles.pagina}>
            <div className={styles.encabezado}>
                <h1 className={styles.titulo}>Autores</h1>
                {puedeEscribir && (
                    <button type="button" className={styles.botonNuevo} onClick={() => setMostrarFormulario(true)}>
                        Nuevo Autor
                    </button>
                )}
            </div>
            {puedeEscribir && mostrarFormulario && (
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
                    botones={puedeEscribir ? [
                        { texto: 'Editar', onClick: handleEditarAutor },
                        { texto: 'Eliminar', onClick: handleEliminarAutor }
                    ] : []}
                />
            ): (
                <p className={styles.vacio}>No hay autores registrados</p>
            )}
        </div>
    )
}

export default Autores