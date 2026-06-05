import Botones from "./Botones";

function DecisionFinal({ obra }) {
    return (
        <div>
            <fieldset>
                <legend>
                    Toma de decision
                </legend>
                <label>
                    Decisión final:
                    <select>
                        <option>Seleccione una opción</option>
                        <option>Aprobar obra</option>
                        <option>Rechazar obra</option>
                        <option>Solicitar modificaciones</option>
                    </select>
                </label>
            </fieldset>
            <Botones existeRespuesta={obra.decisionFinal !== null} />
        </div>
    )
}

export default DecisionFinal;