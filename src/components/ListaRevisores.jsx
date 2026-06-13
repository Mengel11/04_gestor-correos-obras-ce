import TarjetaRevisor from './TarjetaRevisor'

function ListaRevisores({ revisores, botones }) {
  return (
    <>
      {revisores.map(revisor => (
        <div key={revisor.id}>
          <TarjetaRevisor revisor={revisor} />
          {botones.map((boton, index) => {
            const etiqueta = typeof boton.texto === 'function' ? boton.texto(revisor) : boton.texto;
            return (
              <button key={index} onClick={() => boton.onClick(revisor)} type="button">
                {etiqueta}
              </button>
          )})}
        </div>
      ))}
    </>
  )
}

export default ListaRevisores;