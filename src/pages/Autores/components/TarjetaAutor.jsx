function TarjetaAutor({ autor }) {
    return (
        <div>
            <h3>{autor.nombre} {autor.apellidoPaterno} {autor.apellidoMaterno}</h3>
            <p>{autor.correo}</p>
        </div>
    )
}

export default TarjetaAutor;