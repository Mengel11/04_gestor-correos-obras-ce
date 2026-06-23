import { useEffect } from 'react'
import styles from '../styles/FormularioRevisor.module.css'

function FormularioRevisor({ revisor, onChangeRevisor, onSubmit, onCancelar }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])

    return (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="titulo-formulario-revisor">
            <div className={styles.modal}>
                <h2 id="titulo-formulario-revisor" className={styles.titulo}>
                    {revisor.id ? 'Editar revisor' : 'Nuevo revisor'}
                </h2>
                <form onSubmit={onSubmit} className={styles.formulario}>
                    <label className={styles.campo}>
                        Nombre(s)
                        <input
                            type="text"
                            name="nombre"
                            className={styles.input}
                            value={revisor.nombre}
                            onChange={onChangeRevisor}
                        />
                    </label>
                    <label className={styles.campo}>
                        Apellido paterno
                        <input
                            type="text"
                            name="apellidoPaterno"
                            className={styles.input}
                            value={revisor.apellidoPaterno}
                            onChange={onChangeRevisor}
                        />
                    </label>
                    <label className={styles.campo}>
                        Apellido materno
                        <input
                            type="text"
                            name="apellidoMaterno"
                            className={styles.input}
                            value={revisor.apellidoMaterno}
                            onChange={onChangeRevisor}
                        />
                    </label>
                    <label className={styles.campo}>
                        Correo electrónico
                        <input
                            type="email"
                            name="correo"
                            className={styles.input}
                            value={revisor.correo}
                            onChange={onChangeRevisor}
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

export default FormularioRevisor
