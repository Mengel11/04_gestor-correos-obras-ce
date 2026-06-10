import { useState } from 'react';
import { useRetroalimentacion } from '../context/Retroalimentacion';
import { actualizarObra } from '../services/obrasService';

function VerificacionObra({ obra, refrescarObra }) {
    const existeRespuesta = obra.clasificacionApta !== null;
    const [verificacion, setVerificacion] = useState(obra.clasificacionApta);
    const [modoEdicion, setModoEdicion] = useState(!existeRespuesta);
    const mostrarMensaje = useRetroalimentacion();

    const handleClickGuardar = async () => {
        try {
            await actualizarObra(obra.id, {...obra, clasificacionApta: verificacion})
            refrescarObra()
            mostrarMensaje({tipo: 'Exito', texto: 'Clasificación registrada exitosamente'})
            setModoEdicion(false)
        } catch(error) {
            mostrarMensaje({tipo: 'Error', texto: 'No se pudo registrar la clasificación, intente nuevamente'})
            console.error(error)
        }
    }

    const handleClickCancelar = () => {
        setVerificacion(obra.clasificacionApta)
        setModoEdicion(false)
    }

    return (
        <div>
            <fieldset>
                <legend>
                    ¿La clasificación que asigno el autor es correcta?
                </legend>
                <label>
                    <input type="radio" name="verificacion" value="si" checked={verificacion === true} onChange={(e) => setVerificacion(e.target.value === 'si')} disabled={!modoEdicion} />
                    Sí
                </label>
                <label>
                    <input type="radio" name="verificacion" value="no" checked={verificacion === false} onChange={(e) => setVerificacion(e.target.value === 'si')} disabled={!modoEdicion} />
                    No
                </label>
            </fieldset>
            {!existeRespuesta ? (
                <button onClick={handleClickGuardar}>Guardar</button>
            ) : ( modoEdicion ? (
                <>
                    <button onClick={handleClickGuardar}>Guardar</button>
                    <button onClick={handleClickCancelar}>Cancelar</button>
                </>
                ) : (
                <button onClick={() => setModoEdicion(true)}>Editar</button>
            ))}
        </div>
    )

}

export default VerificacionObra;