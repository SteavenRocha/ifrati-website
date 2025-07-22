<script setup>
import Hero from '~/components/About/Hero.vue';
import Mission from '~/components/About/Mission.vue';
import Vision from '~/components/About/Vision.vue';
import Values from '~/components/About/Values.vue';
import Team from '~/components/About/Team.vue';
/* import Cta from '~/components/About/Cta.vue'; */

const { data } = await useApi('about-page')

useHead({
    title: data.value.data.title,
})

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
const pillMission = mission?.pill ?? {} // PILL
const sideImageMission = mission?.sideImage ?? {} // SIDEIMAGE
const styleMission = mission?.sectionStyle ?? {} // STYLES

/********************* VISION SECTION *********************/
/* CONFIGURACION GLOBAL DEL VISION SECTION */
const vision = data?.value?.data?.sections?.[2] ?? {}

/* DATOS DEL ABOUT SECTION */
const titleVision = vision?.title ?? '' // TITLE
const descriptionVision = vision?.description ?? '' // DESCRIPTION
const pillVisionn = vision?.pill ?? {} // PILL
const sideImageVision = vision?.sideImage ?? {} // SIDEIMAGE
const styleVision = vision?.sectionStyle ?? {} // STYLES

/********************* VALUES SECTION *********************/
/* CONFIGURACION GLOBAL DEL VALUES SECTION */
const values = data?.value?.data?.sections?.[3] ?? {}

/* DATOS DEL ABOUT SECTION */
const titleValues = values?.title ?? '' // TITLE
const descriptionValues = values?.description ?? '' // DESCRIPTION
const pillValues = values?.pill ?? {} // PILL
const cardValues = values?.cardSection ?? {} // CARD
const styleValues = values?.sectionStyle ?? {} // STYLES

/********************* TEAM SECTION *********************/
/* CONFIGURACION GLOBAL DEL TEAM SECTION */
const team = data?.value?.data?.sections?.[4] ?? {}

/* DATOS DEL ABOUT SECTION */
const titleTeam = team?.title ?? '' // TITLE
const descriptionTeam = team?.description ?? '' // DESCRIPTION
const pillTeam = team?.pill ?? {} // PILL
const cardTeam = team?.cardSection ?? {} // CARD
const styleTeam = team?.sectionStyle ?? {} // STYLES

/********************* CTA SECTION *********************/
/* CONFIGURACION GLOBAL DEL CTA SECTION */
const cta = data?.value?.data?.sections?.[5] ?? {}

/* DATOS DEL ABOUT SECTION */
const titleCta = cta?.title ?? '' // TITLE
const descriptionCta = cta?.description ?? '' // DESCRIPTION
const buttonCta = cta?.button ?? [] // BUTTON
const styleCta = cta?.ctaStyle ?? {} // STYLES

</script>

<template>
  <div>
    <Hero :title="title" :description="description" :style="style" />

    <Mission :title="titleMission" :description="descriptionMission" :pill="pillMission" :sideImage="sideImageMission"
      :style="styleMission" />

    <Vision :title="titleVision" :description="descriptionVision" :pill="pillVisionn" :sideImage="sideImageVision"
      :style="styleVision" />

    <Values :title="titleValues" :description="descriptionValues" :pill="pillValues" :card="cardValues"
      :style="styleValues" />

    <Team :title="titleTeam" :description="descriptionTeam" :pill="pillTeam" :card="cardTeam" :style="styleTeam" />

    <Cta :title="titleCta" :description="descriptionCta" :button="buttonCta" :style="styleCta" />
  </div>
</template>

<style scoped></style>