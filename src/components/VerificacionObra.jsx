import Botones from './Botones'

function VerificacionObra({ obra }) {

    return (
        <div>
            <fieldset>
                <legend>
                    ¿La clasificación que asigno el autor es correcta?
                </legend>
                <label>
                    <input type="radio" name="verificacion" value="si" />
                    Sí
                </label>
                <label>
                    <input type="radio" name="verificacion" value="no" />
                    No
                </label>
            </fieldset>
            <Botones existeRespuesta={obra.clasificacionApta !== null} />
        </div>
    )

}

export default VerificacionObra;