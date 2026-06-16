import { useState, useEffect } from 'react';
import { useRetroalimentacion } from '../context/Retroalimentacion';
import { useConfirmar } from '../context/Confirmar'
import { obtenerRevisores } from '../services/revisoresService';
import { actualizarObra } from '../services/obrasService';
import ListaRevisores from './ListaRevisores';
import GraficaDona from './GraficaDona';
import Temporizador from './Temporizador';

function AsignarRevisores({ obra, refrescarObra }) {
    const [revisores, setRevisores] = useState([])
    const mostrarMensaje = useRetroalimentacion()
    const confirmarAccion = useConfirmar()
    const porcentajeRevisores = Math.round( obra.revisoresAsignados.length / obra.revisoresMinimos * 100 )

    const revisorEstaAsignado = (revisorId) =>
        obra.revisoresAsignados.some(revisorAsignado => revisorAsignado.id === revisorId)

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

    const handleClickRevisor = async (revisor) => {
        const revisorRepetido = revisorEstaAsignado(revisor.id)
        const confirmar = await confirmarAccion(`¿Esta seguro de que desea ${revisorRepetido ? 'quitar' : 'añadir'} a este revisor? 
            Esto enviara un correo a todo el consejo informando que se ha ${revisorRepetido ? 'quitado' : 'añadido'} un revisor a la obra`
        )
        if( !confirmar ) return

        try {
            const revisoresAsignados = revisorRepetido 
                ? obra.revisoresAsignados.filter(revisorAsignado => revisorAsignado.id !== revisor.id)
                : [...obra.revisoresAsignados, { id: revisor.id, revisionCompletada: false }]
            await actualizarObra(obra.id, {...obra, revisoresAsignados})
            mostrarMensaje({tipo: 'Exito', texto: `El revisor se ha ${revisorRepetido ? 'quitado' : 'añadido'} correctamente a la obra`, duracion: 5000})
            refrescarObra()
        } catch(error){
            mostrarMensaje({tipo: 'Error', texto: `No se pudo ${revisorRepetido ? 'quitar' : 'añadir'} el revisor, intente nuevamente`, duracion: 5000})
            console.error(error)
        }
        
    }
    
    return (
        <>
            <ListaRevisores 
                revisores={revisores} 
                botones={[
                    {texto: (revisor) => revisorEstaAsignado(revisor.id) ? 'Quitar' : 'Añadir', onClick: handleClickRevisor}
                ]}
            />
            <GraficaDona porcentaje={porcentajeRevisores}/>
            <Temporizador fechaLimite={obra.fechaLimiteRevisores}/>
            {/* <button>Comenzar siguiente etapa</button> */}
        </>
    )
}

export default AsignarRevisores;