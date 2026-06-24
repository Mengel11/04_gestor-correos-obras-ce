import { useEffect, useState } from "react";
import styles from '../styles/DetallesObra.module.css'

function Temporizador({ fechaLimite }) {
    const [tiempo, setTiempo] = useState({dias: 0, horas: 0, minutos: 0, segundos: 0})
    
    useEffect(() => {
        const calcularTiempo = () => {
            if( !fechaLimite ) return

            const fechaObjetivo = fechaLimite.toDate().getTime()
            const fechaActual = new Date().getTime()
            const diferencia = fechaObjetivo - fechaActual
            const diferenciaAbsoluta = Math.abs(diferencia)
            
            setTiempo({
                dias: Math.floor( diferenciaAbsoluta / (1000 * 60 * 60 * 24) ),
                horas: Math.floor( diferenciaAbsoluta % (1000 * 60 * 60 * 24) / (1000 * 60 * 60) ),
                minutos: Math.floor( diferenciaAbsoluta % (1000 * 60 * 60) / (1000 * 60) ),
                segundos: Math.floor( diferenciaAbsoluta % (1000 * 60) / (1000) )
            })
        }
        calcularTiempo();
        
        const intervalo = setInterval(calcularTiempo, 1000)
        return () => clearInterval(intervalo)
        
    }, [fechaLimite])
    
    if( !fechaLimite ) return null
 
    const diferencia = fechaLimite.toDate().getTime() - new Date().getTime()

    return (
        <div className={styles.temporizador}>
            <span className={styles.temporizadorTitulo}>
                {diferencia < 0 ? 'Tiempo vencido' : 'Tiempo restante'}
            </span>
            <strong>{diferencia < 0 ? '-' : ''}{tiempo.dias} días</strong>
            <strong>{tiempo.horas}:{tiempo.minutos}:{tiempo.segundos}</strong>
        </div>
    )
}

export default Temporizador;