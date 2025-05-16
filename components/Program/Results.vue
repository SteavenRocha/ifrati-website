<script setup>
const props = defineProps({
    /* PURPOSE DATA */
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
    quantitative: {
        type: Object,
        required: true,
    },
    qualitative: {
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

/* STYLOS QUANTITATIVE CARD */
const bgColorQuan = props.quantitative?.cardStyle?.backgroundColor ?? null
const titleColorQuan = props.quantitative?.cardStyle?.titleColor ?? null
const textColorQuan = props.quantitative?.cardStyle?.textColor ?? null

/* STYLOS QUALITATIVE CARD */
const bgColorQual = props.qualitative?.cardStyle?.backgroundColor ?? null
const titleColorQual = props.qualitative?.cardStyle?.titleColor ?? null
const textColorQual = props.qualitative?.cardStyle?.textColor ?? null
</script>

<template>
    <section :style="{
        /* COLORES DE LA SECCION */
        '--bg-color-results': bgColor ?? 'var(--background-color)',
        '--title-color-results': titleColor ?? 'var(--title-color)',
        '--text-color-results': textColor ?? 'var(--text-color)',
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

            <div class="quantitative__results" :style="{
                /* COLORES DE LA SECCION */
                '--bg-color-quan': bgColorQuan ?? 'var(--background-color)',
                '--title-color-quan': titleColorQuan ?? 'var(--title-color)',
                '--text-color-quan': textColorQuan ?? 'var(--text-color)',
            }">
                <h1 class="quantitative__title"> {{ quantitative?.title }}</h1>

                <div class="card__container">
                    <div class="card__quan" v-for="(card, index) in quantitative.card" :key="card.id">
                        <div class="icon">
                            <img :src="getResource(card.resource?.url).imageUrl" alt="">
                        </div>
                        <div class="card__content">
                            <h1 class="card__title__quantitative">{{ card.title }}</h1>
                            <p class="card__description__quan" v-html="getTextFormated(card.description)"></p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="qualitative__results" :style="{
                /* COLORES DE LA SECCION */
                '--bg-color-qual': bgColorQual ?? 'var(--background-color)',
                '--title-color-qual': titleColorQual ?? 'var(--title-color)',
                '--text-color-qual': textColorQual ?? 'var(--text-color)',
            }">
                <h1 class="qualitative__title"> {{ qualitative?.title }}</h1>

                <div class="card__container">
                    <div class="card__qual" v-for="(card, index) in qualitative.card" :key="card.id">
                        <div class="image">
                            <img :src="getResource(card.resource?.url).imageUrl" alt="">
                        </div>
                        <div class="card__content__qual">
                            <h1 class="card__title__qualitative">{{ card.title }}</h1>
                            <p class="card__description__qual" v-html="getTextFormated(card.description)"></p>
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
    height: auto;
    background-color: var(--bg-color-results);
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

.texts {
    width: 100%;
    text-align: start;
}

.centered__texts .title {
    color: var(--title-color-results);
}

.centered__texts .description {
    color: var(--text-color-results);
}

.pill__title {
    display: flex;
    align-items: center;
}

.icon {
    width: 60px;
    padding: 10px;
    background-color: rgba(141, 141, 141, 0.178);
    border-radius: 10px;
    display: flex;
}

.quantitative__title,
.qualitative__title {
    font-weight: 600;
    font-size: clamp(1.2rem, 3vw, 1.5rem);
    text-align: center;
}

.quantitative__title {
    color: var(--title-color-results);
}

.qualitative__title {
    color: var(--title-color-results);
}

.card__container {
    display: flex;
    gap: 20px;
}

.card__quan {
    border-radius: var(--border-radius-card);
    padding: 20px;
    display: flex;
    gap: 10px;
    flex-direction: column;
    border: 1px solid rgba(185, 185, 185, 0.3);
}

.card__qual:hover .card__content__qual {
    opacity: 1;
    visibility: visible;
}

.image img {
    transition: filter 0.3s ease, transform 0.6s ease;
}

.card__qual:hover .image img {
    transform: scale(1.1);
    filter: brightness(35%);
}

.card__qual {
    background-color: var(--bg-color-qual);
    border-radius: var(--border-radius-card);
    overflow: hidden;
    position: relative;
    cursor: default;
    width: 100%;
    height: 350px;
}

.card__quan {
    background-color: var(--bg-color-quan);
}

.card__content__qual {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

.card__content {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.card__title__quantitative {
    font-size: clamp(2rem, 3vw, 3rem);
    font-weight: 800;
    color: var(--title-color-quan);
}

.card__description__quan,
.card__description__qual {
    font-size: clamp(1rem, 3vw, 1rem);
    font-weight: 350;
}

.card__description__quan {
    color: var(--text-color-quan);
}

.card__description__qual {
    color: var(--text-color-qual);
}

.quantitative__results,
.qualitative__results {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.card__title__qualitative {
    font-size: clamp(1.2rem, 3vw, 1.5rem);
    color: var(--title-color-qual);
}

.image {
    width: 100%;
    height: 100%;
}
</style>