import TarjetaRevisor from './TarjetaRevisor'
import { IconoEditar, IconoEliminar } from '../../../components/Iconos'
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
              const esIcono = etiqueta === 'Editar' || etiqueta === 'Eliminar'
              const claseBoton = etiqueta === 'Eliminar' ? styles.botonEliminar : esAnadir ? styles.botonPrimario : styles.boton
              return (
                <button
                  key={index}
                  type="button"
                  className={esIcono ? `${claseBoton} ${styles.botonIcono}` : claseBoton}
                  onClick={() => boton.onClick(revisor)}
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
        </div>
      ))}
    </div>
  )
}

export default ListaRevisores
