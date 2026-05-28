import TarjetaAutor from './TarjetaAutor'

function ListaAutores({ autores, onEditar, onEliminar }) {
  return (
    <>
      {autores.map(autor => (
        <div key={autor.id}>
          <TarjetaAutor autor={autor} />
          <button onClick={() => onEditar(autor)}>Editar</button>
          <button onClick={() => onEliminar(autor.id)}>Eliminar</button>
        </div>
      ))}
    </>
  )
}

export default ListaAutores;