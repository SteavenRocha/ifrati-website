export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const token = config.strapiApiTokenWrite

    const body = await readBody(event)

    if (!body) {
        return { error: 'Falta el body' }
    }

    const url = `${config.public.strapiApiUrl}/api/email/submitContactEmail`

    try {
        await $fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: body,
        })

        return 'success'
    } catch (error: any) {
        console.error('[SEND EMAIL] ERROR FETCHING:', error?.response || error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Error al enviar correo',
        })
    }
})