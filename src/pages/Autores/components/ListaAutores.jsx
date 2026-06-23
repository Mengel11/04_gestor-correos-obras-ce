import TarjetaAutor from './TarjetaAutor'
import styles from '../styles/ListaAutores.module.css'

function ListaAutores({ autores, botones, variante = 'normal' }) {
  return (
    <div className={`${styles.grid} ${styles[variante]}`}>
      {autores.map(autor => (
        <div key={autor.id} className={styles.item}>
          <TarjetaAutor autor={autor} variante={variante} />
          <div className={styles.acciones}>
            {botones.map((boton, index) => {
              const etiqueta = typeof boton.texto === 'function' ? boton.texto(autor) : boton.texto
              const esAnadir = etiqueta === 'Añadir'
              return (
                <button
                  key={index}
                  type="button"
                  className={esAnadir ? styles.botonPrimario : styles.boton}
                  onClick={() => boton.onClick(autor)}
                >
                  {etiqueta}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ListaAutores
