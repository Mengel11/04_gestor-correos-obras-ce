import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useRetroalimentacion } from '../../../context/Retroalimentacion'
import { obtenerAutor } from '../../../services/autoresService';
import { calcularPorcentajeAvance } from '../../../utils/obraUtils';
import TarjetaAutor from '../../Autores/components/TarjetaAutor';
import GraficaDona from './GraficaDona';
import FormularioObra from '../../Obras/components/FormularioObra';

function TarjetaObra({ obra, onEditar }) {
    const [autoresObra, setAutoresObra] = useState([]);

    const mostrarMensaje = useRetroalimentacion();

    useEffect(() => {
        const cargarAutoresObra = async () => {
            try {
                const autores = obra.autores.map(autorId => obtenerAutor(autorId))
                const autoresObtenidos = await Promise.all(autores)
                setAutoresObra(autoresObtenidos)
            } catch (error) {
                mostrarMensaje({tipo: 'Advertencia', texto: 'No se pudieron cargar los autores de la obra'})
            }
        }
        cargarAutoresObra()
    }, [])

    return (
        <>
            <p>Titulo: {obra.titulo}</p>
            <p>Clasificación: {obra.clasificacion}</p>
            <div>Autores: 
                <div>
                    {autoresObra.map(autor => (
                        <TarjetaAutor key={autor.id} autor={autor} />
                    ))}
                </div>
            </div>
            <p>Estado: {obra.estado}</p>
            <GraficaDona porcentaje={calcularPorcentajeAvance(obra.estado)}/>
            <button onClick={onEditar}>Modificar</button>
        </>
    )
}

export default TarjetaObra;