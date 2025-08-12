<script setup>
const props = defineProps({
    /* IMPORTANT DATA */
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

/* STYLOS */
const bgColor = props.style?.backgroundColor ?? null
const titleColor = props.style?.titleColor ?? null
const textColor = props.style?.textColor ?? null

/* STYLOS DE LA CARD */
const bgColorCard = props.card?.cardStyle?.backgroundColor ?? null
const titleColorCard = props.card?.cardStyle?.titleColor ?? null
const textColorCard = props.card?.cardStyle?.textColor ?? null
</script>

<template>
    <section :style="{
        /* COLORES DE LA SECCION */
        '--bg-color-important': bgColor ?? 'var(--background-color)',
        '--title-color-important': titleColor ?? 'var(--title-color)',
        '--text-color-important': textColor ?? 'var(--text-color)',
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

            <div class="card__section" :style="{
                /* COLORES DE LA SECCION */
                '--bg-color-card': bgColorCard ?? 'var(--background-color)',
                '--title-color-card': titleColorCard ?? 'var(--title-color)',
                '--text-color-card': textColorCard ?? 'var(--text-color)',
            }">
                <div class="card" v-for="cardItem in card?.card" :key="cardItem.id">
                    <div class="icon">
                        <img :src="getResource(cardItem.icon?.url).imageUrl"
                            :alt="cardItem.icon?.alternativeText || 'icon'" />
                    </div>

                    <div class="card__texts">
                        <h1 class="card__title">{{ cardItem.title }}</h1>
                        <p class="card__description">{{ cardItem.description }}</p>
                    </div>

                    <div class="list__card" v-if="cardItem.listCard">
                        <ul>
                            <li v-for="item in cardItem.listCard" :key="item.id">
                                <div class="bullet__item">
                                    <div class="bullet__icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path
                                                d="M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm8-10a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm5.46 7.46-1.42-1.42L11 13.1l-2.8-2.8-1.4 1.42 4.2 4.2 6.46-6.45Z" />
                                        </svg>
                                    </div>
                                    <span class="bullet__text">{{ item.text }}</span>
                                </div>
                            </li>
                        </ul>
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
    background-color: var(--bg-color-important);
    padding: var(--padding-section);
    scroll-margin-top: 40px;
}

.content {
    display: flex;
    flex-direction: column;
    margin: auto;
    max-width: var(--max-width);
    overflow: hidden;
    gap: 50px;
}

.pill__title {
    align-items: center;
}

.centered__texts .title {
    color: var(--title-color-important);
}

.centered__texts .description {
    color: var(--text-color-important);
}

.card__section {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.card {
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(185, 185, 185, 0.3);
    padding: 20px;
    border-radius: var(--border-radius-card);
    gap: 20px;
    background-color: var(--bg-color-card);
    width: calc(33.3% - 20px);
}

.card__texts {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.card__title {
    font-weight: 600;
    font-size: clamp(1.2rem, 3vw, 1.5rem);
    color: var(--title-color-card);
}

.card__description,
.bullet__text {
    font-weight: 350;
    line-height: 1.3;
    font-size: clamp(1rem, 3vw, 1rem);
    color: var(--text-color-card);
    display: flex;
    align-items: center;
}

.bullet__item {
    display: flex;
    gap: 10px;
}

.icon {
    width: 60px;
    background-color: rgba(141, 141, 141, 0.178);
    border-radius: 10px;
    padding: 10px;
    display: flex;
}

ul {
    list-style: none;
    padding-left: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

@media (max-width: 1024px) {
    .content {
        width: 80%;
    }

    .centered__texts {
        width: 100%;
    }

    .card {
        width: calc(50% - 20px);
    }
}

@media (max-width: 900px) {
    .card {
        width: 100%;
    }
}

@media (max-width: 640px) {
    .content {
        width: 100%;
    }
}
</style>