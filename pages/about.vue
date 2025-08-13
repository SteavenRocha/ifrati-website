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

const sections = data?.value?.data?.sections ?? []

const hero = sections.find(s => s.__component === 'about-blocks.hero-section') ?? {}
const mission = sections.find(s => s.__component === 'about-blocks.mission-section') ?? {}
const vision = sections.find(s => s.__component === 'about-blocks.vision-section') ?? {}
const values = sections.find(s => s.__component === 'about-blocks.values-section') ?? {}
const team = sections.find(s => s.__component === 'about-blocks.team-section') ?? {}
const cta = sections.find(s => s.__component === 'about-blocks.cta-section') ?? {}

/********************* HERO SECTION *********************/
/* DATOS DEL HERO SECTION */
const title = hero.title ?? '' // TITLE
const description = hero?.description ?? '' // DESCRIPTION
const style = hero?.heroStyle ?? {} // STYLES

/********************* MISSION SECTION *********************/
/* DATOS DEL ABOUT SECTION */
const titleMission = mission?.title ?? '' // TITLE
const descriptionMission = mission?.description ?? '' // DESCRIPTION
const pillMission = mission?.pill ?? {} // PILL
const sideImageMission = mission?.sideImage ?? {} // SIDEIMAGE
const styleMission = mission?.sectionStyle ?? {} // STYLES

/********************* VISION SECTION *********************/
/* DATOS DEL ABOUT SECTION */
const titleVision = vision?.title ?? '' // TITLE
const descriptionVision = vision?.description ?? '' // DESCRIPTION
const pillVisionn = vision?.pill ?? {} // PILL
const sideImageVision = vision?.sideImage ?? {} // SIDEIMAGE
const styleVision = vision?.sectionStyle ?? {} // STYLES

/********************* VALUES SECTION *********************/
/* DATOS DEL ABOUT SECTION */
const titleValues = values?.title ?? '' // TITLE
const descriptionValues = values?.description ?? '' // DESCRIPTION
const pillValues = values?.pill ?? {} // PILL
const cardValues = values?.cardSection ?? {} // CARD
const styleValues = values?.sectionStyle ?? {} // STYLES

/********************* TEAM SECTION *********************/
/* DATOS DEL ABOUT SECTION */
const titleTeam = team?.title ?? '' // TITLE
const descriptionTeam = team?.description ?? '' // DESCRIPTION
const pillTeam = team?.pill ?? {} // PILL
const cardTeam = team?.cardSection ?? {} // CARD
const styleTeam = team?.sectionStyle ?? {} // STYLES

/********************* CTA SECTION *********************/
/* DATOS DEL ABOUT SECTION */
const titleCta = cta?.title ?? '' // TITLE
const descriptionCta = cta?.description ?? '' // DESCRIPTION
const buttonCta = cta?.button ?? [] // BUTTON
const styleCta = cta?.ctaStyle ?? {} // STYLES

</script>

<template>
  <div>
    <Hero v-if="hero" :title="title" :description="description" :style="style" />

    <Mission v-if="mission && Object.keys(mission).length" :title="titleMission" :description="descriptionMission" :pill="pillMission" :sideImage="sideImageMission"
      :style="styleMission" />

    <Vision v-if="vision && Object.keys(vision).length" :title="titleVision" :description="descriptionVision" :pill="pillVisionn" :sideImage="sideImageVision"
      :style="styleVision" />

    <Values v-if="values && Object.keys(values).length" :title="titleValues" :description="descriptionValues" :pill="pillValues" :card="cardValues"
      :style="styleValues" />

    <Team v-if="team && Object.keys(team).length" :title="titleTeam" :description="descriptionTeam" :pill="pillTeam" :card="cardTeam" :style="styleTeam" />

    <Cta v-if="cta && Object.keys(cta).length" :title="titleCta" :description="descriptionCta" :button="buttonCta" :style="styleCta" />
  </div>
</template>

<style scoped></style>