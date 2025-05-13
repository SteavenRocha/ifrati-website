<script setup>
import Hero from '~/components/Program/Hero.vue';
import Purpose from '~/components/Program/Purpose.vue';
import Pillars from '~/components/Program/Pillars.vue';

const { data } = await useApi('program-page')

/********************* HERO SECTION *********************/
/* CONFIGURACION GLOBAL DEL HERO SECTION */
const hero = data?.value?.data?.sections?.[0] ?? {}

/* DATOS DEL HERO SECTION */
const title = hero.title ?? '' // TITLE
const description = hero?.description ?? '' // DESCRIPTION
const style = hero?.heroStyle ?? {} // STYLES

/********************* PURPOSE SECTION *********************/
/* CONFIGURACION GLOBAL DEL PURPOSE SECTION */
const purpose = data?.value?.data?.sections?.[1] ?? {}

/* DATOS DEL PURPOSE SECTION */
const titlePurpose = purpose?.title ?? '' // TITLE
const descriptionPurpose = purpose?.description ?? '' // DESCRIPTION
const pillPurpose = purpose?.pill ?? {} // PILL
const sideImagePurpose = purpose?.sideImage ?? {} // SIDEIMAGE
const stylePurpose = purpose?.sectionStyle ?? {} // STYLES

/********************* PILLARS SECTION *********************/
/* CONFIGURACION GLOBAL DEL PILLARS SECTION */
const pillars = data?.value?.data?.sections?.[2] ?? {}

/* DATOS DEL PILLARS SECTION */
const titlePillars = pillars?.title ?? '' // TITLE
const descriptionPillars = pillars?.description ?? '' // DESCRIPTION
const pillPillars = pillars?.pill ?? {} // PILL
const pillarsCard = pillars?.pillars ?? {} // SIDEIMAGE
const stylePillars = pillars?.sectionStyle ?? {} // STYLES
</script>

<template>
  <div>
    <Hero :title="title" :description="description" :style="style" />

    <Purpose :title="titlePurpose" :description="descriptionPurpose" :pill="pillPurpose" :sideImage="sideImagePurpose"
      :style="stylePurpose" />

    <Pillars :title="titlePillars" :description="descriptionPillars" :pill="pillPillars" :pillarsCard="pillarsCard"
      :style="stylePillars" />
  </div>
</template>

<style scoped></style>