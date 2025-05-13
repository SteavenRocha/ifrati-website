<script setup>
const props = defineProps({
    /* VALUES DATA */
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
        '--bg-color-values': bgColor ?? 'var(--background-color)',
        '--title-color-values': titleColor ?? 'var(--title-color)',
        '--text-color-values': textColor ?? 'var(--text-color)',
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
                '--bg-color-card': bgColorCard ?? 'var(--background-color)',
                '--title-color-card': titleColorCard ?? 'var(--title-color)',
                '--text-color-card': textColorCard ?? 'var(--text-color)',
            }">
                <!-- Iterar sobre las cards y mostrarlas -->
                <div v-for="(card, index) in cards" :key="card.id" class="card">
                    <div class="card__img">
                        <img :src="getResource(card.icon?.url).imageUrl" alt="card icon" class="card__icon" />
                    </div>
                    <div class="card__details">
                        <h2 class="card__title">{{ card.title }}</h2>
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
    background-color: var(--bg-color-values);
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

.title {
    color: var(--title-color-values);
}

.description {
    color: var(--text-color-values);
}

.card__container {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    gap: 20px;
}

.card {
    display: flex;
    flex-direction: column;
    background-color: var(--bg-color-card);
    border-radius: var(--border-radius-card);
    padding: 20px;
    gap: 20px;
    width: calc(33.3% - 20px);
    box-shadow: var(--box-shadow);
    border: 1px solid rgba(216, 216, 216, 0.7);
}

.card__details {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.card__img {
    width: 80px;
    height: 80px;
}

.card__title {
    color: var(--title-color-card);
}

.card__description {
    color: var(--text-color-card);
}
</style>