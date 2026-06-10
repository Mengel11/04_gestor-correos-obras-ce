function Botones({ modoEdicion, existeRespuesta, onGuardar, onCancelar, onEditar }) {
    return (
        <>
            { modoEdicion ? (
                <>
                    <button onClick={onGuardar}>Guardar</button>
                    {existeRespuesta && <button onClick={onCancelar}>Cancelar</button>}
                </>
            ) : (
                <button onClick={onEditar}>Editar</button>
            )}
        </>
    )
}

export default Botones;