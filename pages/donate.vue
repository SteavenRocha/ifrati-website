<script setup>
import Hero from '~/components/Donate/Hero.vue';

const { data } = await useApi('donate-page')

/********************* HERO SECTION *********************/
/* CONFIGURACION GLOBAL DEL HERO SECTION */
const hero = data?.value?.data?.sections?.[0] ?? {}

/* DATOS DEL HERO SECTION */
const title = hero.title ?? '' // TITLE
const description = hero?.description ?? '' // DESCRIPTION
const style = hero?.heroStyle ?? {} // STYLES

/********************* DONATE SECTION *********************/
/* CONFIGURACION GLOBAL DEL DONATE SECTION */
const donate = data?.value?.data?.sections?.[1] ?? {}

/* DATOS DEL HERO SECTION */
const titleDonate = donate.title ?? '' // TITLE
const descriptionDonate = donate?.description ?? '' // DESCRIPTION
const pillDonate = donate?.pill ?? {} // PILL
const donationForm = donate?.donationForm ?? {} // FORM
const styleDonate = donate?.sectionStyle ?? {} // STYLES

</script>

<template>
  <div>
    <Hero :title="title" :description="description" :style="style" />

    <Donate :title="titleDonate" :description="descriptionDonate" :pill="pillDonate" :donationForm="donationForm" :style="styleDonate" />
  </div>
</template>

<style scoped></style>