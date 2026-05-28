function FormularioAutor({ autor, onChangeAutor, onSubmit, onCancelar }) {
    return (
        <form onSubmit={onSubmit}>
            <label>
                Nombre(s):
                <input type="text" name="nombre" value={autor.nombre} onChange={onChangeAutor} />
            </label>
            <label>
                Apellido Paterno:
                <input type="text" name="apellidoPaterno" value={autor.apellidoPaterno} onChange={onChangeAutor} />
            </label>
            <label>
                Apellido Materno:
                <input type="text" name="apellidoMaterno" value={autor.apellidoMaterno} onChange={onChangeAutor} />
            </label>
            <label>
                Correo Electrónico:
                <input type="email" name="correo" value={autor.correo} onChange={onChangeAutor} />
            </label>
            <button type="submit">Guardar</button>
            <button type="button" onClick={onCancelar}>Cancelar</button>
        </form>
    )
}

export default FormularioAutor;