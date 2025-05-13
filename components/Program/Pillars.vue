<script setup>
const props = defineProps({
    /* PILLARS DATA */
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
    pillarsCard: {
        type: Object,
        required: true,
    },
    style: {
        type: Object,
        required: false,
    },
})

// FORMATEAR EL TITULO Y DESCRIPTION
const formattedTitle = ref(getTextFormated(props.title))
const formattedDescription = ref(getTextFormated(props.description))

// RECUPERAMOS STYLOS DE LA PILL
const bgColorPill = props.pill?.pillStyle?.backgroundColor ?? 'var(--pill-bg-color)'
const textColorPill = props.pill?.pillStyle?.textColor ?? 'var(--pill-text-color)'

// RECUPERAR LA PILLARS CARD
const cards = props.pillarsCard?.pillarCard ?? []

// STYLOS
const bgColor = props.style?.backgroundColor ?? null
const titleColor = props.style?.titleColor ?? null
const textColor = props.style?.textColor ?? null

// STYLOS DE LA CARD
const bgColorCard = props.pillarsCard?.cardStyle?.backgroundColor ?? null
const titleColorCard = props.pillarsCard?.cardStyle?.titleColor ?? null
const textColorCard = props.pillarsCard?.cardStyle?.textColor ?? null

// LOGICA PARA LA SELECCION DE CARDS
// ID de la card seleccionada
const selectedCardId = ref(null)
// Seleccionar la primera card por defecto
if (cards.length > 0 && !selectedCardId.value) {
    selectedCardId.value = cards[0].id
}
// Cuando se hace clic en una card, se actualiza el ID
const selectCard = (id) => {
    selectedCardId.value = id
}
// Card seleccionada completa
const selectedCard = computed(() =>
    cards.find((card) => card.id === selectedCardId.value)
)
</script>

<template>
    <section :style="{
        '--bg-color-pillars': bgColor ?? 'var(--background-color)',
        '--title-color-pillars': titleColor ?? 'var(--title-color)',
        '--text-color-pillars': textColor ?? 'var(--text-color)',
    }" id="pillars">
        <div class="content">
            <div class="centered__texts">
                <div class="pill__title">
                    <Pill :key="pill.id" :text="pill.text" :icon-url="getResource(pill.icon?.url).imageUrl"
                        :bgColor="bgColorPill" :textColor="textColorPill" />
                    <h1 class="title" v-html="formattedTitle"></h1>
                </div>
                <p class="description" v-html="formattedDescription"></p>
            </div>

            <div class="pillars" :style="{
                '--bg-color-card': bgColorCard ?? 'var(--background-color)',
                '--title-color-card': titleColorCard ?? 'var(--title-color)',
                '--text-color-card': textColorCard ?? 'var(--text-color)',
            }">
                <div class="pillars__row">
                    <div v-if="cards" v-for="card in cards" :key="card.id" class="pillar__item__title"
                        @click="selectCard(card.id)" :class="{ active: selectedCardId === card.id }">
                        <div class="icon">
                            <img :src="getResource(card.icon?.url).imageUrl" alt="">
                        </div>
                        <h1 class="item__title">{{ card.title }}</h1>
                    </div>
                </div>

                <transition name="fade-slide" mode="out-in">
                    <div class="pillar__container" v-if="selectedCard" :key="selectedCard.id"
                        :id="'pillar-' + selectedCard.id">
                        <div class="pillar__content">
                            <div class="pillar__title__content">
                                <div class="icon">
                                    <img :src="getResource(selectedCard.icon?.url).imageUrl" alt="">
                                </div>
                                <h2 class="title__content">{{ selectedCard.title }}</h2>
                            </div>

                            <p class="description__content" v-html="getTextFormated(selectedCard.description)"></p>

                            <div v-if="selectedCard.programComponent?.textComponent?.length" class="component__content">
                                <h3 class="title__component">{{ selectedCard.programComponent.title }}</h3>
                                <ul class="custom__list">
                                    <li v-for="(item, index) in selectedCard.programComponent.textComponent"
                                        :key="item.id">
                                        <div class="bullet__icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                fill="currentColor">
                                                <path
                                                    d="M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm8-10a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm5.46 7.46-1.42-1.42L11 13.1l-2.8-2.8-1.4 1.42 4.2 4.2 6.46-6.45Z" />
                                            </svg>
                                        </div>
                                        <p class="description__componenet">{{ item.text }}</p>
                                    </li>
                                </ul>
                            </div>

                            <div class="methodology__content">
                                <h3 class="title__component">{{ selectedCard.methodology.title }}</h3>
                                <p class="description__componenet">{{ selectedCard.methodology.description }}</p>
                            </div>
                        </div>
                        <div class="side__image">
                            <img :src="getResource(selectedCard.sideImage?.url).imageUrl" alt="">
                        </div>
                    </div>
                </transition>
            </div>
        </div>
    </section>
</template>

<style scoped>
section {
    display: flex;
    height: auto;
    background-color: var(--bg-color-pillars);
    padding: var(--padding-section);
    scroll-margin-top: 110px;
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

.title {
    color: var(--title-color-pillars);
}

.description {
    color: var(--text-color-pillars);
}

.pillars {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.pillars__row {
    display: flex;
    justify-content: space-between;
    background-color: var(--bg-color-card);
    padding: 10px;
    border-radius: var(--border-radius-card);
    gap: 10px;
    box-shadow: var(--box-shadow);
}

.pillar__item__title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background-color: whitesmoke;
    padding: 10px;
    border-radius: 10px;
    width: 100%;
    cursor: pointer;
    transition: box-shadow 0.3s ease, border 0.3s ease;
    border: 1px solid rgb(214, 214, 214);
}

.pillar__item__title:hover .item__title {
    color: var(--primary-color);
}

.pillar__item__title:hover {
    border: 1px solid var(--primary-color);
}

.pillar__item__title.active .item__title {
    color: var(--primary-color);
}

.pillar__item__title.active {
    border: 1px solid var(--primary-color);
    box-shadow: inset 3px 0 0 var(--primary-color), var(--box-shadow);
}

.icon {
    width: 35px;
    display: flex;
    align-items: center;
}

.item__title {
    width: auto;
    display: flex;
    align-items: center;
    font-size: clamp(1rem, 3vw, 1.1rem);
    font-weight: 400;
    transition: color 0.3s ease;
}

.title__content {
    font-weight: 500;
    font-size: clamp(1.2rem, 3vw, 1.5rem);
}

.title__content,
.title__component,
.item__title {
    color: var(--title-color-card);
}

.title__component {
    font-size: clamp(1rem, 3vw, 1.1rem);
    font-weight: 500;
}

.description__content,
.description__componenet {
    color: var(--text-color-card);
    font-size: clamp(1rem, 3vw, 1.1rem);
    font-weight: 350;
    line-height: 1.3;
}

.component__content {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.custom__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

li {
    display: flex;
    gap: 5px;
}

.icon img {
    object-fit: contain;
}

.bullet__icon {
    width: 20px;
    color: var(--primary-color);
}

.pillar__container {
    display: flex;
    gap: 15px;
}

.pillar__content {
    box-shadow: var(--box-shadow);
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: var(--bg-color-card);
    padding: 30px;
    border-radius: var(--border-radius-card);
}

.pillar__title__content {
    display: flex;
    gap: 10px;
    align-items: center;
}

.methodology__content {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

ul {
    list-style: none;
    padding-left: 0;
}

li {
    display: flex;
}

.side__image {
    max-height: 100%;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateX(50px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
    opacity: 1;
    transform: translateX(0);
}
</style>