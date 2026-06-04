import { useState, useEffect } from 'react'
import { useRetroalimentacion } from '../context/Retroalimentacion'
import { useParams } from 'react-router-dom';
import { obtenerObra } from '../services/obrasService';
import TarjetaObra from '../components/TarjetaObra';
import VerificacionObra from '../components/VerificacionObra';

function DetallesObra() {
    const [obra, setObra] = useState(null);
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

    return (
        <>  
            {obra && (
                <>
                    <TarjetaObra obra={obra} />
                    <VerificacionObra obra={obra} />
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