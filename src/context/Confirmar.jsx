import { createContext, useState, useContext, useEffect } from 'react'
import styles from './Confirmar.module.css'

const ConfirmarContext = createContext()

function ConfirmarProvider({ children }) {
    const [confirmarEstado, setConfirmarEstado] = useState({mostrar: false, mensaje: '', resolverPromesa: null})

    useEffect(() => {
        if (!confirmarEstado.mostrar) return

        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [confirmarEstado.mostrar])

    const confirmarAccion = (mensaje) => {
        return new Promise((resolve) => {
            setConfirmarEstado({mostrar: true, mensaje, resolverPromesa: resolve})
        })
    }

    const handleConfirmar = () => {
        if (confirmarEstado.resolverPromesa) {
            confirmarEstado.resolverPromesa(true)
        }
        setConfirmarEstado({mostrar: false, mensaje: '', resolverPromesa: null})
    }

    const handleCancelar = () => {
        if (confirmarEstado.resolverPromesa) {
            confirmarEstado.resolverPromesa(false)
        }
        setConfirmarEstado({mostrar: false, mensaje: '', resolverPromesa: null})
    }

    return (
        <ConfirmarContext.Provider value={confirmarAccion}>
            {children}
            {confirmarEstado.mostrar && (
                <div className={styles.overlay} role="dialog" aria-modal="true">
                    <div className={styles.modal}>
                        <p className={styles.mensaje}>{confirmarEstado.mensaje}</p>
                        <div className={styles.botones}>
                            <button type="button" className={styles.botonCancelar} onClick={handleCancelar}>
                                Cancelar
                            </button>
                            <button type="button" className={styles.botonConfirmar} onClick={handleConfirmar}>
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmarContext.Provider>
    )
}

export default ConfirmarProvider;
export const useConfirmar = () => useContext(ConfirmarContext);