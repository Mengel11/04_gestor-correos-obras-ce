import { useState, useEffect } from 'react';
import { useRetroalimentacion } from '../context/Retroalimentacion';
import { obtenerRevisor } from '../services/revisoresService';
import { actualizarObra } from '../services/obrasService';
import ListaRevisores from './ListaRevisores';
import GraficaDona from './GraficaDona';
import Temporizador from './Temporizador';

function Revision({ obra, refrescarObra }) {
    const [revisores, setRevisores] = useState([])
    const mostrarMensaje = useRetroalimentacion()
    const numeroRevisiones = obra.revisoresAsignados.filter(revisor => revisor.revisionCompletada).length
    const porcentajeRevisiones = Math.round(numeroRevisiones / obra.revisionesMinimas * 100)

    const obtenerRevisorAsignado = (revisorId) =>
        obra.revisoresAsignados.find(revisorAsignado => revisorAsignado.id === revisorId)

    useEffect(() => {
        const cargarRevisores = async () => {
            try {
                const revisores = obra.revisoresAsignados.map(revisorAsignado => obtenerRevisor(revisorAsignado.id))
                const revisoresObtenidos = await Promise.all(revisores)
                setRevisores(revisoresObtenidos)
            } catch (error) {
                mostrarMensaje({ tipo: 'Error', texto: 'No se pudieron cargar los revisores, intentelo nuevamente' })
                console.error(error)
            }
        }
        cargarRevisores()
    }, [obra.revisoresAsignados])

    const handleClickRevisor = async (revisor) => {
        try {
            const revisoresAsignados = obra.revisoresAsignados.map(revisorAsignado =>
                revisorAsignado.id === revisor.id
                    ? { ...revisorAsignado, revisionCompletada: !revisorAsignado.revisionCompletada }
                    : revisorAsignado
            )
            await actualizarObra(obra.id, { ...obra, revisoresAsignados })
            refrescarObra()
            mostrarMensaje({ tipo: 'Exito', texto: 'Estado de la revisión actualizado correctamente', duracion: 5000 })
        } catch (error) {
            mostrarMensaje({ tipo: 'Error', texto: 'No se pudo actualizar el estado de la revisión, intente nuevamente', duracion: 5000 })
            console.error(error)
        }
    }

    return (
        <>
            <ListaRevisores
                revisores={revisores}
                botones={[
                    {
                        texto: (revisor) => obtenerRevisorAsignado(revisor.id)?.revisionCompletada ? 'Marcar pendiente' : 'Marcar completada',
                        onClick: handleClickRevisor
                    }
                ]}
            />
            <GraficaDona porcentaje={porcentajeRevisiones} />
            <Temporizador fechaLimite={obra.fechaLimiteRevisiones} />
            <button>Comenzar a tomar la decisión final</button>
        </>
    )
}

export default Revision;
