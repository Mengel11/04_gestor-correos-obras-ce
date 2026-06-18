import { useState, useEffect } from 'react';
import { useRetroalimentacion } from '../context/Retroalimentacion';
import { useConfirmar } from '../context/Confirmar'
import { obtenerRevisor } from '../services/revisoresService';
import { actualizarObra } from '../services/obrasService';
import ListaRevisores from './ListaRevisores';
import GraficaDona from './GraficaDona';
import Temporizador from './Temporizador';

function Revision({ obra, refrescarObra, onCancelarEdicion }) {
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
    const etapaCompletada = numeroRevisiones >= obra.revisionesMinimas || obra.botonesSiguientePresionados[1]
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

        const botonesSiguientePresionados = obra.botonesSiguientePresionados[1] ? [...obra.botonesSiguientePresionados.slice(0, 1), true] : obra.botonesSiguientePresionados

        const numeroRevisiones = revisoresAsignados.filter(revisor => revisor.revisionCompletada).length
        const porcentajeRevisiones = Math.round(numeroRevisiones / obra.revisionesMinimas * 100)
        const estado = porcentajeRevisiones === 100 ? 'Toma de decisión final' : obra.estado

        try {
            const nuevosDatos = {
                revisoresAsignados,
                botonesSiguientePresionados,
                estado
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

        const estado = 'Toma de decisión final'
        const botonesSiguientePresionados = [...obra.botonesSiguientePresionados.slice(0, 1), true]

        try {
            const nuevosDatos = {
                estado,
                botonesSiguientePresionados
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
