export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)

    const { amount, purchaseNumber, tokenId, locationDataMap } = body

    if (!amount || !purchaseNumber || !tokenId || !locationDataMap) {
        return {
            error: 'Faltan parámetros requeridos',
        }
    }

    const url = `${config.public.strapiApiUrl}/api/niubiz/getAuthorization`

    try {
        const result = await $fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${config.strapiApiTokenWrite}`,
            },
            body: {
                amount,
                purchaseNumber,
                tokenId,
                locationDataMap
            },
        })

        return result
    } catch (error: any) {
        const fullError = error?.response?._data || error?.data || error

        console.error('[POST AUTHORIZATION INFO] Error completo:', fullError)

        return {
            error: true,
            message: 'Error al obtener authorization',
            details: fullError,
        }
    }
})
