<script setup>
import '@fontsource-variable/roboto'

const { data } = await useApi('website-configuration')

if (!data.value) {
  throw createError({
    statusCode: 500,
    message: 'Error | Could not connect to the Server'
  })
}

useHead({
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: getResource(data.value.data.globalSettings.favicon?.url).imageUrl
    }
  ]
})

const style = data.value?.data?.styleSettings
const pillStyle = data.value?.data?.pillSettings

/* COMPANY INFORMATION */
const companyInformation = data.value?.data?.companyInformation
provide('companyInformation', companyInformation)

/* WHATSAPP INFORMATION */
const whatsapp = data.value?.data?.companyInformation?.floatingWhatsApp

if (style) {
  useHead({
    /* link: [
      {
        rel: 'stylesheet',
        href: config.public.niubizUrlCss
      }
    ],
    script: [
      {
        src: config.public.niubizUrlJs,
        defer: true
      }
    ], */
    style: [
      {
        innerHTML: `
          :root {
            --primary-color: ${style.primaryColor};
            --secondary-color: ${style.secondaryColor};
            --background-color: ${style.backgroundColor};
            --text-color: ${style.textColor};
            --title-color: ${style.titleColor};

            --pill-bg-color: ${pillStyle.backgroundColor};
            --pill-text-color: ${pillStyle.textColor};
          }
        `,
        type: 'text/css'
      }
    ]
  })
}
</script>

<template>
  <div>
    <Header />
    <main>
      <slot />
    </main>
    <Footer />

    <!-- Botón flotante WhatsApp -->
    <FloatingWhatsApp :icon="whatsapp.icon.url" :number="whatsapp.number" :href="whatsapp.href"
      :message="whatsapp.message" />
  </div>
</template>

<style scoped>
main {
  /* overflow: hidden; */
  z-index: unset;
}
</style>