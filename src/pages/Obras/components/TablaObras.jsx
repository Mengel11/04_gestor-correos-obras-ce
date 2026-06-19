import FilaObra from './FilaObra'

function TablaObras({ obras, botones }) {

    const filasObra = obras.map(obra => (
        <FilaObra 
            key={obra.id}
            obra={obra}
            botones={botones}
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