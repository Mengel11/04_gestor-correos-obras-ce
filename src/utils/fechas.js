/** Convierte "YYYY-MM-DD" del input a fin del día en UTC-6 (México central) */
export const fechaInputAFechaLimite = (fechaTexto) => {
    const [año, mes, dia] = fechaTexto.split('-').map(Number)
    return new Date(Date.UTC(año, mes - 1, dia + 1, 5, 59, 59, 999))
}
