import { Link } from 'react-router-dom'
import { calcularPorcentajeAvance } from '../utils/obraUtils'

function FilaObra({ obra, onEditar, onEliminar }) {
    return (
        <tr>
            <td>
                <Link to={`/obras/${obra.id}`}>{obra.titulo}</Link>
                <button onClick={() => onEditar(obra)}>Editar</button>
                <button onClick={() => onEliminar(obra)}>Eliminar</button>
            </td>
            <td>{obra.estado}</td>
            <td>{obra.fechaAlta.toDate().toLocaleString('es-MX')}</td>
            <td>{obra.autores.length}</td>
            <td>{obra.revisoresAsignados.length}</td>
            <td>{calcularPorcentajeAvance(obra.estado)}%</td>
        </tr>
    )
}

export default FilaObra;