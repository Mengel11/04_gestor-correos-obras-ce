import FilaObra from './FilaObra'
import styles from '../styles/TablaObras.module.css'

function TablaObras({ obras, botones }) {

    const filasObra = obras.map(obra => (
        <FilaObra 
            key={obra.id}
            obra={obra}
            botones={botones}
        />
    ))
    
    return (
        <div className={styles.contenedor}>
            <table className={styles.tabla}>
                <thead>
                    <tr>
                        <th className={styles.encabezadoCelda}>Obra</th>
                        <th className={styles.encabezadoCelda}>Clasificación</th>
                        <th className={styles.encabezadoCelda}>Fecha de Alta</th>
                        <th className={styles.encabezadoCelda}>Autores</th>
                        <th className={styles.encabezadoCelda}>Revisores</th>
                        <th className={styles.encabezadoCelda}>Porcentaje de Avance</th>
                    </tr>
                </thead>
                <tbody>
                    {filasObra}
                </tbody>
            </table>
        </div>
    )
}

export default TablaObras;
