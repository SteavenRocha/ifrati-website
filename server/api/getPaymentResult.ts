export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const id = query.id

  if (!id) {
    return {
      error: 'Faltan parámetros requeridos: id',
    }
  }

  const url = `${config.public.strapiApiUrl}/api/donations?filters[purchaseNumber][$eq]=${id}`

  try {
    const result = await $fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${config.strapiApiTokenWrite}`,
      },
    })

    return result
  } catch (error: any) {
    console.error('[GET PAYMENT RESULT INFO] Error:', error?.response || error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al obtener datos del Payment',
    })
  }
})
