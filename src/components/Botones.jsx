function Botones({ existeRespuesta, modoEdicion, onGuardar, onCancelar }) {

    return (
        <>
            {!existeRespuesta ? (
                <button onClick={onGuardar}>Guardar</button>
            ) : ( modoEdicion ? (
                <>
                    <button onClick={onGuardar}>Guardar</button>
                    <button onClick={onCancelar}>Cancelar</button>
                </>
                ) : (
                <button onClick={() => setModoEdicion(true)}>Editar</button>
            ))}
        </>
    )
}

export default Botones;