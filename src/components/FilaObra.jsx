import { Link } from 'react-router-dom'
import { calcularPorcentajeAvance } from '../utils/obraUtils';

function FilaObra({ obra, botones }) {
    
    return (
        <>
            <tr>
                <td>
                    <Link to={`/obras/${obra.id}`}>{obra.titulo}</Link>
                    {botones.map((boton, index) => {
                        const etiqueta = typeof boton.texto === 'function' ? boton.texto(obra) : boton.texto;
                        return (
                        <button key={index} onClick={() => boton.onClick(obra)} type="button">
                            {etiqueta}
                        </button>
                    )})}
                </td>
                <td>{obra.estado}</td>
                <td>{obra.fechaAlta.toDate().toLocaleString('es-MX')}</td>
                <td>{obra.autores.length}</td>
                <td>{obra.revisoresAsignados.length}</td>
                <td>{calcularPorcentajeAvance(obra.estado)}%</td>
            </tr>
        </>
    )
}

export default FilaObra;