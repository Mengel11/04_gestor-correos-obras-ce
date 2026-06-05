import Botones from "./Botones";
import FormularioRequisitos from "./FormularioRequisitos";

function RevisoresPlazos({ obra }){
    const etiquetas = {numerica: "Número mínimo de revisores", fecha:"Fecha límite"}
    const camposCompletados = obra.revisoresMinimos !== null && obra.fechaLimiteRevisores !== null

    return (
        <>
            <FormularioRequisitos etiquetas={etiquetas}/>
            <Botones existeRespuesta={camposCompletados}/>
        </>
    )
}

export default RevisoresPlazos;