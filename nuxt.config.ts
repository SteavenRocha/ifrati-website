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

      /* NIUBIZ */
      niubizUrlJs: isDev
        ? process.env.NIUBIZ_URL_JS_DEV
        : process.env.NIUBIZ_URL_JS_PRD,

      niubizUrlCss: isDev
        ? process.env.NIUBIZ_URL_CSS_DEV
        : process.env.NIUBIZ_URL_CSS_PRD,
    },
  },
})