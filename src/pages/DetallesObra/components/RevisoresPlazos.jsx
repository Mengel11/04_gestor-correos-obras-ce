import { useState } from "react";
import { useRetroalimentacion } from '../../../context/Retroalimentacion';
import { actualizarObra } from '../../../services/obrasService';
import { fechaInputAFechaLimite } from '../../../utils/fechas';
import { marcarEtapaCompletada } from '../../../utils/obraUtils';
import styles from '../styles/DetallesObra.module.css'

function RevisoresPlazos({ obra, indiceEtapa, refrescarObra, onCancelarEdicion }) {
    const [camposFormulario, setCamposFormulario] = useState({
        revisoresMinimos: obra.revisoresMinimos ?? '',
        fechaLimiteRevisores: obra.fechaLimiteRevisores?.toDate().toISOString().slice(0, 10) ?? '',
    })
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
        const { name, value } = event.target
        setCamposFormulario(prev => ({ ...prev, [name]: value }))
    }

    const handleClickGuardar = async (event) => {
        event.preventDefault()

        if (!camposFormulario.revisoresMinimos || !camposFormulario.fechaLimiteRevisores) {
            mostrarMensaje({ tipo: 'Error', texto: 'Por favor completa todos los campos' })
            return
        }

        const revisoresMinimos = Number(camposFormulario.revisoresMinimos)
        if (!Number.isInteger(revisoresMinimos) || revisoresMinimos < 1) {
            mostrarMensaje({ tipo: 'Error', texto: 'El número de revisores debe ser un número entero positivo' })
            return
        }

        const fechaLimiteRevisores = fechaInputAFechaLimite(camposFormulario.fechaLimiteRevisores)

        try {
            const nuevosDatos = {
                revisoresMinimos,
                fechaLimiteRevisores,
                estado: 'Asignación de revisores',
                etapasCompletadas: marcarEtapaCompletada(obra.etapasCompletadas, indiceEtapa, true)
            }
            await almacenarRespuestaEnFirestore(nuevosDatos)
            mostrarMensaje({ tipo: 'Exito', texto: 'Datos registrados exitosamente' })
        } catch (error) {
            mostrarMensaje({ tipo: 'Error', texto: 'No se pudieron registrar los datos, intente nuevamente' })
            console.error(error)
        }
    }

    return (
        <form className={styles.formularioFase} onSubmit={handleClickGuardar}>
            <fieldset className={styles.panelCampos}>
                <label>
                    Número mínimo de revisores:
                    <input
                        type="number"
                        name="revisoresMinimos"
                        value={camposFormulario.revisoresMinimos}
                        onChange={handleChangeFormulario}
                    />
                </label>
                <label>
                    Fecha límite para asignar revisores:
                    <input
                        type="date"
                        name="fechaLimiteRevisores"
                        value={camposFormulario.fechaLimiteRevisores}
                        onChange={handleChangeFormulario}
                    />
                </label>
            </fieldset>
            <div className={styles.accionesFormulario}>
                <button type="submit">Guardar</button>
                <button type="button" onClick={onCancelarEdicion}>Cancelar</button>
            </div>
        </form>
    )
}

export default RevisoresPlazos;
