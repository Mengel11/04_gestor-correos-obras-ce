export const obtenerEtapasCompletadas = (obra) => {
    if (!obra) {
        return Array(6).fill(false)
    }
    return obra.etapasCompletadas
}

// Marca la etapa indicada con el valor recibido. Si la etapa queda incompleta,
// propaga el false a todas las etapas siguientes (regla de cascada), conservando
// el valor de las anteriores.
export const marcarEtapaCompletada = (etapasCompletadas, indice, completada) => {
    return etapasCompletadas.map((valor, i) => {
        if (i === indice) return completada
        if (i > indice && !completada) return false
        return valor
    })
}

export const aplicarEfectosCambioClasificacion = (obra, clasificacionNueva) => {
    if (!obra || obra.clasificacion === clasificacionNueva) {
        return {}
    }

    return {
        clasificacionApta: null,
        estado: 'Verificación de la clasificación',
        etapasCompletadas: marcarEtapaCompletada(obra.etapasCompletadas, 0, false),
    }
}

export const calcularPorcentajeAvance = (estado) => {
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
        default:
            valor = 0
    }
    const porcentaje = Math.round(valor / 12 * 100)
    return porcentaje
}
