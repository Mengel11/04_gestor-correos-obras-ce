import { useState } from "react";
import { useRetroalimentacion } from '../context/Retroalimentacion';
import { actualizarObra } from '../services/obrasService';
import { fechaInputAFechaLimite } from '../utils/fechas';
import FormularioRequisitos from "./FormularioRequisitos";
import Botones from "./Botones";

function RevisoresPlazos({ obra, refrescarObra }){
    const [camposFormulario, setCamposFormulario] = useState([
        {tipo: 'number', nombre: 'revisoresMinimos', etiqueta: "Número mínimo de revisores", valor: obra.revisoresMinimos ?? ''},
        {tipo: 'date', nombre: 'fechaLimiteRevisores', etiqueta: "Fecha límite", valor: obra.fechaLimiteRevisores?.toDate().toISOString().slice(0,10) ?? ''}
    ])
    const camposCompletados = obra.revisoresMinimos !== null && obra.fechaLimiteRevisores !== null
    const [modoEdicion, setModoEdicion] = useState(obra.estado === 'Establecer revisores y plazos' && !camposCompletados)
    const mostrarMensaje = useRetroalimentacion();

    const handleChangeFormulario = (e) => {
        const { name, value } = e.target
        setCamposFormulario(prev =>
            prev.map(campo =>
                campo.nombre === name ? { ...campo, valor: value } : campo
            )
        )
    }

    const handleClickGuardar = async () => {
        const revisoresMinimosValor = camposFormulario.find(c => c.nombre === 'revisoresMinimos')?.valor
        const fechaLimiteValor = camposFormulario.find(c => c.nombre === 'fechaLimiteRevisores')?.valor

        // Validar que los campos no esten vacios
        if (!revisoresMinimosValor || !fechaLimiteValor) {
            mostrarMensaje({ tipo: 'Error', texto: 'Por favor completa todos los campos' })
            return
        }

        // Validar que sea un numero entero
        const revisoresMinimos = Number(revisoresMinimosValor)
        if (!Number.isInteger(revisoresMinimos)) {
            mostrarMensaje({ tipo: 'Error', texto: 'El número de revisores debe ser un número entero' })
            return
        }
        
        const fechaLimiteRevisores = fechaInputAFechaLimite(fechaLimiteValor)
    
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
        setCamposFormulario([
            {tipo: 'number', nombre: 'revisoresMinimos', etiqueta: "Número mínimo de revisores", valor: obra.revisoresMinimos ?? ''},
            {tipo: 'date', nombre: 'fechaLimiteRevisores', etiqueta: "Fecha límite", valor: obra.fechaLimiteRevisores?.toDate().toISOString().slice(0,10) ?? ''}
        ])
        setModoEdicion(false)
    }

    return (
        <>
            <FormularioRequisitos 
                camposFormulario={camposFormulario}
                onChangeFormulario={handleChangeFormulario}
                modoEdicion={modoEdicion}
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