/* 
    Componente para que el usuario indique si la clasificación es apta o no y enviar la respuesta a Firestore.
*/

import { useState } from 'react';
import { useRetroalimentacion } from '../context/Retroalimentacion';
import { actualizarObra } from '../services/obrasService';

function VerificacionObra({ obra, refrescarObra }) {
    const [clasificacionApta, setClasificacionApta] = useState(obra.clasificacionApta);
    const [modoEdicion, setModoEdicion] = useState(obra.clasificacionApta === null);
    const mostrarMensaje = useRetroalimentacion();

    const etapaCompletada = obra.clasificacionApta === true;

    const almacenarRespuestaEnFirestore = async (nuevosDatos) => {
        const nuevaObra = {
            ...obra,
            ...nuevosDatos
        }
        await actualizarObra(obra.id, nuevaObra)
        refrescarObra()
    }

    const handleChangeFormulario = (event) => {
        setClasificacionApta(event.target.value === 'si')
    }

    const handleClickGuardar = async (event) => {
        event.preventDefault()

        if (!clasificacionApta) {
            mostrarMensaje({tipo: 'Error', texto: 'Por favor seleccione una opción'})
            return
        }

        // Cuando llego aqui es porque el formulario tiene respuesta valida y esta listo para ser almacenado en Firestore.
        try {
            const nuevosDatos = {
                clasificacionApta,
                estado: clasificacionApta ? 'Establecer revisores y plazos' : 'En espera a reclasificación del autor'
            }
            await almacenarRespuestaEnFirestore(nuevosDatos)
            mostrarMensaje({tipo: 'Exito', texto: 'Clasificación registrada exitosamente'})
            setModoEdicion(false)
        } catch(error) {
            mostrarMensaje({tipo: 'Error', texto: 'No se pudo registrar la clasificación, intente nuevamente'})
            console.error(error)
        }
    }

    const handleClickCancelar = () => {
        setClasificacionApta(obra.clasificacionApta)
        setModoEdicion(false)
    }

    return (
        <div>
            { modoEdicion ? (
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
                    <button type='button' onClick={handleClickCancelar}>Cancelar</button>
                </form>
            ) : (
                <>
                    <h3>Verificación de la clasificación</h3>
                    {etapaCompletada && (
                        <button onClick={() => setModoEdicion(true)}>
                            Editar
                        </button>
                    )}
                </>
            )}
        </div>
    )

}

export default VerificacionObra;