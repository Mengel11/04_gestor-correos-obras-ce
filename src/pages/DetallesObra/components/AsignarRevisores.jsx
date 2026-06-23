import { useState, useEffect } from 'react';
import { useRetroalimentacion } from '../../../context/Retroalimentacion';
import { useConfirmar } from '../../../context/Confirmar'
import { obtenerRevisores } from '../../../services/revisoresService';
import { actualizarObra } from '../../../services/obrasService';
import { marcarEtapaCompletada } from '../../../utils/obraUtils';
import ListaRevisores from '../../Revisores/components/ListaRevisores';
import GraficaDona from './GraficaDona';
import Temporizador from './Temporizador';

function AsignarRevisores({ obra, indiceEtapa, refrescarObra, onCancelarEdicion }) {
    const [revisores, setRevisores] = useState([])
    const mostrarMensaje = useRetroalimentacion()
    const confirmarAccion = useConfirmar()

    const cargarRevisores = async () => {
        try {
            const revisoresObtenidos = await obtenerRevisores()
            setRevisores(revisoresObtenidos)
        } catch (error) {
            mostrarMensaje({tipo: 'Error', texto: 'No se pudieron cargar los revisores, intentelo nuevamente'})
            console.error(error)
        }
    }
    useEffect(() => { cargarRevisores() }, [])

    const porcentajeRevisores = Math.round( obra.revisoresAsignados.length / obra.revisoresMinimos * 100 )
    const etapaCompletada = obra.etapasCompletadas[indiceEtapa]
    const revisorEstaAsignado = (revisorId) => obra.revisoresAsignados.some(revisorAsignado => revisorAsignado.id === revisorId)

    const almacenarRespuestaEnFirestore = async (nuevosDatos) => {
        const nuevaObra = {
            ...obra,
            ...nuevosDatos,
        }
        await actualizarObra(obra.id, nuevaObra)
        await refrescarObra()
    }

    const handleClickRevisor = async (revisor) => {
        const revisorRepetido = revisorEstaAsignado(revisor.id)
        const confirmar = await confirmarAccion(`¿Esta seguro de que desea ${revisorRepetido ? 'quitar' : 'añadir'} a este revisor? 
            Esto enviara un correo a todo el consejo informando que se ha ${revisorRepetido ? 'quitado' : 'añadido'} un revisor a la obra`
        )
        if( !confirmar ) return

        const revisoresAsignados = revisorRepetido 
            ? obra.revisoresAsignados.filter(revisorAsignado => revisorAsignado.id !== revisor.id)
            : [...obra.revisoresAsignados, { id: revisor.id, revisionCompletada: false }]

        const seVuelveEtapaCompletada = revisoresAsignados.length >= obra.revisoresMinimos
        const estado = seVuelveEtapaCompletada ? 'Establecer revisiones y plazos' : 'Asignación de revisores'

        try {
            const nuevosDatos = {
                revisoresAsignados,
                estado,
                etapasCompletadas: marcarEtapaCompletada(obra.etapasCompletadas, indiceEtapa, seVuelveEtapaCompletada)
            }
            await almacenarRespuestaEnFirestore(nuevosDatos)
            mostrarMensaje({ tipo: 'Exito', texto: `El revisor se ha ${revisorRepetido ? 'quitado' : 'añadido'} correctamente a la obra` })
        } catch (error) {
            mostrarMensaje({ tipo: 'Error', texto: `No se pudo ${revisorRepetido ? 'quitar' : 'añadir'} el revisor, intente nuevamente` })
            console.error(error)
        }
    }

    const handleClickSiguiente = async () => {
        const confirmar = await confirmarAccion('¿Estás seguro de que deseas comenzar la siguiente etapa?')
        if (!confirmar) return

        try {
            const nuevosDatos = {
                estado: 'Establecer revisiones y plazos',
                etapasCompletadas: marcarEtapaCompletada(obra.etapasCompletadas, indiceEtapa, true)
            }
            await almacenarRespuestaEnFirestore(nuevosDatos)
        } catch (error) {
            mostrarMensaje({ tipo: 'Error', texto: 'No se pudo comenzar la siguiente etapa, intente nuevamente' })
            console.error(error)
        }
    }

    return (
        <>
            <ListaRevisores 
                revisores={revisores} 
                variante="compacta"
                botones={[
                    {texto: (revisor) => revisorEstaAsignado(revisor.id) ? 'Quitar' : 'Añadir', onClick: handleClickRevisor}
                ]}
            />
            <GraficaDona porcentaje={porcentajeRevisores}/>
            <Temporizador fechaLimite={obra.fechaLimiteRevisores}/>
            {obra.revisoresAsignados.length > 0 && !etapaCompletada && (
                <button onClick={handleClickSiguiente}>
                    Comenzar la siguiente etapa
                </button>
            )}
            <button onClick={onCancelarEdicion}>Cancelar</button>
        </>
    )
}

export default AsignarRevisores;
