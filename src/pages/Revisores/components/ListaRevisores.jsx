import TarjetaRevisor from './TarjetaRevisor'
import styles from '../styles/ListaRevisores.module.css'

function ListaRevisores({ revisores, botones, variante = 'normal' }) {
  return (
    <div className={`${styles.grid} ${styles[variante]}`}>
      {revisores.map(revisor => (
        <div key={revisor.id} className={styles.item}>
          <TarjetaRevisor revisor={revisor} variante={variante} />
          <div className={styles.acciones}>
            {botones.map((boton, index) => {
              const etiqueta = typeof boton.texto === 'function' ? boton.texto(revisor) : boton.texto
              const esAnadir = etiqueta === 'Añadir'
              return (
                <button
                  key={index}
                  type="button"
                  className={esAnadir ? styles.botonPrimario : styles.boton}
                  onClick={() => boton.onClick(revisor)}
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

export default ListaRevisores
