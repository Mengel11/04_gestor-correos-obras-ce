import { createContext, useContext, useState } from 'react'
import styles from './Retroalimentacion.module.css'

const RetroalimentacionContext = createContext();

const CLASES_TIPO = {
    Error: styles.error,
    Exito: styles.exito,
    Advertencia: styles.advertencia,
    Informar: styles.informar,
}

function obtenerClaseTipo(tipo) {
    return CLASES_TIPO[tipo] ?? styles.informar
}

function RetroalimentacionProvider({ children }) {
    const [mensaje, setMensaje] = useState(null);

    const mostrarMensaje = (nuevoMensaje) => {
        setMensaje(nuevoMensaje)
        setTimeout(() => { setMensaje(null) }, nuevoMensaje.duracion || 3000)
    };

    return (
        <RetroalimentacionContext.Provider value={mostrarMensaje}>
            {mensaje && (
                <div
                    className={`${styles.toast} ${obtenerClaseTipo(mensaje.tipo)}`}
                    role={mensaje.tipo === 'Error' ? 'alert' : 'status'}
                    aria-live={mensaje.tipo === 'Error' ? 'assertive' : 'polite'}
                >
                    <p className={styles.tipo}>{mensaje.tipo}</p>
                    <p className={styles.texto}>{mensaje.texto}</p>
                </div>
            )}
            {children}
        </RetroalimentacionContext.Provider>
    )
}

export default RetroalimentacionProvider;
export const useRetroalimentacion = () => useContext(RetroalimentacionContext);
