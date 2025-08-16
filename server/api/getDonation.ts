export default defineEventHandler(async (event) => {
    try {
        const config = useRuntimeConfig()

        const { id } = getQuery(event)

        if (!id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Falta el parámetro "id"'
            })
        }

        const url = `${config.public.strapiApiUrl}/api/donations?filters[purchaseNumber][$eq]=${id}`

        const res: any = await $fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${config.strapiApiTokenWrite}`
            }
        })

        return {
            data: res.data ?? [],
        }
    } catch (error) {
        console.error('Error obteniendo datos de la donacion:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Error obteniendo datos de Strapi'
        })
    }
})