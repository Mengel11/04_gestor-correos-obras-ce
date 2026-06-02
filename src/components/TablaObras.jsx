import FilaObra from './FilaObra'

function TablaObras({ obras }) {
    const filasObra = obras.map(obra => <FilaObra key={obra.id} obra={obra} />)
    
    return (
        <>
            <h2>Tabla de obras que muestra una barra con el pordentaje de avance</h2>
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