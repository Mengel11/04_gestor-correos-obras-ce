import { useState, useEffect } from 'react'
import { useRetroalimentacion } from '../../../context/Retroalimentacion'
import { obtenerAutor } from '../../../services/autoresService';
import { calcularPorcentajeAvance } from '../../../utils/obraUtils';
import { IconoEditar } from '../../../components/Iconos';
import GraficaDona from './GraficaDona';
import styles from '../styles/TarjetaObra.module.css'

function nombreCompleto(autor) {
    return [autor.nombre, autor.apellidoPaterno, autor.apellidoMaterno]
        .join(' ')
}

function TarjetaObra({ obra, onEditar }) {
    const [autoresObra, setAutoresObra] = useState([]);

    const mostrarMensaje = useRetroalimentacion();

    useEffect(() => {
        const cargarAutoresObra = async () => {
            try {
                const autores = obra.autores.map(autorId => obtenerAutor(autorId))
                const autoresObtenidos = await Promise.all(autores)
                setAutoresObra(autoresObtenidos)
            } catch (error) {
                mostrarMensaje({tipo: 'Advertencia', texto: 'No se pudieron cargar los autores de la obra'})
            }
        }
        cargarAutoresObra()
    }, [])

    return (
        <article className={styles.tarjeta}>
            <div className={styles.zonaInfo}>
                <div className={styles.bloqueDatos}>
                    <div className={styles.fila}>
                        <span className={styles.etiqueta}>Título:</span>
                        <span className={styles.valorTitulo}>{obra.titulo}</span>
                    </div>
                    <div className={styles.fila}>
                        <span className={styles.etiqueta}>Clasificación:</span>
                        <span className={styles.clasificacion}>{obra.clasificacion}</span>
                    </div>
                    <div className={styles.filaAutores}>
                        <span className={styles.etiqueta}>Autores:</span>
                        <div className={styles.chipsAutores}>
                            {autoresObra.map(autor => (
                                <span key={autor.id} className={styles.chipAutor}>
                                    {nombreCompleto(autor)}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    className={styles.botonModificar}
                    onClick={onEditar}
                    aria-label="Modificar obra"
                    title="Modificar"
                >
                    <IconoEditar />
                </button>
            </div>

            <div className={styles.zonaEstado}>
                <span className={styles.etiquetaEstado}>Estado:</span>
                <strong className={styles.valorEstado}>{obra.estado}</strong>
            </div>

            <div className={styles.zonaDona}>
                <GraficaDona porcentaje={calcularPorcentajeAvance(obra.estado)} compacta />
            </div>
        </article>
    )
}

export default TarjetaObra;
