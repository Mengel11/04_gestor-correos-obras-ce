import { Link } from 'react-router-dom'
import { calcularPorcentajeAvance } from '../../../utils/obraUtils';
import { IconoEditar, IconoEliminar } from '../../../components/Iconos'
import styles from '../styles/FilaObra.module.css'

function FilaObra({ obra, botones }) {
    const porcentaje = calcularPorcentajeAvance(obra.estado)

    return (
        <tr className={styles.fila}>
            <td className={styles.celdaObra}>
                <div className={styles.tituloAcciones}>
                    <Link to={`/obras/${obra.id}`} className={styles.titulo}>{obra.titulo}</Link>
                    <div className={styles.acciones}>
                        {botones.map((boton, index) => {
                            const etiqueta = typeof boton.texto === 'function' ? boton.texto(obra) : boton.texto;
                            const esIcono = etiqueta === 'Editar' || etiqueta === 'Eliminar'
                            const claseBoton = etiqueta === 'Eliminar' ? styles.botonEliminar : styles.boton
                            return (
                                <button
                                    key={index}
                                    onClick={() => boton.onClick(obra)}
                                    type="button"
                                    className={esIcono ? `${claseBoton} ${styles.botonIcono}` : claseBoton}
                                    aria-label={esIcono ? etiqueta : undefined}
                                    title={esIcono ? etiqueta : undefined}
                                >
                                    {etiqueta === 'Editar' ? <IconoEditar />
                                        : etiqueta === 'Eliminar' ? <IconoEliminar />
                                        : etiqueta}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </td>
            <td className={styles.celdaClasificacion}>
                <span className={styles.clasificacion}>{obra.clasificacion}</span>
            </td>
            <td className={styles.celda}>{obra.fechaAlta.toDate().toLocaleString('es-MX')}</td>
            <td className={styles.celda}>{obra.autores.length}</td>
            <td className={styles.celda}>{obra.revisoresAsignados.length}</td>
            <td className={styles.celda}>
                <div className={styles.avance}>
                    <div className={styles.barra}>
                        <div className={styles.relleno} style={{ width: `${porcentaje}%` }} />
                    </div>
                    <span className={styles.porcentaje}>{porcentaje}%</span>
                </div>
            </td>
        </tr>
    )
}

export default FilaObra;
