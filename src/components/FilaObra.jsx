import { Link } from 'react-router-dom'

function calcularPorcentajeAvance(estado) {
    let valor = null
    switch (estado) {
        case 'En espera a reclasificación del autor':
            valor = 0.5
            break;
        case 'Verificación de la clasificación': 
            valor = 1
            break;
        case 'Establecer revisores y plazos':
            valor = 3
            break;
        case 'Asignación de revisores':
            valor = 5
            break;
        case 'Establecer revisiones y plazos':
            valor = 7
            break;
        case 'Revisión en proceso':
            valor = 9
            break;
        case 'Toma de decisión final':
            valor = 11
            break;
        case 'Decisión final registrada':
            valor = 12
            break;
    }
    const porcentaje = Math.round(valor / 12 * 100)
    return porcentaje
}

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