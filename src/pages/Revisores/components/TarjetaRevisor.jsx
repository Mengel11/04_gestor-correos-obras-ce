function TarjetaRevisor({ revisor }) {
    return (
        <div>
            <h3>{revisor.nombre} {revisor.apellidoPaterno} {revisor.apellidoMaterno}</h3>
            <p>{revisor.correo}</p>
        </div>
    )
}

export default TarjetaRevisor;