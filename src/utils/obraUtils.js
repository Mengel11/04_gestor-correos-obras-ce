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