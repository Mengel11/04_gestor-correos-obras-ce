import { useState } from "react";
import { useRetroalimentacion } from '../context/Retroalimentacion';
import { actualizarObra } from '../services/obrasService';
import FormularioRequisitos from "./FormularioRequisitos";
import Botones from "./Botones";

function RevisoresPlazos({ obra, refrescarObra }){
    const etiquetas = {numerica: "Número mínimo de revisores", fecha:"Fecha límite"}
    const camposCompletados = obra.revisoresMinimos !== null && obra.fechaLimiteRevisores !== null
    const [camposFormulario, setCamposFormulario] = useState({revisoresMinimos: obra.revisoresMinimos ?? '', fechaLimiteRevisores: obra.fechaLimiteRevisores ?? ''})
    const [modoEdicion, setModoEdicion] = useState(obra.estado === 'Establecer revisores y plazos' && !camposCompletados)
    const mostrarMensaje = useRetroalimentacion();

    const handleChangeFormulario = (e) => {
        const { name, value } = e.target
        setCamposFormulario(prev => (
            {...prev, 
            [name]: value}
        ))
    }

    const handleClickGuardar = async () => {
        const revisoresRaw = camposFormulario.revisoresMinimos
        const fechaRaw = camposFormulario.fechaLimiteRevisores

        // Validaciones
        if (!revisoresRaw.trim() || !fechaRaw.trim()) {
            mostrarMensaje({ tipo: 'Error', texto: 'Por favor completa todos los campos' })
            return
        }

        const revisoresMinimos = Number(revisoresRaw)
        if (!Number.isInteger(revisoresMinimos)) {
            mostrarMensaje({ tipo: 'Error', texto: 'El número de revisores debe ser un número entero' })
            return
        }

        const fechaLimiteRevisores = new Date(fechaRaw)
        if (isNaN(fechaLimiteRevisores.getTime())) {
            mostrarMensaje({ tipo: 'Error', texto: 'La fecha no es válida' })
            return
        }
        try {
            const nuevaObra = {
                ...obra, 
                revisoresMinimos,
                fechaLimiteRevisores, 
                estado: 'Asignación de revisores'
            }
            await actualizarObra(obra.id, nuevaObra)
            refrescarObra()
            mostrarMensaje({tipo: 'Exito', texto: 'Datos registrados exitosamente'})
            setModoEdicion(false)
        } catch(error) {
            mostrarMensaje({tipo: 'Error', texto: 'No se pudieron registrar los datos, intente nuevamente'})
            console.error(error)
        }
    }

    const handleClickCancelar = () => {
        setCamposFormulario({revisoresMinimos: obra.revisoresMinimos ?? '', fechaLimiteRevisores: obra.fechaLimiteRevisores ?? ''})
        setModoEdicion(false)
    }

    return (
        <>
            <FormularioRequisitos 
                etiquetas={etiquetas}
                modoEdicion={modoEdicion}
                camposFormulario={camposFormulario}
                onChangeFormulario={handleChangeFormulario}
            />
            <Botones 
                modoEdicion={modoEdicion}
                existeRespuesta={camposCompletados}
                onGuardar={handleClickGuardar}
                onCancelar={handleClickCancelar}
                onEditar={() => setModoEdicion(true)}
            />
        </>
    )
}

export default RevisoresPlazos;