export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  const { amount, mdd, cardDataMap } = body

  if (!amount || !mdd || !cardDataMap ) {
    return {
      error: 'Faltan parámetros requeridos',
    }
  }

  const url = `${config.public.strapiApiUrl}/api/niubiz/getSessionInfo`

  try {
    const result = await $fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.strapiApiTokenWrite}`,
      },
      body: {
        amount,
        mdd,
        cardDataMap
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