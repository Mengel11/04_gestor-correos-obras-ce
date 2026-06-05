import FormularioRequisitos from "./FormularioRequisitos";
import Botones from "./Botones";

function RevisionesPlazos({ obra }) {
    const etiquetas = {numerica: "Número mínimo de revisiones", fecha: "Fecha límite"}
    const camposCompletados = obra.revisionesMinimas !== null && obra.fechaLimiteRevisiones !== null

    return (
        <>
            <FormularioRequisitos etiquetas={etiquetas}/>
            <Botones existeRespuesta={camposCompletados}/>
        </>
    )
}

export default RevisionesPlazos;