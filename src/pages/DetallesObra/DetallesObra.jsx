import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useRetroalimentacion } from '../../context/Retroalimentacion';
import { obtenerObra, actualizarObra } from '../../services/obrasService';
import { obtenerEtapasCompletadas } from '../../utils/obraUtils';
import TarjetaObra from './components/TarjetaObra';
import FormularioObra from '../Obras/components/FormularioObra';
import VerificacionObra from './components/VerificacionObra';
import RevisoresPlazos from './components/RevisoresPlazos';
import AsignarRevisores from './components/AsignarRevisores';
import RevisionesPlazos from './components/RevisionesPlazos';
import Revision from './components/Revision';
import DecisionFinal from './components/DecisionFinal';
import styles from './styles/DetallesObra.module.css'

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
    const [transicionEtapa, setTransicionEtapa] = useState(null);
    const [botonEnPulso, setBotonEnPulso] = useState(null);
    const botonesEtapaRef = useRef([]);
    const etapasCompletadasPrevRef = useRef(null);
    const transicionTimeoutRef = useRef(null);
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
        if (botonEnPulso === index) {
            setBotonEnPulso(null)
        }
        setEtapasEnEdicion(prev => prev.map((valor, i) => i === index ? true : valor))
    }

    const cancelarEdicionEtapa = (index) => {
        setEtapasEnEdicion(prev => prev.map((valor, i) => i === index ? false : valor))
    }

    useEffect(() => {
        if (!obra) return

        const actuales = obtenerEtapasCompletadas(obra)
        const previas = etapasCompletadasPrevRef.current
        etapasCompletadasPrevRef.current = actuales

        if (previas === null) return

        const indiceCompletado = actuales.findIndex((valor, i) => valor && !previas[i])
        if (indiceCompletado === -1) return

        const siguienteIndice = indiceCompletado + 1
        if (siguienteIndice >= ETAPAS_OBRA.length) return

        if (transicionTimeoutRef.current) {
            window.clearTimeout(transicionTimeoutRef.current)
        }

        const preferReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const tiempoCierre = preferReducedMotion ? 0 : 550
        const tiempoPalomita = preferReducedMotion ? 0 : 750

        setTransicionEtapa({ indiceCompletado, siguienteIndice, fase: 'cerrando' })

        transicionTimeoutRef.current = window.setTimeout(() => {
            cancelarEdicionEtapa(indiceCompletado)
            setTransicionEtapa({ indiceCompletado, siguienteIndice, fase: 'palomita' })

            transicionTimeoutRef.current = window.setTimeout(() => {
                setBotonEnPulso(siguienteIndice)
                setTransicionEtapa(null)

                requestAnimationFrame(() => {
                    const boton = botonesEtapaRef.current[siguienteIndice]
                    if (boton) {
                        boton.scrollIntoView({
                            behavior: preferReducedMotion ? 'instant' : 'smooth',
                            block: 'center',
                        })
                        boton.focus({ preventScroll: true })
                    }
                })
            }, tiempoPalomita)
        }, tiempoCierre)
    }, [obra?.etapasCompletadas])

    useEffect(() => {
        return () => {
            if (transicionTimeoutRef.current) {
                window.clearTimeout(transicionTimeoutRef.current)
            }
        }
    }, [])

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
                <div className={styles.pagina}>
                    <TarjetaObra obra={obra} onEditar={() => setEditarObra(true)} />
                    {ETAPAS_OBRA.map((etapa, index) => {
                        const EtapaComponente = etapa.componente
                        const enEdicion = etapasEnEdicion[index]
                        const puedeEditar = index === 0 || etapasCompletadas.filter((_,i) => i < index).every(valor => valor)
                        const etapaCompletada = etapasCompletadas[index]
                        const claseEtapa = [
                            styles.etapa,
                            etapaCompletada ? styles.etapaCompletada : puedeEditar ? styles.etapaDisponible : styles.etapaBloqueada,
                            enEdicion ? styles.etapaEnEdicion : '',
                            transicionEtapa?.indiceCompletado === index && transicionEtapa.fase === 'cerrando' ? styles.etapaCerrando : '',
                            transicionEtapa?.indiceCompletado === index && transicionEtapa.fase === 'palomita' ? styles.etapaPalomitaLenta : '',
                        ].join(' ')

                        return (
                            <section key={etapa.nombre} className={claseEtapa}>
                                <h2 className={styles.tituloEtapa}>{etapa.nombre}</h2>
                                {( puedeEditar && enEdicion ) ? (
                                    <div className={styles.contenidoEtapa}>
                                        <EtapaComponente
                                            obra={obra}
                                            indiceEtapa={index}
                                            refrescarObra={cargarObra}
                                            onCancelarEdicion={() => cancelarEdicionEtapa(index)}
                                        />
                                    </div>
                                ) : (
                                    <div className={styles.pieEtapa}>
                                        <button
                                            ref={(el) => { botonesEtapaRef.current[index] = el }}
                                            className={[
                                                styles.botonEtapa,
                                                botonEnPulso === index ? styles.botonPulso : '',
                                            ].join(' ')}
                                            disabled={!puedeEditar}
                                            onClick={() => activarEdicionEtapa(index)}
                                            type="button"
                                        >Editar</button>
                                    </div>
                                )}
                            </section>
                        )
                    })}
                </div>
            )}
        </>
    )
}

export default DetallesObra;