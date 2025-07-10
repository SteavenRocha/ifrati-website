export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const amount = query.amount
  const channel = query.channel

  if (!amount || !channel) {
    return {
      error: 'Faltan parámetros requeridos: amount y/o channel',
    }
  }

  const url = `${config.public.strapiApiUrl}/api/niubiz/getSessionInfo?amount=${amount}&channel=${channel}`

  try {
    const result = await $fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.strapiApiTokenWrite}`,
      },
    })

    return result
  } catch (error: any) {
    console.error('[POST SESION INFO] Error:', error?.response || error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al obtener sesión',
    })
  }
})
