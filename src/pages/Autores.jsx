import { useState, useEffect } from 'react'
import { registrarAutor, obtenerAutores, eliminarAutor, actualizarAutor } from '../services/autoresService'
import TarjetaAutor from '../components/TarjetaAutor'

const validarEmail = (email) => {
  const todoMenosEspaciosNiArrobas = '[^\\s@]+'
  const regex = new RegExp(`^${todoMenosEspaciosNiArrobas}@${todoMenosEspaciosNiArrobas}\\.${todoMenosEspaciosNiArrobas}$`)
  return regex.test(email)
}

function Autores() {
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [autor, setAutor] = useState({nombre:'', apellidoPaterno:'', apellidoMaterno:'', correo:''})
    const [mensaje, setMensaje] = useState('')
    const [autores, setAutores] = useState([])

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

    useEffect(() => {
        cargarAutores()
    }, [])
    
    const handleChangeAutor = (e) => {
        const { name, value } = e.target
        setAutor(prev => ({ ...prev, [name]: value }))
    }

    const handleCancelarFormulario = () => {
        setMostrarFormulario(false)
        setAutor({nombre:'', apellidoPaterno:'', apellidoMaterno:'', correo:''})
    }
    
    const handleSubmitAutor = async (e) => {
        e.preventDefault()

        // Validar que los campos no estén vacíos
        if(!autor.nombre.trim() || !autor.apellidoPaterno.trim() || !autor.apellidoMaterno.trim() || !autor.correo.trim()) {
            setMensaje('Por favor, completa todos los campos')
            setTimeout(() => {
                setMensaje('')
            }, 2000)
            return
        }

        //Validar que el correo tenga un formato correcto
        if(!validarEmail(autor.correo)) {
            setMensaje('Por favor, ingresa un correo electrónico válido')
            setTimeout(() => {
                setMensaje('')
            }, 2000)
            return
        }

        // Si la validación es exitosa entonces guardas el autor, reseteas el formulario y muestras un mensaje de éxito.
        try {
            if (autor.id) {
                await actualizarAutor(autor.id, autor)
            } else { 
                await registrarAutor(autor)
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
        setAutor(autor)
    }

    const handleEliminarAutor = async (id) => {
        try {
            await eliminarAutor(id)
            setMensaje('Autor eliminado exitosamente')
            setTimeout(() => {
                setMensaje('')
            }, 2000)
            cargarAutores()
        } catch (error) {
            setMensaje('Error al eliminar el autor, intente nuevamente')
            setTimeout(() => {
                setMensaje('')
            }, 2000)
        }
    }

    return (
        <>
            <button onClick={() => setMostrarFormulario(true)}>Nuevo Autor</button>
            {mostrarFormulario && (
                <form onSubmit={handleSubmitAutor}>
                    <label>
                        Nombre(s):
                        <input type="text" name="nombre" value={autor.nombre} onChange={handleChangeAutor} />
                    </label>
                    <label>
                        Apellido Paterno:
                        <input type="text" name="apellidoPaterno" value={autor.apellidoPaterno} onChange={handleChangeAutor} />
                    </label>
                    <label>
                        Apellido Materno:
                        <input type="text" name="apellidoMaterno" value={autor.apellidoMaterno} onChange={handleChangeAutor} />
                    </label>
                    <label>
                        Correo Electrónico:
                        <input type="email" name="correo" value={autor.correo} onChange={handleChangeAutor} required />
                    </label>
                    <button type="submit">Guardar</button>
                    <button type="button" onClick={handleCancelarFormulario}>Cancelar</button>
                </form>
            )}
            {mensaje && (
                <p>{mensaje}</p>
            )}
            {autores.length > 0 ? (
                autores.map(autor => (
                    <div key={autor.id}>
                        <TarjetaAutor autor={autor} />
                        <button onClick={() => handleEditarAutor(autor)}>Editar</button>
                        <button onClick={() => handleEliminarAutor(autor.id)}>Eliminar</button>
                    </div>
                ))
            ): (
                <p>No hay autores registrados</p>
            )}
        </>
    )
}

export default Autores