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

const sections = data?.value?.data?.sections ?? []

const hero = sections.find(s => s.__component === 'program-blocks.hero-section') ?? {}
const purpose = sections.find(s => s.__component === 'program-blocks.purpose-section') ?? null
const pillars = sections.find(s => s.__component === 'program-blocks.pillars-section') ?? {}
const requirements = sections.find(s => s.__component === 'program-blocks.requirements-section') ?? {}
const results = sections.find(s => s.__component === 'program-blocks.results-section') ?? {}
const participate = sections.find(s => s.__component === 'program-blocks.participate-section') ?? {}
const faq = sections.find(s => s.__component === 'blocks.faq-section') ?? {}
const contact = sections.find(s => s.__component === 'blocks.contact-section') ?? {}

/********************* HERO SECTION *********************/
/* DATOS DEL HERO SECTION */
const title = hero.title ?? '' // TITLE
const description = hero?.description ?? '' // DESCRIPTION
const style = hero?.heroStyle ?? {} // STYLES

/********************* PURPOSE SECTION *********************/
/* DATOS DEL PURPOSE SECTION */
const titlePurpose = purpose?.title ?? '' // TITLE
const descriptionPurpose = purpose?.description ?? '' // DESCRIPTION
const pillPurpose = purpose?.pill ?? {} // PILL
const sideImagePurpose = purpose?.sideImage ?? {} // SIDEIMAGE
const stylePurpose = purpose?.sectionStyle ?? {} // STYLES

/********************* PILLARS SECTION *********************/
/* DATOS DEL PILLARS SECTION */
const titlePillars = pillars?.title ?? '' // TITLE
const descriptionPillars = pillars?.description ?? '' // DESCRIPTION
const pillPillars = pillars?.pill ?? {} // PILL
const pillarsCard = pillars?.pillars ?? {} // SIDEIMAGE
const stylePillars = pillars?.sectionStyle ?? {} // STYLES

/********************* REQUIREMENTS SECTION *********************/
/* DATOS DEL PURPOSE SECTION */
const titleRequirements = requirements?.title ?? '' // TITLE
const descriptionRequirements = requirements?.description ?? '' // DESCRIPTION
const pillRequirements = requirements?.pill ?? {} // PILL
const sideImageRequirements = requirements?.sideImage ?? {} // SIDEIMAGE
const requirementsComponent = requirements?.requirementsComponent ?? {} // REQUIREMENTS
const ctaRequirements = requirements?.cta ?? {} // REQUIREMENTS
const styleRequirements = requirements?.sectionStyle ?? {} // STYLES

/********************* RESULTS SECTION *********************/
/* DATOS DEL PURPOSE SECTION */
const titleResults = results?.title ?? '' // TITLE
const descriptionResults = results?.description ?? '' // DESCRIPTION
const pillResults = results?.pill ?? {} // PILL
const quantitative = results?.quantitativeResults ?? {} // QUANTITATIVE
const qualitative = results?.qualitativeResults ?? {} // QUALITATIVE
const styleResults = results?.sectionStyle ?? {} // STYLES

/********************* PARTICIPATE SECTION *********************/
/* DATOS DEL PURPOSE SECTION */
const titleParticipate = participate?.title ?? '' // TITLE
const descriptionParticipate = participate?.description ?? '' // DESCRIPTION
const pillParticipate = participate?.pill ?? {} // PILL
const steps = participate?.stepsSection ?? {} // STEPS
const collaborators = participate?.collaboratorsSection ?? {} // STEPS
const styleParticipate = participate?.sectionStyle ?? {} // STYLES

/********************* FAQS SECTION *********************/
/* DATOS DEL HERO SECTION */
const titleFaq = faq.title ?? '' // TITLE
const descriptionFaq = faq?.description ?? '' // DESCRIPTION
const pillFaq = faq?.pill ?? {} // PILL
const questions = faq?.questions ?? [] // QUESTIONS
const styleFaq = faq?.sectionStyle ?? {} // STYLES

/********************* Contact SECTION *********************/
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
    <!-- HERO siempre se asume que existe -->
    <Hero v-if="hero" :title="title" :description="description" :style="style" />

    <!-- PURPOSE -->
    <Purpose v-if="purpose" :title="titlePurpose" :description="descriptionPurpose" :pill="pillPurpose"
      :sideImage="sideImagePurpose" :style="stylePurpose" />

    <!-- PILLARS -->
    <Pillars v-if="pillars && Object.keys(pillars).length" :title="titlePillars" :description="descriptionPillars"
      :pill="pillPillars" :pillarsCard="pillarsCard" :style="stylePillars" />

    <!-- REQUIREMENTS -->
    <Requirements v-if="requirements && Object.keys(requirements).length" :title="titleRequirements"
      :description="descriptionRequirements" :pill="pillRequirements" :sideImage="sideImageRequirements"
      :requirements="requirementsComponent" :cta="ctaRequirements" :style="styleRequirements" />

    <!-- RESULTS -->
    <Results v-if="results && Object.keys(results).length" :title="titleResults" :description="descriptionResults"
      :pill="pillResults" :quantitative="quantitative" :qualitative="qualitative" :style="styleResults" />

    <!-- PARTICIPATE -->
    <Participate v-if="participate && Object.keys(participate).length" :title="titleParticipate"
      :description="descriptionParticipate" :pill="pillParticipate" :steps="steps" :collaborators="collaborators"
      :style="styleParticipate" />

    <!-- FAQ -->
    <Faq v-if="faq && Object.keys(faq).length" :title="titleFaq" :description="descriptionFaq" :pill="pillFaq"
      :questions="questions" :style="styleFaq" />

    <!-- CONTACT -->
    <Contact v-if="contact && Object.keys(contact).length" :title="titleContact" :description="descriptionContact"
      :pill="pillContact" :contactCard="contactCard" :contactInformation="contactInformation" :style="styleContact" />
  </div>
</template>

<style scoped></style>