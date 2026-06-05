import ListaRevisores from './ListaRevisores';
import GraficaDona from './GraficaDona';
import Temporizador from './Temporizador';

function AsignarRevisores({ obra }) {
    const porcentajeRevisores = Math.round( obra.revisoresAsignados.length / obra.revisoresMinimos * 100 )
    
    return (
        <>
            <ListaRevisores revisores={[]}/>
            <GraficaDona porcentaje={porcentajeRevisores}/>
            <Temporizador fechaLimite={obra.fechaLimiteRevisores}/>
            <button>Comenzar siguiente etapa</button>
        </>
    )
}

export default AsignarRevisores;