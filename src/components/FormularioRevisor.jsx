function FormularioRevisor({ revisor, onChangeRevisor, onSubmit, onCancelar }) {
    return (
        <form onSubmit={onSubmit}>
            <label>
                Nombre(s):
                <input type="text" name="nombre" value={revisor.nombre} onChange={onChangeRevisor} />
            </label>
            <label>
                Apellido Paterno:
                <input type="text" name="apellidoPaterno" value={revisor.apellidoPaterno} onChange={onChangeRevisor} />
            </label>
            <label>
                Apellido Materno:
                <input type="text" name="apellidoMaterno" value={revisor.apellidoMaterno} onChange={onChangeRevisor} />
            </label>
            <label>
                Correo Electrónico:
                <input type="email" name="correo" value={revisor.correo} onChange={onChangeRevisor} />
            </label>
            <button type="submit">Guardar</button>
            <button type="button" onClick={onCancelar}>Cancelar</button>
        </form>
    )
}

export default FormularioRevisor;