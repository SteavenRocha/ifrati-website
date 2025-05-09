export function useApi(endpoint: string) {
    const config = useRuntimeConfig()

    return useFetch(`${config.public.strapiApiUrl}/api/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${config.strapiApiToken}`
        }
    })
}