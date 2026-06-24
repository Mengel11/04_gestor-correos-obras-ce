/* 
    Componente para que el usuario indique si la clasificación es apta o no y enviar la respuesta a Firestore.
*/

import { useState } from 'react';
import { useRetroalimentacion } from '../../../context/Retroalimentacion';
import { actualizarObra } from '../../../services/obrasService';
import { marcarEtapaCompletada } from '../../../utils/obraUtils';
import styles from '../styles/DetallesObra.module.css'

function VerificacionObra({ obra, indiceEtapa, refrescarObra, onCancelarEdicion, }) {
    const [clasificacionApta, setClasificacionApta] = useState(obra.clasificacionApta);
    const mostrarMensaje = useRetroalimentacion();

    const almacenarRespuestaEnFirestore = async (nuevosDatos) => {
        const nuevaObra = {
            ...obra,
            ...nuevosDatos
        }
        await actualizarObra(obra.id, nuevaObra)
        await refrescarObra()
    }

    const handleChangeFormulario = (event) => {
        setClasificacionApta(event.target.value === 'si')
    }

    const handleClickGuardar = async (event) => {
        event.preventDefault()

        if (clasificacionApta === null) {
            mostrarMensaje({tipo: 'Error', texto: 'Por favor seleccione una opción'})
            return
        }

        // Cuando llego aqui es porque el formulario tiene respuesta valida y esta listo para ser almacenado en Firestore.
        try {
            const nuevosDatos = {
                clasificacionApta,
                estado: clasificacionApta ? 'Establecer revisores y plazos' : 'En espera a reclasificación del autor',
                etapasCompletadas: marcarEtapaCompletada(obra.etapasCompletadas, indiceEtapa, clasificacionApta === true)
            }
            await almacenarRespuestaEnFirestore(nuevosDatos)
            mostrarMensaje({tipo: 'Exito', texto: 'Clasificación registrada exitosamente'})
        } catch(error) {
            mostrarMensaje({tipo: 'Error', texto: 'No se pudo registrar la clasificación, intente nuevamente'})
            console.error(error)
        }
    }

    return (
        <form className={styles.formularioFase} onSubmit={handleClickGuardar}>
            <fieldset className={styles.panelPregunta} aria-labelledby="pregunta-clasificacion">
                <p id="pregunta-clasificacion" className={styles.textoPregunta}>¿La clasificación que asigno el autor es correcta?</p>
                <div className={styles.opcionesLinea}>
                    <label>
                        <input type="radio" name="clasificacionApta" value="si" checked={clasificacionApta === true} onChange={handleChangeFormulario} />
                        Sí
                    </label>
                    <label>
                        <input type="radio" name="clasificacionApta" value="no" checked={clasificacionApta === false} onChange={handleChangeFormulario} />
                        No
                    </label>
                </div>
            </fieldset>
            <div className={styles.accionesFormulario}>
                <button type='submit'>Guardar</button>
                <button type='button' onClick={onCancelarEdicion}>Cancelar</button>
            </div>
        </form>
    )

}

export default VerificacionObra;