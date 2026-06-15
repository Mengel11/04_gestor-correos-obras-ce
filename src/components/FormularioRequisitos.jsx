function FormularioRequisitos({ camposFormulario, onChangeFormulario, modoEdicion }) {
    return (
        <>
            <fieldset>
                <legend>Formulario</legend>
                {camposFormulario.map((campo) => (
                    <label key={campo.nombre}>
                        {campo.etiqueta}:
                        <input type={campo.tipo} name={campo.nombre} value={campo.valor} onChange={onChangeFormulario} disabled={!modoEdicion} />
                    </label>
                ))}
            </fieldset>
        </>
    )
}

export default FormularioRequisitos;