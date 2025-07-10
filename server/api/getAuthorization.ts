export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)

    const amount = query.amount
    const channel = query.channel
    const tokenId = query.tokenId

    if (!amount || !channel || !tokenId) {
        return {
            error: 'Faltan parámetros requeridos: amount, channel y/o tokenId',
        }
    }

    const url = `${config.public.strapiApiUrl}/api/niubiz/getAuthorization?amount=${amount}&channel=${channel}&tokenId=${tokenId}`

    try {
        const result = await $fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${config.strapiApiTokenWrite}`,
            },
        })

        return result
    } catch (error: any) {
        console.error('[POST AUTHORIZATION INFO] Error:', error?.response || error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Error al obtener la autorización',
        })
    }
})
