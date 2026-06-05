import ListaRevisores from './ListaRevisores';
import GraficaDona from './GraficaDona';
import Temporizador from './Temporizador';

function Revision({ obra }) {
    const numeroRevisiones = obra.revisoresAsignados.filter(revisor => revisor.fechaRespuesta !== null).length
    const porcentajeRevisiones = Math.round( numeroRevisiones / obra.revisoresAsignados.length * 100)

    return (
        <>
            <ListaRevisores revisores={[]}/>
            <GraficaDona porcentaje={porcentajeRevisiones}/>
            <Temporizador fechaLimite={obra.fechaLimiteRevisiones}/>
            <button>Comenzar siguiente etapa</button>
        </>
    )
}

export default Revision;