function Botones({ existeRespuesta }) {

    return (
        <>
            {!existeRespuesta ? (
                <button>Guardar</button>
            ) : (
                <>
                    <button>Editar</button>
                    <button>Guardar</button>
                    <button>Cancelar</button>
                </>
            )}
        </>
    )
}

export default Botones;