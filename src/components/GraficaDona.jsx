function GraficaDona({ porcentaje }) {
    return (
        <>
        { !Number.isNaN(porcentaje) && (
           <h3>{porcentaje}%</h3>
        )}
        </>
    )
}

export default GraficaDona;