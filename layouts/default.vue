<script setup>
import '@fontsource-variable/roboto';

const { data } = await useApi('website-configuration')

const style = data.value?.data?.style

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
          }
        `
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
  </div>
</template>

<style scoped></style>
