import styles from '../styles/TarjetaMiembroCE.module.css'

function IconoPerfil() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
    )
}

function TarjetaMiembroCE({ miembroCE }) {
    return (
        <article className={styles.tarjeta}>
            <div className={styles.avatar}>
                <IconoPerfil />
            </div>
            <div className={styles.info}>
                <h3 className={styles.nombre}>
                    {miembroCE.nombre} {miembroCE.apellidoPaterno} {miembroCE.apellidoMaterno}
                </h3>
                <p className={styles.correo}>{miembroCE.correo}</p>
            </div>
        </article>
    )
}

export default TarjetaMiembroCE
