export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const token = config.strapiApiTokenWrite

    const body = await readBody(event)
    const query = getQuery(event)

    const { transactionToken } = body
    const { id } = query

    if (!transactionToken || !id) {
        // Redirecciona con error si faltan parámetros
        const errorRedirect = `/payment-result?id=${id}&status=error&reason=missing_params`
        return sendRedirect(event, errorRedirect)
    }

    /* OBTENEMOS EL REGISTRO DE LA "NUEVA" DONACION*/
    const url = `${config.public.strapiApiUrl}/api/donations?filters[purchaseNumber][$eq]=${id}`

    try {
        const response: any = await $fetch(url, {
            method: 'GET', // Usa el método detectado
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })

        if (response.data) {
            const item = response.data[0]

            const documentId = item.documentId  // LO VAMOS USAR PARA ACTUALIZAR LOS DATOS DE LA TARJETA
            const amount = item.amount
            const city = item.city
            const state = item.state
            const country = item.country
            const postalCode = item.postalCode
            const donationType = item.donationType

            const url = `${config.public.strapiApiUrl}/api/niubiz/getAuthorization`
            const redirectUrl = `/payment-result?id=${id}`

            try {
                const response: any = await $fetch(url, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
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

                if (response && !response.error) {
                    // CASO EXITOSO - REGISTRAMOS DATA DE LA CARD
                    console.log('✅ Autorización obtenida:', response)

                    const url = `${config.public.strapiApiUrl}/api/donations/${documentId}`

                    const transactionStatus = response.authorization.dataMap.STATUS
                    const brand = response.authorization.dataMap.BRAND
                    const card = response.authorization.dataMap.CARD
                    const transactionDate = response.authorization.dataMap.TRANSACTION_DATE

                    try {
                        const response: any = await $fetch(url, {
                            method: 'PUT',
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            }, body:
                            {
                                data: {
                                    transactionStatus,
                                    brand,
                                    card,
                                    transactionDate
                                }
                            },
                        })

                        if (response && !response.error && donationType === 'GENERAL') {  // PROCESO TERMINADO
                            console.log("datos de la tarjeta enviados correctamente, para donación general", response)
                            return sendRedirect(event, `${redirectUrl}&status=Authorized`)
                        } else if (response && !response.error && donationType === 'META') {  // REGISTRAR MONTO A LA META
                            console.log("Siguiente paso registrar el monto de la meta", response)
                            return sendRedirect(event, `${redirectUrl}&status=Authorized`)
                        }
                    } catch (error: any) {
                        console.error('[SEND FORM] ERROR FETCHING:', error?.response || error)
                        throw createError({
                            statusCode: 500,
                            statusMessage: 'Error al enviar datos de la tarjeta al backend',
                        })
                    }
                } else {
                    console.warn('❌ Autorización fallida:', response)

                    const reason = encodeURIComponent(response?.authorization?.dataMap?.ACTION_DESCRIPTION || 'Error desconocido')
                    const errorRedirect = `${redirectUrl}&status=error&reason=${reason}`
                    return sendRedirect(event, errorRedirect)

                    /* REGISTRAMOS OBJECIONES DE LA DONACION*/
                }
            } catch (error: any) {
                const fullError = error?.response?._data || error?.data || error
                console.error('[POST AUTHORIZATION INFO] Error completo:', fullError)

                const reason = encodeURIComponent(fullError?.error?.data?.ACTION_DESCRIPTION || 'Error inesperado')
                const errorRedirect = `${redirectUrl}&status=error&reason=${reason}`
                return sendRedirect(event, errorRedirect)
            }
        }
    } catch (error: any) {
        console.error('[SEND FORM] ERROR FETCHING:', error?.response || error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Error al enviar datos al backend',
        })
    }
})