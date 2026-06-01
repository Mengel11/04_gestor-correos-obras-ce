import { createContext, useContext, useState } from 'react'

const RetroalimentacionContext = createContext();

function RetroalimentacionProvider({ children }) {
    const [mensaje, setMensaje] = useState(null);

    const mostrarMensaje = (nuevoMensaje) => {
        setMensaje(nuevoMensaje)
        setTimeout(() => { setMensaje(null) }, nuevoMensaje.duracion || 3000)
    };

    return (
        <RetroalimentacionContext.Provider value={mostrarMensaje}>
            {children}
            {mensaje && (
                <div>
                    <h3>{mensaje.tipo}</h3>
                    <p>{mensaje.texto}</p>
                </div>
            )}
        </RetroalimentacionContext.Provider>
    )
}

export default RetroalimentacionProvider;
export const useRetroalimentacion = () => useContext(RetroalimentacionContext);