import { useState } from "react";
import { useRetroalimentacion } from '../context/Retroalimentacion';
import { actualizarObra } from '../services/obrasService';
import FormularioRequisitos from "./FormularioRequisitos";
import Botones from "./Botones";

function RevisoresPlazos({ obra, refrescarObra }){
    const [camposFormulario, setCamposFormulario] = useState({revisoresMinimos: obra.revisoresMinimos ?? '', fechaLimiteRevisores: obra.fechaLimiteRevisores?.toDate().toISOString().slice(0,10) ?? ''})
    const camposCompletados = obra.revisoresMinimos !== null && obra.fechaLimiteRevisores !== null
    const [modoEdicion, setModoEdicion] = useState(obra.estado === 'Establecer revisores y plazos' && !camposCompletados)
    const mostrarMensaje = useRetroalimentacion();
    const etiquetas = {numerica: "Número mínimo de revisores", fecha:"Fecha límite"}

    const handleChangeFormulario = (e) => {
        const { name, value } = e.target
        setCamposFormulario(prev => (
            {...prev, 
            [name]: value}
        ))
    }

    const handleClickGuardar = async () => {
        // Validar que los campos no esten vacios
        if (!camposFormulario.revisoresMinimos || !camposFormulario.fechaLimiteRevisores) {
            mostrarMensaje({ tipo: 'Error', texto: 'Por favor completa todos los campos' })
            return
        }

        // Validar que sea un numero entero
        const revisoresMinimos = Number(camposFormulario.revisoresMinimos)
        if (!Number.isInteger(revisoresMinimos)) {
            mostrarMensaje({ tipo: 'Error', texto: 'El número de revisores debe ser un número entero' })
            return
        }
        
        const fechaLimiteRevisores = new Date(camposFormulario.fechaLimiteRevisores)
    
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