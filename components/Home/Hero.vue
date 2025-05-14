<script setup>
/* OBTENER ESTADO DEL HEADER-UP */
const statusHeaderUp = statusHeaderUpStore()
const isActive = statusHeaderUp.isActive

const props = defineProps({
  /* HERO DATA */
  style: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  sideImage: {
    type: Object,
    required: true,
  },
  buttons: {
    type: Array,
    required: true,
  },
  styles: {
    type: Object,
    required: false,
  },

  /* SOCIAL PROOF DATA */
  statistics: {
    type: Array,
    required: false,
  },
  socialStyles: {
    type: Object,
    required: false,
  },
})
// FORMATEAR EL TITULO **
const formattedTitle = ref(getTextFormated(props.title))
const formattedDescription = ref(getTextFormated(props.description))

/* RECUPERAR LA SIDEIMAGE */
const imagePath = props.sideImage?.url ?? ''  // SIDEIMAGE
const { imageUrl: imageUrl } = getResource(imagePath)
const altImage = props.sideImage?.alternativeText ?? ''

/* STYLOS DEL HERO */
const bgPath = props.styles?.backgroundImage?.url ?? null
const { imageUrl: bgUrl } = getResource(bgPath)
const heroBgColor = props.styles?.backgroundColor ?? null
const heroTitleColor = props.styles?.titleColor ?? null
const heroTextColor = props.styles?.textColor ?? null

const heroBackgroundStyle = computed(() => {
  if (bgUrl) {
    return { backgroundImage: `url('${bgUrl}')` }
  } else if (heroBgColor) {
    return { backgroundColor: heroBgColor }
  } else {
    return { backgroundColor: 'var(--background-color)' }
  }
})

/* STYLOS DEL SOCIAL PROOF */
const statisticsBgColor = props.socialStyles?.backgroundColor ?? null
const statisticsTitleColor = props.socialStyles?.titleColor ?? null
const statisticsTextColor = props.socialStyles?.textColor ?? null

</script>

<template>
  <section :style="{
    '--header-height': isActive ? '110px' : '70px',
    paddingTop: 'var(--header-height)'
  }">
    <div :class="style" class="hero__bg" :style="{
      ...heroBackgroundStyle,
      '--title-color-hero': heroTitleColor ?? 'var(--title-color)',
      '--text-color-hero': heroTextColor ?? 'var(--text-color)',
    }">

      <div class="content__hero">
        <div class="left__content">
          <div class="texts">
            <h1 class="title" v-html="formattedTitle"></h1>
            <p class="description" v-html="formattedDescription"></p>
          </div>
          <div class="buttons">
            <Button v-for="button in buttons" :key="button.id" :text="button.text" :style="button.style"
              :href="button.href" :icon-url="getResource(button.icon?.url).imageUrl" />
          </div>
        </div>

        <div class="side__image" v-if="style === 'STYLE__1'">
          <img :src="imageUrl" :alt="altImage" />
        </div>
      </div>
    </div>

    <div class="social__proof__bg" :style="{
      /* COLORES DEL TITLE */
      '--bg-color-statistics': statisticsBgColor ?? 'var(--background-color)',
      '--title-color-statistics': statisticsTitleColor ?? 'var(--title-color)',
      '--text-color-statistics': statisticsTextColor ?? 'var(--text-color)',
    }">
      <div class="statistics">
        <div v-for="(stat, index) in statistics" :key="stat.id" class="statistics__item">
          <div class="icon">
            <img :src="getResource(stat.resource?.url).imageUrl" :alt="stat.resource?.alternativeText || 'Icono'" />
          </div>
          <div class="statistics__content">
            <div class="title">
              {{ stat.title }}
            </div>
            <div class="description">
              {{ stat.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: auto;
  position: relative;
}

.hero__bg {
  display: flex;
  height: 750px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 0 var(--padding-width);
}

.content__hero {
  display: flex;
  margin: 50px auto;
  margin-bottom: 120px;
  gap: 50px;
  max-width: var(--max-width);
}

.STYLE__1 .left__content,
.STYLE__2 .left__content,
.STYLE__3 .left__content,
.STYLE__4 .left__content {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto 0;
  gap: 40px;
}

.texts {
  margin: 0;
  width: 100%;
}

.STYLE__3 .left__content {
  width: 70%;
  justify-content: end;
}

.STYLE__4 .left__content {
  width: 70%;
  justify-content: center;
}

.STYLE__4 .content__hero {
  justify-content: center;
  align-items: center;
}

.STYLE__4 .content__hero .texts .title,
.STYLE__4 .content__hero .texts .description {
  text-align: center;
}

.STYLE__4 .buttons {
  justify-content: center;
}

.STYLE__1 .side__image {
  overflow: hidden;
  width: 50%;
  height: 100%;
  max-height: 450px;
  border-radius: var(--border-radius);
  margin: auto;
}

.STYLE__3 .texts .description {
  display: none;
}

.content__hero .texts .title {
  color: var(--title-color-hero);
  font-size: var(--font-size-hero);
  font-weight: 800;
  line-height: 1.125;
  text-align: start;
}

.content__hero .texts .description {
  color: var(--text-color-hero);
  text-align: start;
  font-size: var(--font-size-parrafo-hero);
}

.buttons {
  display: flex;
  gap: 10px;
}

/* SOCIAL PROOF */
.social__proof__bg {
  display: flex;
  height: 140px;
  justify-content: center;
  padding: 0 50px;
  position: absolute;
  bottom: -70px;
}

.statistics {
  display: flex;
  justify-content: center;
  gap: 50px;
  max-width: var(--max-width);
  background-color: var(--bg-color-statistics);
  border-radius: 20px;
  padding: 20px 20px;
  border: 1px solid var(--secondary-color);
}

.statistics__item {
  width: auto;
  display: flex;
  align-items: center;
  gap: 20px;
}

.statistics__item .icon {
  width: 100px;
  height: 100px;
}

.statistics__item .icon img {
  object-fit: contain;
}

.statistics__content .title {
  font-size: clamp(2rem, 3vw, 2.5rem);
  font-weight: 900;
  color: var(--title-color-statistics);
}

.statistics__content .description {
  font-size: var(--font-size--parrafo);
  color: var(--text-color-statistics);
}
</style>