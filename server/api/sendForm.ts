export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = config.strapiApiTokenWrite

  const body = await readBody(event)
  const endpoint = getQuery(event).endpoint as string
  const method = event.method // Detecta el método (POST, PUT, etc.)

  if (!endpoint) {
    return { error: 'Falta el parámetro "endpoint"' }
  }

  const url = `${config.public.strapiApiUrl}/api/${endpoint}`

  try {
    await $fetch(url, {
      method, // Usa el método detectado
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: { data: body },
    })

    return 'success'
  } catch (error: any) {
    console.error('[SEND FORM] ERROR FETCHING:', error?.response || error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al enviar datos al backend',
    })
  }
})