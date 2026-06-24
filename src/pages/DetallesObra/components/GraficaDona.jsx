import styles from '../styles/GraficaDona.module.css'

function GraficaDona({ porcentaje, compacta = false }) {
    if (!Number.isFinite(porcentaje)) return null

    const porcentajeMostrado = Math.round(porcentaje)
    const porcentajeDona = Math.min(Math.max(porcentajeMostrado, 0), 100)

    return (
        <div className={`${styles.contenedor} ${compacta ? styles.compacta : ''}`}>
            <div
                className={styles.dona}
                style={{ '--porcentaje': porcentajeDona }}
                role="img"
                aria-label={`Avance del ${porcentajeMostrado}%`}
            >
                <span className={styles.centro}>
                    <strong>{porcentajeMostrado}%</strong>
                    {!compacta && <span>avance</span>}
                </span>
            </div>
        </div>
    )
}

export default GraficaDona
