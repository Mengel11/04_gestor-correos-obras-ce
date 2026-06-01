import { createContext, useState, useContext } from 'react'

const ConfirmarContext = createContext()

function ConfirmarProvider({ children }) {
    const [confirmarEstado, setConfirmarEstado] = useState({mostrar: false, mensaje: '', resolverPromesa: null})

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
                <div>
                    <div>
                        <p>{confirmarEstado.mensaje}</p>
                        <button onClick={handleConfirmar}>Confirmar</button>
                        <button onClick={handleCancelar}>Cancelar</button>
                    </div>
                </div>
            )}
        </ConfirmarContext.Provider>
    )
}

export default ConfirmarProvider;
export const useConfirmar = () => useContext(ConfirmarContext);