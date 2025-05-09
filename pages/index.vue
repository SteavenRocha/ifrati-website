<script setup>
import Hero from '~/components/Home/Hero.vue';
import About from '~/components/Home/About.vue';
import Program from '~/components/Home/Program.vue';
import Testimonies from '~/components/Home/Testimonies.vue';
import Brands from '~/components/Home/Brands.vue';
import Donate from '~/components/Home/Donate.vue';
import Choose from '~/components/Home/Choose.vue';
import Shop from '~/components/Home/Shop.vue';
import Faq from '~/components/Home/Faq.vue';
import Contact from '~/components/Home/Contact.vue';
import Social from '~/components/Home/Social.vue';

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
const styles = hero?.heroStyles ?? {} // STYLES

/* DATOS DEL SOCIAL PROOF SECTION */
const statistics = social?.statistics ?? [] // STATISTICS
const socialStyles = social?.styles ?? {} // STYLES SOCIAL PROOF

/********************* ABOUT SECTION *********************/
/* CONFIGURACION GLOBAL DEL ABOUT SECTION */
const about = data?.value?.data?.sections?.[1] ?? {}

/* DATOS DEL ABOUT SECTION */
const titleAbout = about?.title ?? '' // TITLE
const descriptionAbout = about?.description ?? '' // DESCRIPTION
const buttonAbout = about?.button ?? [] // BUTTON
const sideImageAbout = about?.sideImage ?? {} // SIDEIMAGE
const stylesAbout = about?.styles ?? {} // STYLES

/********************* PROGRAM SECTION *********************/
/* CONFIGURACION GLOBAL DEL ABOUT SECTION */
const program = data?.value?.data?.sections?.[2] ?? {}

/* DATOS DEL PROGRAM SECTION */
const titleProgram = program?.mainProgram?.title ?? '' // TITLE
const descriptionProgram = program?.mainProgram?.description ?? '' // DESCRIPTION
const video = program?.mainProgram?.video ?? {} // VIDEO
const stylesProgram = program?.mainProgram?.sectionStyles ?? {} // STYLES MAIN PROGRAM

/* DATOS DEL HOW HELP SECTION */
const titleHowHelp = program?.howHelp?.title ?? '' // TITLE
const descriptionHowHelp = program?.howHelp?.description ?? '' // DESCRIPTION
const cards = program?.howHelp?.cards ?? {} // CARDS
const button = program?.howHelp?.button ?? [] // BUTTON
const stylesHowHelp = program?.howHelp?.sectionStyles ?? {} // STYLES HOW HELP

/********************* TESTIMONIES SECTION *********************/
/* CONFIGURACION GLOBAL DEL TESTIMONIES SECTION */
const testimonies = data?.value?.data?.sections?.[3] ?? {}

/* DATOS DEL PROGRAM SECTION */
const titleTestimonies = testimonies?.title ?? '' // TITLE
const descriptionTestimonies = testimonies?.description ?? '' // DESCRIPTION
const testimoniesCard = testimonies?.testimonies ?? {} // DESCRIPTION
const stylesTestimonies = testimonies?.sectionStyles ?? {} // STYLES TESTIMONIES

/********************* BRANDS SECTION *********************/
/* CONFIGURACION GLOBAL DEL TESTIMONIES SECTION */
const brands = data?.value?.data?.sections?.[4] ?? {}

/* DATOS DEL PROGRAM SECTION */
const titleBrands = brands?.title ?? '' // TITLE
const stylesBrands = brands?.sectionStyles ?? {} // STYLES TESTIMONIES
const brandsImgs = brands ?? [] // BRANDS

/********************* DONATE SECTION *********************/
/* CONFIGURACION GLOBAL DEL TESTIMONIES SECTION */
const donate = data?.value?.data?.sections?.[5] ?? {}

/* DATOS DEL DONATE SECTION */
const titleDonate = donate?.title ?? '' // TITLE
const descriptionDonate = donate?.description ?? '' // DESCRIPTION
const donateCTA = donate?.donateCTA ?? {} // DONATE COMPONENT
const stylesDonate = donate?.sectionStyles ?? {} // STYLES SECTION

/********************* CHOOSE SECTION *********************/
/* CONFIGURACION GLOBAL DEL CHOOSE SECTION */
const choose = data?.value?.data?.sections?.[6] ?? {}

/* DATOS DEL DONATE SECTION */
const titleChoose = choose?.title ?? '' // TITLE
const descriptionChoose = choose?.description ?? '' // DESCRIPTION
const chooseCard = choose?.chooseCard ?? [] // CHOOSE CARD
const stylesChoose = choose?.sectionStyles ?? {} // STYLES SECTION

/********************* SHOP SECTION *********************/
/* CONFIGURACION GLOBAL SHOP SECTION */
const shop = data?.value?.data?.sections?.[7] ?? {}

/* DATOS DEL SHOP SECTION */
const titleShop = shop?.title ?? '' // TITLE
const descriptionShop = shop?.description ?? '' // DESCRIPTION
const productSection = shop?.productSection ?? {} // PRODUCT SECTION
const productButton = shop?.button ?? [] // PRODUCT SECTION
const stylesShop = shop?.sectionStyles ?? {} // STYLES SECTION

/********************* FAQ SECTION *********************/
/* CONFIGURACION GLOBAL DEL FAQ SECTION */
const faq = data?.value?.data?.sections?.[8] ?? {}

/* DATOS DEL FAQ SECTION */
const titleFaq = faq?.title ?? '' // TITLE
const descriptionFaq = faq?.description ?? '' // DESCRIPTION
const faqComponent = faq?.faq ?? {} // FAQ COMPONENET
const stylesFaq = faq?.sectionStyles ?? {} // STYLES SECTION
</script>

<template>
  <div>
    <Hero :style="style" :title="title" :description="description" :sideImage="sideImage"
      :buttons="buttons" :styles="styles" :statistics="statistics" :socialStyles="socialStyles"/>

    <About :title="titleAbout" :description="descriptionAbout" :button="buttonAbout" :sideImage="sideImageAbout"
      :styles="stylesAbout"/>

    <Program :title="titleProgram" :description="descriptionProgram" :video="video" :styles="stylesProgram"
      :titleHowHelp="titleHowHelp" :descriptionHowHelp="descriptionHowHelp" :cards="cards" :button="button"
      :stylesHowHelp="stylesHowHelp"/>

    <Testimonies :title="titleTestimonies" :description="descriptionTestimonies" :card="testimoniesCard" :styles="stylesTestimonies"/>

    <Brands :title="titleBrands" :styles="stylesBrands" :brands="brandsImgs"/>

    <Donate :title="titleDonate" :description="descriptionDonate" :cta="donateCTA" :styles="stylesDonate"/>

    <Choose :title="titleChoose" :description="descriptionChoose" :cards="chooseCard" :styles="stylesChoose"/>

    <Shop :title="titleShop" :description="descriptionShop" :component="productSection" :button="productButton" :styles="stylesShop"/>

    <Faq :title="titleFaq" :description="descriptionFaq" :component="faqComponent" :styles="stylesFaq"/>

   <!--  <Contact />

    <Social /> -->

  </div>

</template>

<style scoped></style>