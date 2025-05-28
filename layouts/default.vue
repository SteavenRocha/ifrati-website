<script setup>
import '@fontsource-variable/roboto'

const { data } = await useApi('website-configuration')

if (!data.value) {
  throw createError({
    statusCode: 500,
    message: 'Error | Could not connect to the Server'
  })
}

const style = data.value?.data?.styleSettings
const pillStyle = data.value?.data?.pillSettings

const contactData = data.value?.data?.contactSettings
provide('contactData', contactData)

if (style) {
  useHead({
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
        `
      }
    ]
  })
}
</script>

<template>
  <div>
    <div class="mobile__warning">
      <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 16 16">
        <g fill="currentColor">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
          <path
            d="M7 6.5C7 7.33 6.55 8 6 8s-1-.67-1-1.5S5.45 5 6 5s1 .67 1 1.5m4 0c0 .83-.45 1.5-1 1.5s-1-.67-1-1.5S9.45 5 10 5s1 .67 1 1.5M4.88 4.02a2 2 0 0 1 1.46-.05.5.5 0 0 0 .32-.94 3 3 0 0 0-2.17.07 3.1 3.1 0 0 0-.77.48l-.07.07a.5.5 0 0 0 .7.7 2 2 0 0 1 .13-.1 2 2 0 0 1 .4-.23Zm6.24 0a2 2 0 0 0-1.46-.05.5.5 0 1 1-.32-.94 3 3 0 0 1 2.17.07 3 3 0 0 1 .77.48l.07.07a.5.5 0 0 1-.7.7 2 2 0 0 0-.13-.1 2 2 0 0 0-.4-.23ZM8 10c-1 0-1.75.62-2.25 1.25-.38.47.08 1.06.69.98q1.56-.2 3.12 0c.6.08 1.07-.5.69-.98C9.75 10.62 9 10 8 10" />
        </g>
      </svg>
      <div class="warning__text">
        <p>Versión para tablet y móvil en desarrollo.</p>
        <p>Te invitamos a visitar la página desde una laptop o computadora de escritorio.</p>
      </div>
    </div>

    <div class="page__content">
      <Header />
        <main>
          <slot />
        </main>
      <Footer />
    </div>
  </div>
</template>

<style scoped>
.page__content {
  display: block;
}

.mobile__warning {
  display: none;
  gap: 10px;
}

.warning__text {
  max-width: 400px;
}

svg {
  width: 100px;
}

/* Mostrar solo en pantallas menores a 1024px */
@media (max-width: 1023px) {
  .page__content {
    display: none;
  }

  .mobile__warning {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding: 2rem;
    text-align: center;
    background-color: #f5f5f5;
    color: #333;
    font-size: 1.2rem;
    font-weight: 500;
  }
}
</style>