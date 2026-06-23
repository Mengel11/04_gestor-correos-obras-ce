import { useEffect } from 'react'
import styles from '../styles/FormularioAutor.module.css'

function FormularioAutor({ autor, onChangeAutor, onSubmit, onCancelar }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])

    return (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="titulo-formulario-autor">
            <div className={styles.modal}>
                <h2 id="titulo-formulario-autor" className={styles.titulo}>
                    {autor.id ? 'Editar autor' : 'Nuevo autor'}
                </h2>
                <form onSubmit={onSubmit} className={styles.formulario}>
                    <label className={styles.campo}>
                        Nombre(s)
                        <input
                            type="text"
                            name="nombre"
                            className={styles.input}
                            value={autor.nombre}
                            onChange={onChangeAutor}
                        />
                    </label>
                    <label className={styles.campo}>
                        Apellido paterno
                        <input
                            type="text"
                            name="apellidoPaterno"
                            className={styles.input}
                            value={autor.apellidoPaterno}
                            onChange={onChangeAutor}
                        />
                    </label>
                    <label className={styles.campo}>
                        Apellido materno
                        <input
                            type="text"
                            name="apellidoMaterno"
                            className={styles.input}
                            value={autor.apellidoMaterno}
                            onChange={onChangeAutor}
                        />
                    </label>
                    <label className={styles.campo}>
                        Correo electrónico
                        <input
                            type="email"
                            name="correo"
                            className={styles.input}
                            value={autor.correo}
                            onChange={onChangeAutor}
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

export default FormularioAutor
