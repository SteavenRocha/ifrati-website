export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const dni = query.dni

  if (!dni) {
    return {
      error: 'Faltan parámetros requeridos: amount y/o channel',
    }
  }

  const url = `${config.public.strapiApiUrl}/api/niubiz/getDataDni?dni=${dni}`

  try {
    const result = await $fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${config.strapiApiTokenWrite}`,
      },
    })

    return result
  } catch (error: any) {
    console.error('[GET DATA DNI INFO] Error:', error?.response || error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al obtener datos del DNI',
    })
  }
})
