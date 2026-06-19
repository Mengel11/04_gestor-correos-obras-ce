import { useState, useEffect } from 'react';
import { useRetroalimentacion } from '../context/Retroalimentacion';
import { useConfirmar } from '../context/Confirmar'
import { obtenerRevisor } from '../services/revisoresService';
import { actualizarObra } from '../services/obrasService';
import { marcarEtapaCompletada } from '../utils/obraUtils';
import ListaRevisores from './ListaRevisores';
import GraficaDona from './GraficaDona';
import Temporizador from './Temporizador';

function Revision({ obra, indiceEtapa, refrescarObra, onCancelarEdicion }) {
    const [revisores, setRevisores] = useState([])
    const mostrarMensaje = useRetroalimentacion()
    const confirmarAccion = useConfirmar()

    const cargarRevisores = async () => {
        try {
            const revisoresPromesas = obra.revisoresAsignados.map(revisorAsignado => obtenerRevisor(revisorAsignado.id))
            const revisoresObtenidos = await Promise.all(revisoresPromesas)
            setRevisores(revisoresObtenidos)
        } catch (error) {
            mostrarMensaje({ tipo: 'Error', texto: 'No se pudieron cargar los revisores, intentelo nuevamente' })
            console.error(error)
        }
    }

    useEffect(() => { cargarRevisores() }, [obra.revisoresAsignados])

    const numeroRevisiones = obra.revisoresAsignados.filter(revisor => revisor.revisionCompletada).length
    const porcentajeRevisiones = Math.round(numeroRevisiones / obra.revisionesMinimas * 100)
    const etapaCompletada = obra.etapasCompletadas[indiceEtapa]
    const revisionEstaCompletada = (revisorId) => obra.revisoresAsignados.find(revisorAsignado => revisorAsignado.id === revisorId)?.revisionCompletada

    const almacenarRespuestaEnFirestore = async (nuevosDatos) => {
        const nuevaObra = {
            ...obra,
            ...nuevosDatos,
        }
        await actualizarObra(obra.id, nuevaObra)
        await refrescarObra()
    }

    const handleClickRevisor = async (revisor) => {
        const revisionRegistrada = revisionEstaCompletada(revisor.id)
        const confirmar = await confirmarAccion(`¿Esta seguro de que desea ${revisionRegistrada ? 'marcar como pendiente' : 'registrar'} la revisión de este revisor? Esto enviara un correo de notificación a todo el consejo`)
        if (!confirmar) return

        const revisoresAsignados = obra.revisoresAsignados.map(revisorAsignado =>
            revisorAsignado.id === revisor.id
                ? { ...revisorAsignado, revisionCompletada: !revisorAsignado.revisionCompletada }
                : revisorAsignado
        )

        const numeroRevisiones = revisoresAsignados.filter(revisor => revisor.revisionCompletada).length
        const seVuelveEtapaCompletada = numeroRevisiones >= obra.revisionesMinimas
        const estado = seVuelveEtapaCompletada ? 'Toma de decisión final' : 'Revisión en proceso'

        try {
            const nuevosDatos = {
                revisoresAsignados,
                estado,
                etapasCompletadas: marcarEtapaCompletada(obra.etapasCompletadas, indiceEtapa, seVuelveEtapaCompletada)
            }
            await almacenarRespuestaEnFirestore(nuevosDatos)
            mostrarMensaje({ tipo: 'Exito', texto: `La revisión se ha ${revisionRegistrada ? 'marcado como pendiente' : 'registrado'} correctamente` })
        } catch (error) {
            mostrarMensaje({ tipo: 'Error', texto: `No se pudo ${revisionRegistrada ? 'marcar como pendiente' : 'registrar'} la revisión, intente nuevamente` })
            console.error(error)
        }
    }

    const handleClickSiguiente = async () => {
        const confirmar = await confirmarAccion('¿Estás seguro de que deseas comenzar a tomar la decisión final? Esto enviara un correo de notificación a todo el consejo')
        if (!confirmar) return

        try {
            const nuevosDatos = {
                estado: 'Toma de decisión final',
                etapasCompletadas: marcarEtapaCompletada(obra.etapasCompletadas, indiceEtapa, true)
            }
            await almacenarRespuestaEnFirestore(nuevosDatos)
        } catch (error) {
            mostrarMensaje({ tipo: 'Error', texto: 'No se pudo comenzar a tomar la decisión final, intente nuevamente' })
            console.error(error)
        }
    }

    return (
        <>
            <ListaRevisores
                revisores={revisores}
                botones={[
                    { texto: (revisor) => revisionEstaCompletada(revisor.id) ? 'Marcar pendiente' : 'Marcar completada', onClick: handleClickRevisor }
                ]}
            />
            <GraficaDona porcentaje={porcentajeRevisiones} />
            <Temporizador fechaLimite={obra.fechaLimiteRevisiones} />
            {numeroRevisiones > 0 && !etapaCompletada && (
                <button onClick={handleClickSiguiente}>
                    Comenzar a tomar la decisión final
                </button>
            )}
            <button onClick={onCancelarEdicion}>Cancelar</button>
        </>
    )
}

export default Revision;
