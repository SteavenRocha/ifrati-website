<script setup>
import Hero from '~/components/Program/Hero.vue';
import Purpose from '~/components/Program/Purpose.vue';
import Pillars from '~/components/Program/Pillars.vue';
import Requirements from '~/components/Program/Requirements.vue';
import Results from '~/components/Program/Results.vue';
import Participate from '~/components/Program/Participate.vue';

const { data } = await useApi('program-page')

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

/********************* REQUIREMENTS SECTION *********************/
/* CONFIGURACION GLOBAL DEL REQUIREMENTS SECTION */
const requirements = data?.value?.data?.sections?.[3] ?? {}

/* DATOS DEL PURPOSE SECTION */
const titleRequirements = requirements?.title ?? '' // TITLE
const descriptionRequirements = requirements?.description ?? '' // DESCRIPTION
const pillRequirements = requirements?.pill ?? {} // PILL
const sideImageRequirements = requirements?.sideImage ?? {} // SIDEIMAGE
const requirementsComponent = requirements?.requirementsComponent ?? {} // REQUIREMENTS
const ctaRequirements = requirements?.cta ?? {} // REQUIREMENTS
const styleRequirements = requirements?.sectionStyle ?? {} // STYLES

/********************* RESULTS SECTION *********************/
/* CONFIGURACION GLOBAL DEL RESULTS SECTION */
const results = data?.value?.data?.sections?.[4] ?? {}

/* DATOS DEL PURPOSE SECTION */
const titleResults = results?.title ?? '' // TITLE
const descriptionResults = results?.description ?? '' // DESCRIPTION
const pillResults = results?.pill ?? {} // PILL
const quantitative = results?.quantitativeResults ?? {} // QUANTITATIVE
const qualitative = results?.qualitativeResults ?? {} // QUALITATIVE
const styleResults = results?.sectionStyle ?? {} // STYLES

/********************* PARTICIPATE SECTION *********************/
/* CONFIGURACION GLOBAL DEL PARTICIPATE SECTION */
const participate = data?.value?.data?.sections?.[5] ?? {}

/* DATOS DEL PURPOSE SECTION */
const titleParticipate = participate?.title ?? '' // TITLE
const descriptionParticipate = participate?.description ?? '' // DESCRIPTION
const pillParticipate = participate?.pill ?? {} // PILL
const steps = participate?.stepsSection ?? {} // STEPS
const collaborators = participate?.collaboratorsSection ?? {} // STEPS
const styleParticipate = participate?.sectionStyle ?? {} // STYLES

/********************* FAQS SECTION *********************/
/* CONFIGURACION GLOBAL DEL FAQ SECTION */
const faq = data?.value?.data?.sections?.[6] ?? {}

/* DATOS DEL HERO SECTION */
const titleFaq = faq.title ?? '' // TITLE
const descriptionFaq = faq?.description ?? '' // DESCRIPTION
const pillFaq = faq?.pill ?? {} // PILL
const questions = faq?.questions ?? [] // QUESTIONS
const styleFaq = faq?.sectionStyle ?? {} // STYLES

/********************* Contact SECTION *********************/
/* CONFIGURACION GLOBAL DEL CONTACT SECTION */
const contact = data?.value?.data?.sections?.[7] ?? {}

/* DATOS DEL CONTACT SECTION */
const titleContact = contact.title ?? '' // TITLE
const descriptionContact = contact?.description ?? '' // DESCRIPTION
const pillContact = contact?.pill ?? {} // PILL
const contactCard = contact?.contactCard ?? [] // CONTACT
const contactInformation = contact?.contactInformation ?? [] // INFORMATION
const styleContact = contact?.sectionStyle ?? {} // STYLES
</script>

<template>
  <div>
    <Hero :title="title" :description="description" :style="style" />

    <Purpose :title="titlePurpose" :description="descriptionPurpose" :pill="pillPurpose" :sideImage="sideImagePurpose"
      :style="stylePurpose" />

    <Pillars :title="titlePillars" :description="descriptionPillars" :pill="pillPillars" :pillarsCard="pillarsCard"
      :style="stylePillars" />

    <Requirements :title="titleRequirements" :description="descriptionRequirements" :pill="pillRequirements"
      :sideImage="sideImageRequirements" :requirements="requirementsComponent" :cta="ctaRequirements"
      :style="styleRequirements" />

    <Results :title="titleResults" :description="descriptionResults" :pill="pillResults" :quantitative="quantitative"
      :qualitative="qualitative" :style="styleResults" />

    <Participate :title="titleParticipate" :description="descriptionParticipate" :pill="pillParticipate" :steps="steps"
      :collaborators="collaborators" :style="styleParticipate" />

    <Faq :title="titleFaq" :description="descriptionFaq" :pill="pillFaq" :questions="questions" :style="styleFaq" />

    <Contact :title="titleContact" :description="descriptionContact" :pill="pillContact" :contactCard="contactCard"
      :contactInformation="contactInformation" :style="styleContact" />
  </div>
</template>

<style scoped></style>