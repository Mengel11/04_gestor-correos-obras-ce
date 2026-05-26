import { useState } from 'react'
import { registrarAutor } from '../services/autoresService'

const validarEmail = (email) => {
  const todoMenosEspaciosNiArrobas = '[^\\s@]+'
  const regex = new RegExp(`^${todoMenosEspaciosNiArrobas}@${todoMenosEspaciosNiArrobas}\\.${todoMenosEspaciosNiArrobas}$`)
  return regex.test(email)
}

function Autores() {
    const [nuevoAutor, setNuevoAutor] = useState(false)
    const [autor, setAutor] = useState({nombre:'', apellidoPaterno:'', apellidoMaterno:'', correo:''})
    const [mensaje, setMensaje] = useState('')
    
    const handleChangeAutor = (e) => {
        const { name, value } = e.target
        setAutor(prev => ({ ...prev, [name]: value }))
    }

    const handleCancelarAutor = () => {
        setNuevoAutor(false)
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
            await registrarAutor(autor)
            handleCancelarAutor()
            setMensaje('Autor guardado exitosamente')
            setTimeout(() => {
                setMensaje('')
            }, 2000)
        } catch (error) {
            setMensaje('Error al guardar el autor')
        }
    }

    return (
        <>
            <button onClick={() => setNuevoAutor(true)}>Nuevo Autor</button>
            {nuevoAutor && (
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
                    <button type="button" onClick={handleCancelarAutor}>Cancelar</button>
                </form>
            )}
            {mensaje && (
                <p>{mensaje}</p>
            )}
        </>
    )
}

export default Autores