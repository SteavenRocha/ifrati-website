<script setup>
import Hero from '~/components/Home/Hero.vue';
import About from '~/components/Home/About.vue';
import Program from '~/components/Home/Program.vue';
import Testimonies from '~/components/Home/Testimonies.vue';
import Brands from '~/components/Home/Brands.vue';
/*import Donate from '~/components/Home/Donate.vue';
import Choose from '~/components/Home/Choose.vue';
import Shop from '~/components/Home/Shop.vue';
import Faq from '~/components/Home/Faq.vue';
import Contact from '~/components/Home/Contact.vue';
import Social from '~/components/Home/Social.vue'; */

const { data } = await useApi('home-page')

/********************* HERO SECTION *********************/
/* CONFIGURACION GLOBAL DEL HERO SECTION */
const hero = data?.value?.data?.sections?.[0]?.hero ?? {}
/* CONFIGURACION GLOBAL DEL SOCIAL PROOF SECTION */
const social = data?.value?.data?.sections?.[0]?.socialProof ?? {}

/* DATOS DEL HERO SECTION */
const style = hero?.style ?? '' // STYLE
const title = hero.title ?? '' // TITLE
const description = hero?.description ?? '' // DESCRIPTION
const sideImage = hero?.sideImage ?? {} // SIDEIMAGE
const buttons = hero?.buttons ?? [] // BUTTONS
const styles = hero?.heroStyle ?? {} // STYLES

/* DATOS DEL SOCIAL PROOF SECTION */
const statistics = social?.statistics ?? [] // STATISTICS
const socialStyles = social?.statisticsStyle ?? {} // STYLES SOCIAL PROOF

/********************* ABOUT SECTION *********************/
/* CONFIGURACION GLOBAL DEL ABOUT SECTION */
const about = data?.value?.data?.sections?.[1] ?? {}

/* DATOS DEL ABOUT SECTION */
const titleAbout = about?.title ?? '' // TITLE
const descriptionAbout = about?.description ?? '' // DESCRIPTION
const pillAbout = about?.pill ?? {} // PILL
const buttonAbout = about?.button ?? {} // BUTTON
const sideImageAbout = about?.sideImage ?? {} // SIDEIMAGE
const stylesAbout = about?.sectionStyle ?? {} // STYLES

/********************* PROGRAM SECTION *********************/
/* CONFIGURACION GLOBAL DEL ABOUT SECTION */
const program = data?.value?.data?.sections?.[2] ?? {}

/* DATOS DEL PROGRAM SECTION */
const titleProgram = program?.program?.title ?? '' // TITLE
const descriptionProgram = program?.program?.description ?? '' // DESCRIPTION
const pillProgram = program?.program?.pill ?? {} // PILL
const buttonProgram = program?.program?.button ?? {} // BUTTON
const video = program?.program?.video ?? {} // VIDEO
const stylesProgram = program?.program?.sectionStyle ?? {} // STYLES MAIN PROGRAM

/* DATOS DEL HOW HELP SECTION */
const titleHowHelp = program?.howHelp?.title ?? '' // TITLE
const descriptionHowHelp = program?.howHelp?.description ?? '' // DESCRIPTION
const pillHowHelp = program?.howHelp?.pill ?? {} // PILL
const cards = program?.howHelp?.cardSection ?? {} // CARDS
const stylesHowHelp = program?.howHelp?.sectionStyle ?? {} // STYLES HOW HELP

/********************* TESTIMONIES SECTION *********************/
/* CONFIGURACION GLOBAL DEL TESTIMONIES SECTION */
const testimonies = data?.value?.data?.sections?.[3] ?? {}

/* DATOS DEL PROGRAM SECTION */
const titleTestimonies = testimonies?.title ?? '' // TITLE
const descriptionTestimonies = testimonies?.description ?? '' // DESCRIPTION
const pillTestimonies = testimonies?.pill ?? {} // PILL
const testimoniesCard = testimonies?.testimonialsSection ?? {} // DESCRIPTION
const stylesTestimonies = testimonies?.sectionStyle ?? {} // STYLES TESTIMONIES

/********************* BRANDS SECTION *********************/
/* CONFIGURACION GLOBAL DEL TESTIMONIES SECTION */
const brands = data?.value?.data?.sections?.[4] ?? {}

/* DATOS DEL PROGRAM SECTION */
const titleBrand = brands?.title ?? '' // TITLE
const pillBrand = brands?.pill ?? {} // PILL
const stylesBrands = brands?.sectionStyle ?? {} // STYLES TESTIMONIES
const brandsImgs = brands ?? [] // BRANDS
</script>

<template>
  <div>
    <Hero :style="style" :title="title" :description="description" :sideImage="sideImage" :buttons="buttons"
      :styles="styles" :statistics="statistics" :socialStyles="socialStyles" />

    <About :title="titleAbout" :description="descriptionAbout" :pill="pillAbout" :button="buttonAbout"
      :sideImage="sideImageAbout" :styles="stylesAbout" />

    <Program :title="titleProgram" :description="descriptionProgram" :pill="pillProgram" :button="buttonProgram"
      :video="video" :styles="stylesProgram" :titleHowHelp="titleHowHelp" :descriptionHowHelp="descriptionHowHelp"
      :pillHowHelp="pillHowHelp" :cards="cards" :stylesHowHelp="stylesHowHelp" />

    <Testimonies :title="titleTestimonies" :description="descriptionTestimonies" :pill="pillTestimonies"
      :card="testimoniesCard" :styles="stylesTestimonies" />

    <Brands :title="titleBrand" :pill="pillBrand" :styles="stylesBrands" :brands="brandsImgs" />

    <!--
    <Donate :title="titleDonate" :description="descriptionDonate" :cta="donateCTA" :styles="stylesDonate"/>

    <Choose :title="titleChoose" :description="descriptionChoose" :cards="chooseCard" :styles="stylesChoose"/>

    <Shop :title="titleShop" :description="descriptionShop" :component="productSection" :button="productButton" :styles="stylesShop"/>

    <Faq :title="titleFaq" :description="descriptionFaq" :component="faqComponent" :styles="stylesFaq"/> -->

    <!--  <Contact />

    <Social /> -->

  </div>

</template>

<style scoped></style>