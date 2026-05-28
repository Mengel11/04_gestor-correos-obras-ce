import TarjetaRevisor from './TarjetaRevisor'

function ListaRevisores({ revisores, onEditar, onEliminar }) {
  return (
    <>
      {revisores.map(revisor => (
        <div key={revisor.id}>
          <TarjetaRevisor revisor={revisor} />
          <button onClick={() => onEditar(revisor)}>Editar</button>
          <button onClick={() => onEliminar(revisor.id)}>Eliminar</button>
        </div>
      ))}
    </>
  )
}

export default ListaRevisores;