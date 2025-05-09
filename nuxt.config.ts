// https://nuxt.com/docs/api/configuration/nuxt-config
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
    public: {
      strapiApiUrl: process.env.STRAPI_API_URL,
    },
  },
})