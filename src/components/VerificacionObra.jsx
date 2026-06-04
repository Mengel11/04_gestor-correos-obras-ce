import { useState } from 'react';
import { useRetroalimentacion } from '../context/Retroalimentacion';
import { actualizarObra } from '../services/obrasService';

function VerificacionObra({ obra }) {
    const [seleccion, setSeleccion] = useState(obra.clasificacionApta);
    const [modoEditar, setModoEditar] = useState(false);

    const mostrarMensaje = useRetroalimentacion();

    const handleGuardar = async () => {
        const nuevaObra = { ...obra, clasificacionApta: seleccion };
        try {
            await actualizarObra(obra.id, nuevaObra);
            mostrarMensaje({tipo: 'Exito', texto: 'Respuesta guardada exitosamente'})
            setModoEditar(false)
        } catch (error) {
            mostrarMensaje({tipo: 'Error', texto: 'No se pudo guardar la respuesta, intentelo nuevamente'})
            console.error(error)
        }
    }


    return (
        <div>
            <fieldset>
                <legend>
                    ¿La clasificación que asigno el autor es correcta?
                </legend>
                <label>
                    <input type="radio" name="verificacion" checked={seleccion === true} value={"si"} onChange={(e) => setSeleccion(e.target.value === "si")} disabled={ obra.clasificacionApta !== null && !modoEditar}/>
                    Sí
                </label>
                <label>
                    <input type="radio" name="verificacion" checked={seleccion === false} value={"no"} onChange={(e) => setSeleccion(e.target.value === "si")} disabled={ obra.clasificacionApta !== null && !modoEditar}/>
                    No
                </label>
            { obra.clasificacionApta === null && (
                <button onClick={handleGuardar}>Guardar</button>
            )}
            {( obra.clasificacionApta !== null && !modoEditar ) && (
                <button onClick={() => setModoEditar(true)}>Editar</button>
            )}
            {( obra.clasificacionApta !== null && modoEditar ) && (
                <>
                    <button onClick={handleGuardar}>Guardar</button>
                    <button onClick={() => setModoEditar(false)}>Cancelar</button>
                </>
            )}
            </fieldset>
        </div>
    )

}

export default VerificacionObra;