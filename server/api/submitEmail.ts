export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const token = config.strapiApiTokenWrite
    const query = getQuery(event)
    const action = query.action

    if (!action) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Falta el parámetro "action"',
        })
    }

    const body = await readBody(event)
    if (!body) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Falta el body del request',
        })
    }

    const url = `${config.public.strapiApiUrl}/api/email/${action}`

    try {
        await $fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: body,
        })

        return { status: 'success' }
    } catch (error: any) {
        console.error('[SEND EMAIL] ERROR FETCHING:', error?.response || error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Error al enviar correo',
        })
    }
})