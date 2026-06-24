import { useState } from 'react';
import { useRetroalimentacion } from '../../../context/Retroalimentacion';
import { actualizarObra } from '../../../services/obrasService';
import { marcarEtapaCompletada } from '../../../utils/obraUtils';
import styles from '../styles/DetallesObra.module.css'

function DecisionFinal({ obra, indiceEtapa, refrescarObra, onCancelarEdicion }) {
    const [decisionFinal, setDecisionFinal] = useState(obra.decisionFinal ?? '');
    const mostrarMensaje = useRetroalimentacion();

    const almacenarRespuestaEnFirestore = async (nuevosDatos) => {
        const nuevaObra = {
            ...obra,
            ...nuevosDatos,
        }
        await actualizarObra(obra.id, nuevaObra)
        await refrescarObra()
    }

    const handleChangeFormulario = (event) => {
        setDecisionFinal(event.target.value)
    }

    const handleClickGuardar = async (event) => {
        event.preventDefault()

        if (!decisionFinal) {
            mostrarMensaje({ tipo: 'Error', texto: 'Por favor seleccione una opción' })
            return
        }

        try {
            const nuevosDatos = {
                decisionFinal,
                estado: 'Decisión final registrada',
                etapasCompletadas: marcarEtapaCompletada(obra.etapasCompletadas, indiceEtapa, true)
            }
            await almacenarRespuestaEnFirestore(nuevosDatos)
            mostrarMensaje({ tipo: 'Exito', texto: 'Decisión final registrada exitosamente' })
        } catch (error) {
            mostrarMensaje({ tipo: 'Error', texto: 'No se pudo registrar la decisión final, intente nuevamente' })
            console.error(error)
        }
    }

    return (
        <form className={styles.formularioFase} onSubmit={handleClickGuardar}>
            <fieldset className={styles.panelCampos}>
                <label>
                    Decisión final:
                    <select
                        name="decisionFinal"
                        value={decisionFinal}
                        onChange={handleChangeFormulario}
                    >
                        <option value="" disabled>Seleccione una opción</option>
                        <option value="Aprobar obra">Aprobar obra</option>
                        <option value="Rechazar obra">Rechazar obra</option>
                        <option value="Solicitar modificaciones">Solicitar modificaciones</option>
                    </select>
                </label>
            </fieldset>
            <div className={styles.accionesFormulario}>
                <button type="submit">Guardar</button>
                <button type="button" onClick={onCancelarEdicion}>Cancelar</button>
            </div>
        </form>
    )
}

export default DecisionFinal;
