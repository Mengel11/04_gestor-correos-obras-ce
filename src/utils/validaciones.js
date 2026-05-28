export const validarEmail = (email) => {
  const todoMenosEspaciosNiArrobas = '[^\\s@]+'
  const regex = new RegExp(`^${todoMenosEspaciosNiArrobas}@${todoMenosEspaciosNiArrobas}\\.${todoMenosEspaciosNiArrobas}$`)
  return regex.test(email)
}