import { useRetroalimentacion } from '../context/Retroalimentacion';
import { useConfirmar } from '../context/Confirmar';
import { eliminarObra } from '../services/obrasService';
import FilaObra from './FilaObra'

function TablaObras({ obras, onEditarObra }) {
    const mostrarMensaje = useRetroalimentacion();
    const confirmarAccion = useConfirmar();

    const handleEliminarObra = async (obra) => {
        const confirmar = await confirmarAccion('¿Estás seguro que deseas eliminar esta obra?')
        if (!confirmar) return
    
        try {
          await eliminarObra(obra.id)
          mostrarMensaje({tipo: 'Exito', texto: 'Obra eliminada exitosamente'})
          await onExito()
        } catch (error) {
          mostrarMensaje({tipo: 'Error', texto: 'Error al eliminar la obra, intente nuevamente'})
        }
    }

    const filasObra = obras.map(obra => (
        <FilaObra 
            key={obra.id}
            obra={obra}
            botones={[
                {texto: 'Editar', onClick: onEditarObra},
                {texto: 'Eliminar', onClick: handleEliminarObra}
            ]}
        />
    ))
    
    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Obra</th>
                        <th>Estado</th>
                        <th>Fecha de Alta</th>
                        <th>Autores</th>
                        <th>Revisores</th>
                        <th>Porcentaje de Avance</th>
                    </tr>
                </thead>
                <tbody>
                    {filasObra}
                </tbody>
            </table>
        </>
    )
}

export default TablaObras;