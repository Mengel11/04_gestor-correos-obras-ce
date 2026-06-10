import { useState } from 'react';
import { useRetroalimentacion } from '../context/Retroalimentacion';
import { actualizarObra } from '../services/obrasService';
import Botones from './Botones';

function VerificacionObra({ obra, refrescarObra }) {
    const existeRespuesta = obra.clasificacionApta !== null;
    const [verificacion, setVerificacion] = useState(obra.clasificacionApta);
    const [modoEdicion, setModoEdicion] = useState(!existeRespuesta);
    const mostrarMensaje = useRetroalimentacion();

    const handleClickGuardar = async () => {
        try {
            const nuevaObra = {
                ...obra, 
                clasificacionApta: verificacion, 
                estado: verificacion ? 'Establecer revisores y plazos' : 'En espera a reclasificación del autor'
            }
            await actualizarObra(obra.id, nuevaObra)
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

export default VerificacionObra;