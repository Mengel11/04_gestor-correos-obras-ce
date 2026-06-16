import { useState } from 'react';
import { useRetroalimentacion } from '../context/Retroalimentacion';
import { actualizarObra } from '../services/obrasService';
import Botones from './Botones';

function DecisionFinal({ obra, refrescarObra }) {
    const existeRespuesta = obra.decisionFinal !== null;
    const [decision, setDecision] = useState(obra.decisionFinal ?? '');
    const [modoEdicion, setModoEdicion] = useState(!existeRespuesta);
    const mostrarMensaje = useRetroalimentacion();

    const handleClickGuardar = async () => {
        if (!decision) {
            mostrarMensaje({ tipo: 'Error', texto: 'Por favor seleccione una opción' })
            return
        }

        try {
            const nuevaObra = {
                ...obra,
                decisionFinal: decision,
                estado: 'Decisión final registrada'
            }
            await actualizarObra(obra.id, nuevaObra)
            refrescarObra()
            mostrarMensaje({ tipo: 'Exito', texto: 'Decisión final registrada exitosamente' })
            setModoEdicion(false)
        } catch (error) {
            mostrarMensaje({ tipo: 'Error', texto: 'No se pudo registrar la decisión final, intente nuevamente' })
            console.error(error)
        }
    }

    const handleClickCancelar = () => {
        setDecision(obra.decisionFinal ?? '')
        setModoEdicion(false)
    }

    return (
        <div>
            <fieldset>
                <legend>
                    Toma de decisión
                </legend>
                <label>
                    Decisión final:
                    <select
                        value={decision}
                        onChange={(e) => setDecision(e.target.value)}
                        disabled={!modoEdicion}
                    >
                        <option value="" disabled>Seleccione una opción</option>
                        <option value="Aprobar obra">Aprobar obra</option>
                        <option value="Rechazar obra">Rechazar obra</option>
                        <option value="Solicitar modificaciones">Solicitar modificaciones</option>
                    </select>
                </label>
            </fieldset>
            <Botones
                modoEdicion={modoEdicion}
                existeRespuesta={existeRespuesta}
                onGuardar={handleClickGuardar}
                onCancelar={handleClickCancelar}
                onEditar={() => setModoEdicion(true)}
            />
        </div>
    )
}

export default DecisionFinal;
