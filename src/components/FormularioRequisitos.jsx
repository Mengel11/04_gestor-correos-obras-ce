function FormularioRequisitos({ etiquetas }) {
    return (
        <>
            <fieldset>
                <legend>Formulario</legend>
                <label>
                    {etiquetas.numerica}:
                    <input type="number"/>
                </label>
                <label>
                    {etiquetas.fecha}:
                    <input type="date"/>
                </label>
            </fieldset>
        </>
    )
}

export default FormularioRequisitos;