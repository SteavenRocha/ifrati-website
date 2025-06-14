<script setup>
const props = defineProps({
    /* TESTIMONIES DATA */
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    pill: {
        type: Object,
        required: true,
    },
    card: {
        type: Object,
        required: true,
    },
    styles: {
        type: Object,
        required: true,
    },
})

// FORMATEAR EL TITULO Y DESCRIPTION **
const formattedTitle = ref(getTextFormated(props.title))
const formattedDescription = ref(getTextFormated(props.description))

/* RECUPERAMOS STYLOS DE LA PILL */
const bgColorPill = props.pill?.pillStyle?.backgroundColor ?? 'var(--pill-bg-color)'
const textColorPill = props.pill?.pillStyle?.textColor ?? 'var(--pill-text-color)'

/* STYLOS */
const bgColor = props.styles?.backgroundColor ?? null
const titleColor = props.styles?.titleColor ?? null
const textColor = props.styles?.textColor ?? null

/* STYLOS DE LA CARD*/
const bgColorCard = props.card?.cardStyle?.backgroundColor ?? null
const titleColorCard = props.card?.cardStyle?.titleColor ?? null
const textColorCard = props.card?.cardStyle?.textColor ?? null

/* OBTNER CANTIDAD DE CARDS ACTIVAS */
const activeCardsCount = props.card?.testimonies.filter(t => t.statuS).length
/* OBTNER CANTIDAD DE CARDS VISIBLES */
const visibleCards = ref(3)

function updateVisibleCards() {
    const width = window.innerWidth
    if (width < 640) {
        visibleCards.value = 1
    } else if (width < 1024) {
        visibleCards.value = 2
    } else {
        visibleCards.value = 3
    }
}

onMounted(() => {
    updateVisibleCards()
    window.addEventListener('resize', updateVisibleCards)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateVisibleCards)
})
</script>

<template>
    <section :style="{
        /* COLORES DE LA SECCION */
        '--bg-color-testimonies': bgColor ?? 'var(--background-color)',
        '--title-color-testimonies': titleColor ?? 'var(--title-color)',
        '--text-color-testimonies': textColor ?? 'var(--text-color)',
    }">
        <div class="content">
            <div class="centered__texts">
                <div class="pill__title">
                    <Pill :key="pill.id" :text="pill.text" :icon-url="getResource(pill.icon?.url).imageUrl"
                        :bgColor="bgColorPill" :textColor="textColorPill" />
                    <h1 class="title" v-html="formattedTitle"></h1>
                </div>
                <p class="description" v-html="formattedDescription"></p>
            </div>

            <Slider id="testimoniesSlider" :totalCards=activeCardsCount :visibleCards=visibleCards :style="{
                /* COLORES DE LA SECCION */
                '--bg-color-card': bgColorCard ?? 'var(--background-color)',
                '--title-color-card': titleColorCard ?? 'var(--title-color)',
                '--text-color-card': textColorCard ?? 'var(--text-color)',
            }">
                <div class="card__section" v-for="(item, index) in card.testimonies.filter(t => t.statuS)" :key="index">
                    <div class="card__header">
                        <div class="image">
                            <img :src="getResource(item.image?.url).imageUrl" alt="">
                        </div>
                        <div class="data">
                            <h3 class="name">{{ item.name }}</h3>
                            <p class="description">{{ item.description }}</p>
                        </div>
                    </div>
                    <div class="card__content">
                        <svg xmlns="http://www.w3.org/2000/svg" width="133.34" height="128" viewBox="0 0 25 24">
                            <path fill="currentColor"
                                d="m7.45 18.18-.32-.68za.75.75 0 0 1-1.07-.68v-2.56a4.63 4.63 0 0 1 .75-9.19 4.63 4.63 0 0 1 4.62 4.63c0 2.84-1.05 4.8-2.12 6.03a8 8 0 0 1-1.47 1.33 6 6 0 0 1-.64.4l-.05.03h-.01zM4 10.38c0 1.72 1.4 3.12 3.13 3.12a.75.75 0 0 1 .75.75v1.81a7.47 7.47 0 0 0 2.38-5.68 3.13 3.13 0 0 0-6.26 0m14.2 7.8-.32-.68za.75.75 0 0 1-1.07-.68v-2.56a4.63 4.63 0 0 1 .75-9.19 4.63 4.63 0 0 1 4.62 4.63c0 2.84-1.05 4.8-2.12 6.03a8 8 0 0 1-1.47 1.33 6 6 0 0 1-.69.43h-.01zm-3.45-7.8c0 1.72 1.4 3.12 3.13 3.12a.75.75 0 0 1 .75.75v1.81A7.47 7.47 0 0 0 21 10.38a3.13 3.13 0 0 0-6.26 0" />
                        </svg>
                        <p class="testimony">
                            {{ item.testimony }}
                        </p>
                    </div>
                </div>
            </Slider>
        </div>
    </section>
</template>

<style scoped>
section {
    display: flex;
    height: auto;
    background-color: var(--bg-color-testimonies);
    padding: var(--padding-section);
}

.content {
    display: flex;
    flex-direction: column;
    margin: auto;
    max-width: var(--max-width);
    gap: 80px;
}

.pill__title {
    align-items: center;
}

.centered__texts .title {
    color: var(--title-color-testimonies);
}

.centered__texts .description {
    color: var(--text-color-testimonies);
}

.card__section {
    border: 1px solid rgba(185, 185, 185, 0.3);
    border-radius: 15px;
    overflow: hidden;
    /* background-color: var(--bg-color-card); */
    display: flex;
    flex-direction: column;
}

.card__header {
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: var(--bg-color-card);
    padding: 25px 30px;
}

.card__content {
    padding: 30px;
    background-color: white;
    height: 100%;
}

.image {
    max-width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
}

.data {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.name {
    font-size: clamp(1rem, 3vw, 1.4rem);
    font-weight: 600;
    color: var(--title-color-card);
}

.data .description {
    font-weight: 300;
    color: var(--title-color-card);
}

.testimony {
    padding-left: 50px;
    color: var(--text-color-card);
    line-height: 1.3;
}

.card__content svg {
    width: 60px;
    color: var(--primary-color);
    transform: rotate(180deg);
    opacity: 0.3;
}

@media (max-width: 1024px) {
    .centered__texts {
        width: 80%;
    }
}

@media (max-width: 600px) {
    .centered__texts {
        width: 100%;
    }
}
</style>