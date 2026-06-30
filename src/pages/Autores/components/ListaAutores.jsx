import TarjetaAutor from './TarjetaAutor'
import { IconoEditar, IconoEliminar } from '../../../components/Iconos'
import styles from '../styles/ListaAutores.module.css'

function ListaAutores({ autores, botones, variante = 'normal' }) {
  return (
    <div className={`${styles.grid} ${styles[variante]}`}>
      {autores.map(autor => (
        <div key={autor.id} className={styles.item}>
          <TarjetaAutor autor={autor} variante={variante} />
          {botones.length > 0 && (
            <div className={styles.acciones}>
              {botones.map((boton, index) => {
                const etiqueta = typeof boton.texto === 'function' ? boton.texto(autor) : boton.texto
                const esAnadir = etiqueta === 'Añadir'
                const esIcono = etiqueta === 'Editar' || etiqueta === 'Eliminar'
                const claseBoton = etiqueta === 'Eliminar' ? styles.botonEliminar : esAnadir ? styles.botonPrimario : styles.boton
                return (
                  <button
                    key={index}
                    type="button"
                    className={esIcono ? `${claseBoton} ${styles.botonIcono}` : claseBoton}
                    onClick={() => boton.onClick(autor)}
                    aria-label={esIcono ? etiqueta : undefined}
                    title={esIcono ? etiqueta : undefined}
                  >
                    {etiqueta === 'Editar' ? <IconoEditar />
                      : etiqueta === 'Eliminar' ? <IconoEliminar />
                      : etiqueta}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ListaAutores
