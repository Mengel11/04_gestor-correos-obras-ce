import { useState, useEffect } from 'react';
import { useRetroalimentacion } from '../context/Retroalimentacion';
import { useParams } from 'react-router-dom';
import { obtenerObra, registrarObra, actualizarObra } from '../services/obrasService';
import TarjetaObra from '../components/TarjetaObra';
import FormularioObra from '../components/FormularioObra';
import VerificacionObra from '../components/VerificacionObra';
import RevisoresPlazos from '../components/RevisoresPlazos';
import AsignarRevisores from '../components/AsignarRevisores';
import RevisionesPlazos from '../components/RevisionesPlazos'
import Revision from '../components/Revision';
import DecisionFinal from '../components/DecisionFinal';

function DetallesObra() {
    const [obra, setObra] = useState(null);
    const [editarObra, setEditarObra] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const mostrarMensaje = useRetroalimentacion();
    const { obraId } = useParams();

    const cargarObra = async () => {
        try {
            setCargando(true);
            const obraObtenida = await obtenerObra(obraId)
            setObra(obraObtenida)
        } catch (error) {
            mostrarMensaje({tipo: 'Error', texto: 'No se pudo cargar la obra, intentelo nuevamente'})
            console.error(error)
            setError('No se pudo cargar la obra, intentelo nuevamente')
        } finally {
            setCargando(false)
        }

    }

    useEffect(() => { cargarObra() }, [])

    const handleCancelarFormulario = () => {
        setEditarObra(false)
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
            cargarObra()
            handleCancelarFormulario()
            mostrarMensaje({tipo: 'Exito', texto: 'Obra guardada exitosamente'})
        } catch (error) {
            mostrarMensaje({tipo: 'Error', texto: 'Error al guardar la obra'})
        }
    }

    return (
        <>  
            {editarObra && (
                <FormularioObra
                    obraAEditar={obra}
                    onGuardar={handleSubmitFormulario}
                    onCancelar={handleCancelarFormulario}
                />
            )}
            {obra && (
                <>
                    <TarjetaObra obra={obra} onEditar={() => setEditarObra(true)} />
                    <VerificacionObra obra={obra} refrescarObra={cargarObra} />
                    <RevisoresPlazos obra={obra} refrescarObra={cargarObra} />
                    <AsignarRevisores obra={obra} refrescarObra={cargarObra} />
                    <RevisionesPlazos obra={obra} refrescarObra={cargarObra} />
                    {/* <Revision obra={obra} />
                    <DecisionFinal obra={obra} /> */}
                </>
            )}
            {cargando && (
                <h2>Cargando obra...</h2>
            )}
            {error && (
                <h2>{error}</h2>
            )}
        </>
    )
}

export default DetallesObra;