import TarjetaAutor from './TarjetaAutor'

function ListaAutores({ autores, botones }) {
  return (
    <>
      {autores.map(autor => (
        <div key={autor.id}>
          <TarjetaAutor autor={autor} />
          {botones.map((boton, index) => {
            const etiqueta = typeof boton.texto === 'function' ? boton.texto(autor) : boton.texto;
            return (
              <button key={index} onClick={() => boton.onClick(autor)} type="button">
                {etiqueta}
              </button>
          )})}
        </div>
      ))}
    </>
  )
}

export default ListaAutores;