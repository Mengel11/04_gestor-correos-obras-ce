import TarjetaMiembroCE from './TarjetaMiembroCE'
import { IconoEditar, IconoEliminar } from '../../../components/Iconos'
import styles from '../styles/ListaMiembrosCE.module.css'

function ListaMiembrosCE({ miembrosCE, botones }) {
    return (
        <div className={styles.grid}>
            {miembrosCE.map(miembroCE => (
                <div key={miembroCE.id} className={styles.item}>
                    <TarjetaMiembroCE miembroCE={miembroCE} />
                    {botones.length > 0 && (
                        <div className={styles.acciones}>
                            {botones.map((boton, index) => {
                                const etiqueta = typeof boton.texto === 'function' ? boton.texto(miembroCE) : boton.texto
                                const esIcono = etiqueta === 'Editar' || etiqueta === 'Eliminar'
                                const claseBoton = etiqueta === 'Eliminar' ? styles.botonEliminar : styles.boton
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        className={esIcono ? `${claseBoton} ${styles.botonIcono}` : claseBoton}
                                        onClick={() => boton.onClick(miembroCE)}
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
                    )}
                </div>
            ))}
        </div>
    )
}

export default ListaMiembrosCE
