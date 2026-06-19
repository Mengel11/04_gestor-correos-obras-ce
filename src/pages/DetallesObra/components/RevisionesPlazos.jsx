import { useState } from "react";
import { useRetroalimentacion } from '../../../context/Retroalimentacion';
import { actualizarObra } from '../../../services/obrasService';
import { fechaInputAFechaLimite } from '../../../utils/fechas';
import { marcarEtapaCompletada } from '../../../utils/obraUtils';

function RevisionesPlazos({ obra, indiceEtapa, refrescarObra, onCancelarEdicion }) {
    const [camposFormulario, setCamposFormulario] = useState({
        revisionesMinimas: obra.revisionesMinimas ?? '',
        fechaLimiteRevisiones: obra.fechaLimiteRevisiones?.toDate().toISOString().slice(0, 10) ?? '',
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

        if (!camposFormulario.revisionesMinimas || !camposFormulario.fechaLimiteRevisiones) {
            mostrarMensaje({ tipo: 'Error', texto: 'Por favor completa todos los campos' })
            return
        }

        const revisionesMinimas = Number(camposFormulario.revisionesMinimas)
        if (!Number.isInteger(revisionesMinimas) || revisionesMinimas < 1 || revisionesMinimas > obra.revisoresAsignados.length) {
            mostrarMensaje({ tipo: 'Error', texto: 'El número de revisiones debe ser un número entero positivo y menor al número de revisores asignados' })
            return
        }

        const fechaLimiteRevisoresTexto = obra.fechaLimiteRevisores.toDate().toISOString().slice(0, 10)
        if( camposFormulario.fechaLimiteRevisiones <= fechaLimiteRevisoresTexto ) {
            mostrarMensaje({ tipo: 'Error', texto: 'La fecha límite de revisiones debe ser mayor a la fecha límite de asignación de revisores' })
            return
        }

        const fechaLimiteRevisiones = fechaInputAFechaLimite(camposFormulario.fechaLimiteRevisiones)

        try {
            const nuevosDatos = {
                revisionesMinimas,
                fechaLimiteRevisiones,
                estado: 'Revisión en proceso',
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
        <div>
            <form onSubmit={handleClickGuardar}>
                <fieldset>
                    <legend>Establecer revisiones y plazos</legend>
                    <label>
                        Número mínimo de revisiones:
                        <input
                            type="number"
                            name="revisionesMinimas"
                            value={camposFormulario.revisionesMinimas}
                            onChange={handleChangeFormulario}
                        />
                    </label>
                    <label>
                        Fecha límite:
                        <input
                            type="date"
                            name="fechaLimiteRevisiones"
                            value={camposFormulario.fechaLimiteRevisiones}
                            onChange={handleChangeFormulario}
                        />
                    </label>
                </fieldset>
                <button type="button" onClick={onCancelarEdicion}>Cancelar</button>
                <button type="submit">Guardar</button>
            </form>
        </div>
    )
}

export default RevisionesPlazos;
