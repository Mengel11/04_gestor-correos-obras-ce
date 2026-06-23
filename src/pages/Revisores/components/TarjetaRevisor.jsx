import styles from '../styles/TarjetaRevisor.module.css'

function IconoRevisor() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
        </svg>
    )
}

function TarjetaRevisor({ revisor, variante = 'normal' }) {
    return (
        <article className={`${styles.tarjeta} ${styles[variante]}`}>
            <div className={styles.avatar}>
                <IconoRevisor />
            </div>
            <div className={styles.info}>
                <h3 className={styles.nombre}>
                    {revisor.nombre} {revisor.apellidoPaterno} {revisor.apellidoMaterno}
                </h3>
                <p className={styles.correo}>{revisor.correo}</p>
            </div>
        </article>
    )
}

export default TarjetaRevisor
