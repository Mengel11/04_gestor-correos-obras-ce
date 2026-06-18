/* 
    Componente para que el usuario indique si la clasificación es apta o no y enviar la respuesta a Firestore.
*/

import { useState } from 'react';
import { useRetroalimentacion } from '../context/Retroalimentacion';
import { actualizarObra } from '../services/obrasService';

function VerificacionObra({
    obra,
    refrescarObra,
    onCancelarEdicion,
}) {
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
                etapasCompletadas: clasificacionApta ? [true, false, false, false, false, false] : [false, false, false, false, false, false]
            }
            await almacenarRespuestaEnFirestore(nuevosDatos)
            if(clasificacionApta) onCancelarEdicion();
            mostrarMensaje({tipo: 'Exito', texto: 'Clasificación registrada exitosamente'})
        } catch(error) {
            mostrarMensaje({tipo: 'Error', texto: 'No se pudo registrar la clasificación, intente nuevamente'})
            console.error(error)
        }
    }

    return (
        <div>
            <form onSubmit={handleClickGuardar}>
                <fieldset>
                    <legend>
                        ¿La clasificación que asigno el autor es correcta?
                    </legend>
                    <label>
                        <input type="radio" name="clasificacionApta" value="si" checked={clasificacionApta === true} onChange={handleChangeFormulario} />
                        Sí
                    </label>
                    <label>
                        <input type="radio" name="clasificacionApta" value="no" checked={clasificacionApta === false} onChange={handleChangeFormulario} />
                        No
                    </label>
                </fieldset>
                <button type='submit'>Guardar</button>
                <button type='button' onClick={onCancelarEdicion}>Cancelar</button>
            </form>
        </div>
    )

}

export default VerificacionObra;