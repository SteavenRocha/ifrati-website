<script setup>
const props = defineProps({
    /* TEAM DATA */
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
    style: {
        type: Object,
        required: false,
    },
})

// FORMATEAR EL TITULO Y DESCRIPTION **
const formattedTitle = ref(getTextFormated(props.title))
const formattedDescription = ref(getTextFormated(props.description))

/* RECUPERAMOS STYLOS DE LA PILL */
const bgColorPill = props.pill?.pillStyle?.backgroundColor ?? 'var(--pill-bg-color)'
const textColorPill = props.pill?.pillStyle?.textColor ?? 'var(--pill-text-color)'

/* RECUPERAR LA CARD */
const cards = props.card?.card ?? []
/* STYLOS DE LA CARD */
const bgColorCard = props.card?.cardStyle?.backgroundColor ?? null
const titleColorCard = props.card?.cardStyle?.titleColor ?? null
const textColorCard = props.card?.cardStyle?.textColor ?? null

/* STYLOS */
const bgColor = props.style?.backgroundColor ?? null
const titleColor = props.style?.titleColor ?? null
const textColor = props.style?.textColor ?? null
</script>

<template>
    <section :style="{
        /* COLORES DE LA SECCION */
        '--bg-color-team': bgColor ?? 'var(--background-color)',
        '--title-color-team': titleColor ?? 'var(--title-color)',
        '--text-color-team': textColor ?? 'var(--text-color)',
    }">
        <div class="content">
            <div class="centered__texts">
                <div class="pill__title">
                    <Pill :key="pill.id" :text="pill.text" :icon-url="getResource(pill.icon?.url).imageUrl"
                        :bgColor="bgColorPill" :textColor="textColorPill" />
                    <h1 class="title" v-html="formattedTitle"></h1>
                </div>
                <p v-if="props.description" class="description" v-html="formattedDescription"></p>
            </div>

            <div class="card__container" :style="{
                /* COLORES DE LA SECCION */
                '--title-color-card': titleColorCard ?? 'var(--title-color)',
                '--text-color-card': textColorCard ?? 'var(--text-color)',
            }">
                <div v-for="(card, index) in cards" :key="card.id" class="card" :style="{
                    backgroundColor: bgColorCard ?? 'transparent',
                    padding: bgColorCard ? '20px' : '0px'
                }">
                    <div class="card__img">
                        <img :src="getResource(card.image?.url).imageUrl" alt="card image" class="card__image" />
                    </div>
                    <div class="card__details">
                        <div class="card__title__content">
                            <h1 class="card__title">{{ card.title }}</h1>
                            <h2 v-if="card.subTitle" class="card__subTitle">{{ card.subTitle }}</h2>
                        </div>
                        <p class="card__description">{{ card.description }}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
section {
    display: flex;
    height: auto;
    background-color: var(--bg-color-team);
    padding: var(--padding-section);
    scroll-margin-top: 40px;
}

.content {
    display: flex;
    flex-direction: column;
    margin: auto;
    max-width: var(--max-width);
    gap: 50px;
}

.pill__title {
    align-items: center;
}

.centered__texts {
    width: 100%;
}

.title {
    color: var(--title-color-team);
}

.description {
    color: var(--text-color-team);
}

.card__container {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 20px;
    row-gap: 50px;
}

.card__container .card {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: var(--border-radius-card);
    gap: 20px;
}

/* 4-card row */
.card__container .card:nth-child(7n + 1),
.card__container .card:nth-child(7n + 2),
.card__container .card:nth-child(7n + 3),
.card__container .card:nth-child(7n + 4) {
    grid-column: span 3;
}

.card__container .card:nth-child(7n + 5) {
    grid-column: 2 / span 3;
}

.card__container .card:nth-child(7n + 6) {
    grid-column: 5 / span 3;
}

.card__container .card:nth-child(7n + 7) {
    grid-column: 8 / span 3;
}

.card__details {
    display: flex;
    flex-direction: column;
    gap: 15px;
    text-align: center;
}

.card__title__content {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.card__img {
    background-color: rgba(0, 0, 0, 0.05);
    overflow: hidden;
    border-radius: 50%;
    width: 180px;
    height: 180px;
}

.card__title {
    font-size: 1.3rem;
    color: var(--title-color-card);
}

.card__subTitle {
    color: var(--title-color-card);
    font-weight: 450;
}

.card__description {
    color: var(--text-color-card);
}

@media (max-width: 1024px) {
    .content {
        width: 80%;
    }
}

@media (max-width: 640px) {
    .content {
        width: 100%;
    }
}
</style>