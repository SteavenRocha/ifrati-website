<script setup>
import Hero from '~/components/About/Hero.vue';
import Mission from '~/components/About/Mission.vue';
import Vision from '~/components/About/Vision.vue';

const { data } = await useApi('about-page')

/********************* HERO SECTION *********************/
/* CONFIGURACION GLOBAL DEL HERO SECTION */
const hero = data?.value?.data?.sections?.[0] ?? {}

/* DATOS DEL HERO SECTION */
const title = hero.title ?? '' // TITLE
const description = hero?.description ?? '' // DESCRIPTION
const style = hero?.heroStyle ?? {} // STYLES

/********************* MISSION SECTION *********************/
/* CONFIGURACION GLOBAL DEL MISSION SECTION */
const mission = data?.value?.data?.sections?.[1] ?? {}

/* DATOS DEL ABOUT SECTION */
const titleMission = mission?.title ?? '' // TITLE
const descriptionMission = mission?.description ?? '' // DESCRIPTION
const pillMission = mission?.pill ?? '' // PILL
const sideImageMission = mission?.sideImage ?? {} // SIDEIMAGE
const styleMission = mission?.sectionStyle ?? {} // STYLES

/********************* VISION SECTION *********************/
/* CONFIGURACION GLOBAL DEL MISSION SECTION */
const vision = data?.value?.data?.sections?.[2] ?? {}

/* DATOS DEL ABOUT SECTION */
const titleVision = vision?.title ?? '' // TITLE
const descriptionVision = vision?.description ?? '' // DESCRIPTION
const pillVisionn = vision?.pill ?? '' // PILL
const sideImageVision = vision?.sideImage ?? {} // SIDEIMAGE
const styleVision = vision?.sectionStyle ?? {} // STYLES

</script>

<template>
  <div>
    <Hero :title="title" :description="description" :style="style" />

    <Mission :title="titleMission" :description="descriptionMission" :pill="pillMission" :sideImage="sideImageMission"
      :style="styleMission" />

    <Vision :title="titleVision" :description="descriptionVision" :pill="pillVisionn" :sideImage="sideImageVision"
      :style="styleVision" />
  </div>
</template>

<style scoped></style>