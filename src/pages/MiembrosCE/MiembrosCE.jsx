import { useState, useEffect } from 'react'
import { useConfirmar } from '../../context/Confirmar'
import { useRetroalimentacion } from '../../context/Retroalimentacion'
import { registrarMiembroCE, obtenerMiembrosCE, eliminarMiembroCE, actualizarMiembroCE } from '../../services/miembrosCEService'
import { validarEmail } from '../../utils/validaciones'
import FormularioMiembroCE from './components/FormularioMiembroCE'
import ListaMiembrosCE from './components/ListaMiembrosCE'
import styles from './styles/MiembrosCE.module.css'

const MIEMBRO_CE_INICIAL = { nombre: '', apellidoPaterno: '', apellidoMaterno: '', correo: '' }

function MiembrosCE() {
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [miembroCEFormulario, setMiembroCEFormulario] = useState(MIEMBRO_CE_INICIAL)
    const [miembrosCE, setMiembrosCE] = useState([])

    const confirmarAccion = useConfirmar()
    const mostrarMensaje = useRetroalimentacion()

    const cargarMiembrosCE = async () => {
        try {
            const miembrosCEObtenidos = await obtenerMiembrosCE()
            setMiembrosCE(miembrosCEObtenidos)
        } catch (error) {
            mostrarMensaje({ tipo: 'Error', texto: 'No se pudieron cargar los miembros CE, intentelo nuevamente' })
            console.error(error)
        }
    }

    useEffect(() => { cargarMiembrosCE() }, [])

    const handleChangeMiembroCE = (e) => {
        const { name, value } = e.target
        setMiembroCEFormulario(prev => ({ ...prev, [name]: value }))
    }

    const handleCancelarFormulario = () => {
        setMostrarFormulario(false)
        setMiembroCEFormulario(MIEMBRO_CE_INICIAL)
    }

    const handleSubmitFormulario = async (e) => {
        e.preventDefault()

        if (!miembroCEFormulario.nombre.trim() || !miembroCEFormulario.apellidoPaterno.trim() || !miembroCEFormulario.apellidoMaterno.trim() || !miembroCEFormulario.correo.trim()) {
            mostrarMensaje({ tipo: 'Informar', texto: 'Por favor, completa todos los campos' })
            return
        }

        if (!validarEmail(miembroCEFormulario.correo)) {
            mostrarMensaje({ tipo: 'Informar', texto: 'Por favor, ingresa un correo electrónico válido' })
            return
        }

        try {
            if (miembroCEFormulario.id) {
                await actualizarMiembroCE(miembroCEFormulario.id, miembroCEFormulario)
            } else {
                await registrarMiembroCE(miembroCEFormulario)
            }
            handleCancelarFormulario()
            mostrarMensaje({ tipo: 'Exito', texto: 'Miembro CE guardado exitosamente' })
            await cargarMiembrosCE()
        } catch (error) {
            mostrarMensaje({ tipo: 'Error', texto: 'Error al guardar el miembro CE, intente nuevamente' })
            console.error(error)
        }
    }

    const handleEditarMiembroCE = (miembroCE) => {
        setMostrarFormulario(true)
        setMiembroCEFormulario(miembroCE)
    }

    const handleEliminarMiembroCE = async (miembroCE) => {
        const confirmar = await confirmarAccion('¿Estás seguro de que deseas eliminar este miembro CE?')
        if (!confirmar) return

        try {
            await eliminarMiembroCE(miembroCE.id)
            mostrarMensaje({ tipo: 'Exito', texto: 'Miembro CE eliminado exitosamente' })
            await cargarMiembrosCE()
        } catch (error) {
            mostrarMensaje({ tipo: 'Error', texto: 'Error al eliminar el miembro CE, intente nuevamente' })
            console.error(error)
        }
    }

    return (
        <div className={styles.pagina}>
            <div className={styles.encabezado}>
                <h1 className={styles.titulo}>Miembros CE</h1>
                <button type="button" className={styles.botonNuevo} onClick={() => setMostrarFormulario(true)}>
                    Nuevo Miembro CE
                </button>
            </div>
            {mostrarFormulario && (
                <FormularioMiembroCE
                    miembroCE={miembroCEFormulario}
                    onChangeMiembroCE={handleChangeMiembroCE}
                    onSubmit={handleSubmitFormulario}
                    onCancelar={handleCancelarFormulario}
                />
            )}
            {miembrosCE.length > 0 ? (
                <ListaMiembrosCE
                    miembrosCE={miembrosCE}
                    botones={[
                        { texto: 'Editar', onClick: handleEditarMiembroCE },
                        { texto: 'Eliminar', onClick: handleEliminarMiembroCE }
                    ]}
                />
            ) : (
                <p className={styles.vacio}>No hay miembros CE registrados</p>
            )}
        </div>
    )
}

export default MiembrosCE
