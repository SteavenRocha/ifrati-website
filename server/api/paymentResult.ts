export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)
    const query = getQuery(event)

    const { transactionToken } = body
    const { id, amount, city, state, country, postalCode } = query

    if (!transactionToken || !id || !amount || !state || !country || !postalCode) {
        // Redirecciona con error si faltan parámetros
        const errorRedirect = `/payment-result?id=${id}&status=error&reason=missing_params`
        return sendRedirect(event, errorRedirect)
    }

    const url = `${config.public.strapiApiUrl}/api/niubiz/getAuthorization`
    const redirectUrl = `/payment-result?id=${id}`

    try {
        const response: any = await $fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${config.strapiApiTokenWrite}`,
            },
            body: {
                amount,
                purchaseNumber: id,
                tokenId: transactionToken,
                locationDataMap: {
                    urlAddress: "https://ifrati.org.pe",
                    city,
                    state,
                    country,
                    postalCode,
                }
            },
        })

        if (response?.error) {
            console.warn('❌ Autorización fallida:', response)

            const reason = encodeURIComponent(response?.authorization?.dataMap?.ACTION_DESCRIPTION || 'Error desconocido')
            const errorRedirect = `${redirectUrl}&status=error&reason=${reason}`
            return sendRedirect(event, errorRedirect)
        }

        // ✅ Caso exitoso
        console.log('✅ Autorización obtenida:', response)
        return sendRedirect(event, `${redirectUrl}&status=success`)
    } catch (error: any) {
        const fullError = error?.response?._data || error?.data || error
        console.error('[POST AUTHORIZATION INFO] Error completo:', fullError)

        const reason = encodeURIComponent(fullError?.error?.data?.ACTION_DESCRIPTION || 'Error inesperado')
        const errorRedirect = `${redirectUrl}&status=error&reason=${reason}`
        return sendRedirect(event, errorRedirect)
    }
})