import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRetroalimentacion } from '../context/Retroalimentacion';
import { obtenerObra, actualizarObra } from '../services/obrasService';
import { obtenerEtapasCompletadas } from '../utils/obraUtils';
import TarjetaObra from '../components/TarjetaObra';
import FormularioObra from '../components/FormularioObra';
import VerificacionObra from '../components/VerificacionObra';
import RevisoresPlazos from '../components/RevisoresPlazos';
import AsignarRevisores from '../components/AsignarRevisores';
import RevisionesPlazos from '../components/RevisionesPlazos';
import Revision from '../components/Revision';
import DecisionFinal from '../components/DecisionFinal';

const ETAPAS_OBRA = [
    { nombre: 'Verificación de la clasificación', componente: VerificacionObra },
    { nombre: 'Establecer revisores y plazos', componente: RevisoresPlazos },
    { nombre: 'Asignación de revisores', componente: AsignarRevisores },
    { nombre: 'Establecer revisiones y plazos', componente: RevisionesPlazos },
    { nombre: 'Revisión en proceso', componente: Revision },
    { nombre: 'Toma de decisión final', componente: DecisionFinal },
];

function DetallesObra() {
    const [obra, setObra] = useState(null);
    const [editarObra, setEditarObra] = useState(false);
    const [etapasEnEdicion, setEtapasEnEdicion] = useState(Array(ETAPAS_OBRA.length).fill(false));
    const mostrarMensaje = useRetroalimentacion();
    const { obraId } = useParams();

    const cargarObra = async () => {
        try {
            const obraObtenida = await obtenerObra(obraId)
            setObra(obraObtenida)
        } catch (error) {
            mostrarMensaje({tipo: 'Error', texto: 'No se pudo cargar la obra, intentelo nuevamente'})
            console.error(error)
        }

    }
    useEffect(() => { cargarObra() }, [])

    const etapasCompletadas = obtenerEtapasCompletadas(obra)
    
    const handleCancelarFormulario = () => {
        setEditarObra(false)
    }

    const handleSubmitFormulario = async (e, obraFormulario) => {
        e.preventDefault()

        if(!obraFormulario.titulo.trim() || !obraFormulario.clasificacion || obraFormulario.autores.length === 0) {
            mostrarMensaje({tipo: 'Error', texto: 'Por favor, completa todos los campos'})
            return
        }

        try {
            await actualizarObra(obraFormulario.id, obraFormulario)
            cargarObra()
            handleCancelarFormulario()
            mostrarMensaje({tipo: 'Exito', texto: 'Obra guardada exitosamente'})
        } catch (error) {
            mostrarMensaje({tipo: 'Error', texto: 'Error al guardar la obra'})
        }
    }

    const activarEdicionEtapa = (index) => {
        setEtapasEnEdicion(prev => prev.map((valor, i) => i === index ? true : valor))
    }

    const cancelarEdicionEtapa = (index) => {
        setEtapasEnEdicion(prev => prev.map((valor, i) => i === index ? false : valor))
    }

    return (
        <>  
            {editarObra && (
                <FormularioObra
                    obraAEditar={obra}
                    onGuardar={handleSubmitFormulario}
                    onCancelar={handleCancelarFormulario}
                />
            )}
            {obra && (
                <>
                    <TarjetaObra obra={obra} onEditar={() => setEditarObra(true)} />
                    {ETAPAS_OBRA.map((etapa, index) => {
                        const EtapaComponente = etapa.componente
                        const enEdicion = etapasEnEdicion[index]
                        const puedeEditar = index === 0 || etapasCompletadas.filter((_,i) => i < index).every(valor => valor)

                        return (
                            <div key={etapa.nombre} className='etapa'>
                                <h2>{etapa.nombre}</h2>
                                {( puedeEditar && enEdicion ) ? (
                                    <EtapaComponente
                                        obra={obra}
                                        indiceEtapa={index}
                                        refrescarObra={cargarObra}
                                        onCancelarEdicion={() => cancelarEdicionEtapa(index)}
                                    />
                                ) : (
                                    <button 
                                        disabled={!puedeEditar} 
                                        onClick={() => activarEdicionEtapa(index)}
                                        type="button"
                                    >Editar</button>
                                )}
                            </div>
                        )
                    })}
                </>
            )}
        </>
    )
}

export default DetallesObra;