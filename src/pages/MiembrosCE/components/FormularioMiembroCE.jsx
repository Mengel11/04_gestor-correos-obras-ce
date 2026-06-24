import { useEffect } from 'react'
import styles from '../styles/FormularioMiembroCE.module.css'

function FormularioMiembroCE({ miembroCE, onChangeMiembroCE, onSubmit, onCancelar }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])

    return (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="titulo-formulario-miembro-ce">
            <div className={styles.modal}>
                <h2 id="titulo-formulario-miembro-ce" className={styles.titulo}>
                    {miembroCE.id ? 'Editar miembro CE' : 'Nuevo miembro CE'}
                </h2>
                <form onSubmit={onSubmit} className={styles.formulario}>
                    <label className={styles.campo}>
                        Nombre(s)
                        <input
                            type="text"
                            name="nombre"
                            className={styles.input}
                            value={miembroCE.nombre}
                            onChange={onChangeMiembroCE}
                        />
                    </label>
                    <label className={styles.campo}>
                        Apellido paterno
                        <input
                            type="text"
                            name="apellidoPaterno"
                            className={styles.input}
                            value={miembroCE.apellidoPaterno}
                            onChange={onChangeMiembroCE}
                        />
                    </label>
                    <label className={styles.campo}>
                        Apellido materno
                        <input
                            type="text"
                            name="apellidoMaterno"
                            className={styles.input}
                            value={miembroCE.apellidoMaterno}
                            onChange={onChangeMiembroCE}
                        />
                    </label>
                    <label className={styles.campo}>
                        Correo electrónico
                        <input
                            type="email"
                            name="correo"
                            className={styles.input}
                            value={miembroCE.correo}
                            onChange={onChangeMiembroCE}
                        />
                    </label>
                    <div className={styles.botones}>
                        <button type="button" className={styles.botonCancelar} onClick={onCancelar}>
                            Cancelar
                        </button>
                        <button type="submit" className={styles.botonGuardar}>
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FormularioMiembroCE
