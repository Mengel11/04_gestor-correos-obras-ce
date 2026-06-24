import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRetroalimentacion } from '../../../context/Retroalimentacion';
import { useConfirmar } from '../../../context/Confirmar'
import { obtenerRevisores } from '../../../services/revisoresService';
import { actualizarObra } from '../../../services/obrasService';
import { marcarEtapaCompletada } from '../../../utils/obraUtils';
import ListaRevisores from '../../Revisores/components/ListaRevisores';
import GraficaDona from './GraficaDona';
import Temporizador from './Temporizador';
import styles from '../styles/AsignarRevisores.module.css'

function AsignarRevisores({ obra, indiceEtapa, refrescarObra, onCancelarEdicion }) {
    const [revisores, setRevisores] = useState([])
    const mostrarMensaje = useRetroalimentacion()
    const confirmarAccion = useConfirmar()

    const cargarRevisores = async () => {
        try {
            const revisoresObtenidos = await obtenerRevisores()
            setRevisores(revisoresObtenidos)
        } catch (error) {
            mostrarMensaje({tipo: 'Error', texto: 'No se pudieron cargar los revisores, intentelo nuevamente'})
            console.error(error)
        }
    }
    useEffect(() => { cargarRevisores() }, [])

    const revisoresUnidos = obra.revisoresAsignados.length
    const revisoresPlaneados = obra.revisoresMinimos
    const porcentajeRevisores = revisoresPlaneados ? Math.round(revisoresUnidos / revisoresPlaneados * 100) : 0
    const etapaCompletada = obra.etapasCompletadas[indiceEtapa]
    const revisorEstaAsignado = (revisorId) => obra.revisoresAsignados.some(revisorAsignado => revisorAsignado.id === revisorId)

    const almacenarRespuestaEnFirestore = async (nuevosDatos) => {
        const nuevaObra = {
            ...obra,
            ...nuevosDatos,
        }
        await actualizarObra(obra.id, nuevaObra)
        await refrescarObra()
    }

    const handleClickRevisor = async (revisor) => {
        const revisorRepetido = revisorEstaAsignado(revisor.id)
        const confirmar = await confirmarAccion(`¿Esta seguro de que desea ${revisorRepetido ? 'quitar' : 'añadir'} a este revisor? 
            Esto enviara un correo a todo el consejo informando que se ha ${revisorRepetido ? 'quitado' : 'añadido'} un revisor a la obra`
        )
        if( !confirmar ) return

        const revisoresAsignados = revisorRepetido 
            ? obra.revisoresAsignados.filter(revisorAsignado => revisorAsignado.id !== revisor.id)
            : [...obra.revisoresAsignados, { id: revisor.id, revisionCompletada: false }]

        const seVuelveEtapaCompletada = revisoresAsignados.length >= obra.revisoresMinimos
        const estado = seVuelveEtapaCompletada ? 'Establecer revisiones y plazos' : 'Asignación de revisores'

        try {
            const nuevosDatos = {
                revisoresAsignados,
                estado,
                etapasCompletadas: marcarEtapaCompletada(obra.etapasCompletadas, indiceEtapa, seVuelveEtapaCompletada)
            }
            await almacenarRespuestaEnFirestore(nuevosDatos)
            mostrarMensaje({ tipo: 'Exito', texto: `El revisor se ha ${revisorRepetido ? 'quitado' : 'añadido'} correctamente a la obra` })
        } catch (error) {
            mostrarMensaje({ tipo: 'Error', texto: `No se pudo ${revisorRepetido ? 'quitar' : 'añadir'} el revisor, intente nuevamente` })
            console.error(error)
        }
    }

    const handleClickSiguiente = async () => {
        const confirmar = await confirmarAccion('¿Estás seguro de que deseas comenzar la siguiente etapa?')
        if (!confirmar) return

        try {
            const nuevosDatos = {
                estado: 'Establecer revisiones y plazos',
                etapasCompletadas: marcarEtapaCompletada(obra.etapasCompletadas, indiceEtapa, true)
            }
            await almacenarRespuestaEnFirestore(nuevosDatos)
        } catch (error) {
            mostrarMensaje({ tipo: 'Error', texto: 'No se pudo comenzar la siguiente etapa, intente nuevamente' })
            console.error(error)
        }
    }

    return (
        <div className={styles.panel}>
            <div className={styles.resumen}>
                <section className={styles.tarjetaProgreso} aria-label="Progreso de revisores unidos">
                    <GraficaDona porcentaje={porcentajeRevisores} compacta />
                    <div className={styles.detalleProgreso}>
                        <h3>Revisores unidos</h3>
                        <p>
                            {revisoresUnidos} de {revisoresPlaneados} revisores planeados se han unido a la obra.
                        </p>
                    </div>
                </section>
                <section className={styles.tarjetaReloj} aria-label="Tiempo restante para asignar revisores">
                    <Temporizador fechaLimite={obra.fechaLimiteRevisores} />
                </section>
            </div>
            <div className={styles.lista}>
                <div className={styles.encabezadoLista}>
                    <h3>Revisores disponibles</h3>
                    <span>{revisores.length} registrados</span>
                </div>
                <div className={styles.listaScroll}>
                    <ListaRevisores
                        revisores={revisores}
                        variante="detallesObra"
                        botones={[
                            {texto: (revisor) => revisorEstaAsignado(revisor.id) ? 'Quitar' : 'Añadir', onClick: handleClickRevisor}
                        ]}
                    />
                </div>
                <Link to="/revisores" className={styles.enlaceRegistrar}>
                    Registrar nuevo revisor
                </Link>
            </div>
            <div className={styles.acciones}>
                {obra.revisoresAsignados.length > 0 && !etapaCompletada && (
                    <button className={styles.botonPrimario} onClick={handleClickSiguiente}>
                        Comenzar la siguiente etapa
                    </button>
                )}
                <button onClick={onCancelarEdicion}>Cancelar</button>
            </div>
        </div>
    )
}

export default AsignarRevisores;
