function FormularioRequisitos({ etiquetas, modoEdicion, camposFormulario, onChangeFormulario }) {
    return (
        <>
            <fieldset>
                <legend>Formulario</legend>
                <label>
                    {etiquetas.numerica}:
                    <input type="number" name="revisoresMinimos" value={camposFormulario.revisoresMinimos} onChange={onChangeFormulario} disabled={!modoEdicion} />
                </label>
                <label>
                    {etiquetas.fecha}:
                    <input type="date" lang="es-MX" name="fechaLimiteRevisores" value={camposFormulario.fechaLimiteRevisores} onChange={onChangeFormulario} disabled={!modoEdicion} />
                </label>
            </fieldset>
        </>
    )
}

export default FormularioRequisitos;