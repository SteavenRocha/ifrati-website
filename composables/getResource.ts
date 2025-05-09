export function getResource(path?: string) {
  const config = useRuntimeConfig()
  const STRAPI_API_URL = config.public.strapiApiUrl

  return {
    imageUrl: path ? STRAPI_API_URL + path : '',
  }
}