<script setup>
import Hero from '~/components/Donate/Hero.vue';
import Donate from '~/components/Donate/Donate.vue';
import Important from '~/components/Donate/Important.vue';

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

/* DATOS DEL DONATE SECTION */
const titleDonate = donate.title ?? '' // TITLE
const descriptionDonate = donate?.description ?? '' // DESCRIPTION
const pillDonate = donate?.pill ?? {} // PILL
const donationForm = donate?.donationForm ?? {} // FORM
const goalsForm = donate?.specificGoalsForm ?? {} // FORM
const volunteerForm = donate?.volunteerForm ?? {} // FORM
const styleDonate = donate?.sectionStyle ?? {} // STYLES

/********************* IMPORTANT SECTION *********************/
/* CONFIGURACION GLOBAL DEL IMPORTANT SECTION */
const important = data?.value?.data?.sections?.[2] ?? {}

/* DATOS DEL IMPORTANT SECTION */
const titleImportat = important.title ?? '' // TITLE
const descriptionImportat = important?.description ?? '' // DESCRIPTION
const pillImportat = important?.pill ?? {} // PILL
const card = important?.cardSection ?? {} // CARD
const styleImportat = important?.sectionStyle ?? {} // STYLES

/********************* FAQS SECTION *********************/
/* CONFIGURACION GLOBAL DEL FAQ SECTION */
const faq = data?.value?.data?.sections?.[3] ?? {}

/* DATOS DEL FAQS SECTION */
const titleFaq = faq.title ?? '' // TITLE
const descriptionFaq = faq?.description ?? '' // DESCRIPTION
const pillFaq = faq?.pill ?? {} // PILL
const questions = faq?.questions ?? [] // QUESTIONS
const styleFaq = faq?.sectionStyle ?? {} // STYLES

</script>

<template>
  <div>
    <Hero :title="title" :description="description" :style="style" />

    <Donate :title="titleDonate" :description="descriptionDonate" :pill="pillDonate" :donationForm="donationForm"
      :goalsForm="goalsForm" :volunteerForm="volunteerForm" :style="styleDonate" />

    <Important :title="titleImportat" :description="descriptionImportat" :pill="pillImportat" :card="card"
      :style="styleImportat" />

    <Faq :title="titleFaq" :description="descriptionFaq" :pill="pillFaq" :questions="questions" :style="styleFaq" />
  </div>
</template>

<style scoped></style>