import { useState } from "react";
import { useRetroalimentacion } from '../context/Retroalimentacion';
import { actualizarObra } from '../services/obrasService';
import { fechaInputAFechaLimite } from '../utils/fechas';
import FormularioRequisitos from "./FormularioRequisitos";
import Botones from "./Botones";

function RevisionesPlazos({ obra, refrescarObra }) {
    const [camposFormulario, setCamposFormulario] = useState([
        {tipo: 'number', nombre: 'revisionesMinimas', etiqueta: "Número mínimo de revisiones", valor: obra.revisionesMinimas ?? ''},
        {tipo: 'date', nombre: 'fechaLimiteRevisiones', etiqueta: "Fecha límite", valor: obra.fechaLimiteRevisiones?.toDate().toISOString().slice(0,10) ?? ''}
    ])
    const camposCompletados = obra.revisionesMinimas !== null && obra.fechaLimiteRevisiones !== null
    const [modoEdicion, setModoEdicion] = useState(obra.estado === 'Establecer revisiones y plazos' && !camposCompletados)
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
        const revisionesMinimasValor = camposFormulario.find(c => c.nombre === 'revisionesMinimas')?.valor
        const fechaLimiteValor = camposFormulario.find(c => c.nombre === 'fechaLimiteRevisiones')?.valor

        // Validar que los campos no esten vacios
        if (!revisionesMinimasValor || !fechaLimiteValor) {
            mostrarMensaje({ tipo: 'Error', texto: 'Por favor completa todos los campos' })
            return
        }

        // Validar que sea un numero entero
        const revisionesMinimas = Number(revisionesMinimasValor)
        if (!Number.isInteger(revisionesMinimas)) {
            mostrarMensaje({ tipo: 'Error', texto: 'El número de revisiones debe ser un número entero' })
            return
        }
        
        const fechaLimiteRevisiones = fechaInputAFechaLimite(fechaLimiteValor)
    
        try {
            const nuevaObra = {
                ...obra, 
                revisionesMinimas,
                fechaLimiteRevisiones, 
                estado: 'Revisión en proceso'
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
            {tipo: 'number', nombre: 'revisionesMinimas', etiqueta: "Número mínimo de revisiones", valor: obra.revisionesMinimas ?? ''},
            {tipo: 'date', nombre: 'fechaLimiteRevisiones', etiqueta: "Fecha límite", valor: obra.fechaLimiteRevisiones?.toDate().toISOString().slice(0,10) ?? ''}
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

export default RevisionesPlazos;
