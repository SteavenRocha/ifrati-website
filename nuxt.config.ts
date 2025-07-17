// https://nuxt.com/docs/api/configuration/nuxt-config
const isDev = process.env.DEVELOPMENT === 'true'

export default defineNuxtConfig({
  compatibilityDate: '2025-04-21',
  devtools: { enabled: false },

  /* ADD FOR ME */
  /* STYLES */
  css: [
    '@/assets/css/global.css'
  ],

  /* PINIA */
  modules: ['@pinia/nuxt'],

  /* API */
  runtimeConfig: {
    strapiApiToken: process.env.STRAPI_API_TOKEN,
    strapiApiTokenWrite: process.env.STRAPI_API_TOKEN_WRITE,
    public: {
      strapiApiUrl: process.env.STRAPI_API_URL,
      nuxtApiUrl: process.env.NUXT_API_URL,

      /* NIUBIZ */
      niubizUrlJs: isDev
        ? process.env.DEV_NIUBIZ_URL_JS
        : process.env.PRD_NIUBIZ_URL_JS,

      niubizUrlCss: isDev
        ? process.env.DEV_NIUBIZ_URL_CSS
        : process.env.PRD_NIUBIZ_URL_CSS,
    },
  },
})