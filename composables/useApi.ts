export function useApi(endpoint: string) {
  const config = useRuntimeConfig()
  const token = config.strapiApiToken

  return useFetch(`${config.public.strapiApiUrl}/api/${endpoint}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  })
}