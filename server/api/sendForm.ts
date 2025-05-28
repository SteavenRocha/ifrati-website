export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = config.strapiApiTokenWrite

  const body = await readBody(event)
  const endpoint = getQuery(event).endpoint as string

  if (!endpoint) {
    return { error: 'Falta el parámetro "endpoint"' }
  }

  const url = `${config.public.strapiApiUrl}/api/${endpoint}`

  try {
    await $fetch(url, {
      method: 'POST',
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