export default defineEventHandler(async (event) => {
    try {
        const config = useRuntimeConfig()

        const { path } = getQuery(event)

        if (!path) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Falta el parámetro "path"'
            })
        }

        const url = `${config.public.strapiApiUrl}/api/${path}`

        const res: any = await $fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${config.strapiApiTokenWrite}`
            }
        })

        return {
            success: true,
            data: res.data ?? res,
            meta: res.meta ?? res
        }
    } catch (error) {
        console.error('Error obteniendo datos de Strapi:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Error obteniendo datos de Strapi'
        })
    }
})