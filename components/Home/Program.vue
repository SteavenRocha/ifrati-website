<script setup>
const props = defineProps({
    /* PROGRAM DATA */
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    video: {
        type: Object,
        required: true,
    },
    styles: {
        type: Object,
        required: true,
    },

    /* HOW HELP DATA */
    titleHowHelp: {
        type: String,
        required: true,
    },
    descriptionHowHelp: {
        type: String,
        required: true,
    },
    cards: {
        type: Object,
        required: true,
    },
    button: {
        type: Array,
        required: true,
    },
    stylesHowHelp: {
        type: Object,
        required: true,
    },
})

// FORMATEAR EL TITULO Y DESCRIPTION ** DEL MAIN PROGRAM
const formattedTitle = ref(getTextFormated(props.title))
const formattedDescription = ref(getTextFormated(props.description))

/* RECUPERAR EL VIDEO / VIDEOLINK */
const videoPath = props.video?.video?.url ?? ''  // VIDEO
const { imageUrl: videoUrl } = getResource(videoPath)
const altVideo = props.video?.video?.alternativeText ?? ''
const videoDescription = props.video?.videoDescription ?? ''

/* STYLOS DEL MAIN PROGRAM */
const bgColor = props.styles?.backgroundColor?.color ?? null
const titleColor = props.styles?.titleColor?.color ?? null
const textColor = props.styles?.textColor?.color ?? null

// FORMATEAR EL TITULO Y DESCRIPTION ** DEL HOW HELP PROGRAM
const formattedTitleHowHelp = ref(getTextFormated(props.titleHowHelp))
const formattedDescriptionHowHelp = ref(getTextFormated(props.descriptionHowHelp))

// RECUPERAR LAS CARDS
const card = props.cards?.card ?? []

/* STYLOS DE LAS CARDS */
const bgColorCard = props.cards?.cardStyles?.backgroundColor?.color ?? null
const titleColorCard = props.cards?.cardStyles?.titleColor?.color ?? null
const textColorCard = props.cards?.cardStyles?.textColor?.color ?? null

/* STYLOS HOW HELP SECTION */
const bgColorHowHelp = props.stylesHowHelp?.backgroundColor?.color ?? null
const titleColorHowHelp = props.stylesHowHelp?.titleColor?.color ?? null
const textColorHowHelp = props.stylesHowHelp?.textColor?.color ?? null

/* OBTENER URL DEL ICON DEL BOTON DE LA CARD*/
const iconPaht = props.cards?.cardButton[0]?.icon?.url ?? ''
const iconUrl = getResource(iconPaht).imageUrl

const { svgHtml, loadSvg } = getSvgHtml()
onMounted(() => {
    if (iconUrl) loadSvg(iconUrl)
})

</script>

<template>
    <section id="program">
        <div class="content__bg" :style="{
            /* COLORES DE LA SECCION */
            '--bg-color-program': bgColor ?? 'var(--background-color)',
            '--title-color-program': titleColor ?? 'var(--title-color)',
            '--text-color-program': textColor ?? 'var(--text-color)',
        }">
            <div class="content">
                <div class="texts">
                    <h1 class="title" v-html="formattedTitle"></h1>
                    <p class="description" v-html="formattedDescription"></p>
                </div>

                <div class="video__content">
                    <div class="video">
                        <video :src="videoUrl" :alt="altVideo" @click="openModal" muted playsinline></video>
                    </div>
                    <p class="video__description">
                        {{ videoDescription }}
                    </p>
                </div>
            </div>
        </div>
    </section>

    <section>
        <div class="how__help__bg" :style="{
            /* COLORES DE LA SECCION */
            '--bg-color-how-help': bgColorHowHelp ?? 'var(--background-color)',
            '--title-color-how-help': titleColorHowHelp ?? 'var(--title-color)',
            '--text-color-how-help': textColorHowHelp ?? 'var(--text-color)',
        }">
            <div class="how__help__content">
                <div class="sub__texts">
                    <h1 class="title" v-html="formattedTitleHowHelp"></h1>
                    <p class="description" v-html="formattedDescriptionHowHelp"></p>
                </div>

                <div class="cards" :style="{
                    /* COLORES DE LAS CARDS */
                    '--bg-color-card': bgColorCard ?? 'var(--background-color)',
                    '--title-color-card': titleColorCard ?? 'var(--title-color)',
                    '--text-color-card': textColorCard ?? 'var(--text-color)',
                }">
                    <div class="card" v-for="item in card" :key="item.id">
                        <div class="image">
                            <img :src="getResource(item.image?.url).imageUrl"
                                :alt="item.image?.alternativeText || 'imagen de tarjeta'" />
                        </div>
                        <div class="card__details">
                            <div class="card__content">
                                <div class="card__title__group">
                                    <div class="primary__icon">
                                        <img :src="getResource(item.icon?.url).imageUrl"
                                            :alt="item.image?.alternativeText || 'icono de tarjeta'" />
                                    </div>
                                    <h1 class="card__title">{{ item.title }}</h1>
                                </div>
                                <p v-if="item.description" class="card__description">{{ item.description }}</p>
                            </div>
                            <a v-if="cards.cardButton?.length" :href="cards.cardButton[0].href" class="card__button"
                                :target="cards.cardButton[0].isExternal ? '_blank' : '_self'" rel="noopener noreferrer">
                                {{ cards.cardButton[0].label }}

                                <span class="icon" v-if="svgHtml" v-html="svgHtml" />
                            </a>
                        </div>
                    </div>
                </div>

                <Button v-for="button in button" :key="button.id" :text="button.text" :style="button.style"
                    :href="button.href" :icon-url="getResource(button.icon?.url).imageUrl" />
            </div>
        </div>
    </section>
</template>

<style scoped>
section {
    display: flex;
    flex-direction: column;
    height: auto;
}

.content__bg {
    padding: var(--padding-section);
    background-color: var(--bg-color-program);
}

.content,
.how__help__content {
    display: flex;
    margin: auto;
    align-items: center;
    max-width: var(--max-width);
    gap: 50px;
}

.how__help__content {
    flex-direction: column;
}

.video__content {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.video__description {
    text-align: center;
    font-size: 0.8rem;
    color: var(--text-color-program);
}

.video {
    border-radius: var(--border-radius);
    overflow: hidden;
    width: 100%;
    height: auto;
}

.texts {
    width: 100%;
    text-align: start;
}

.content .texts .title {
    color: var(--title-color-program);
}

.content .texts .description {
    color: var(--text-color-program);
}

h3 {
    font-weight: 600;
    text-align: center;
}

.card__details .card__title {
    text-align: start;
    color: var(--title-color-card);
}

.card__details .card__description {
    text-align: start;
    color: var(--text-color-card);
}

video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* HOW HELP STYLES */
.how__help__bg {
    padding: var(--padding-section);
    background-color: var(--bg-color-how-help);
}

.how__help__bg .title {
    color: var(--title-color-how-help);
}

.how__help__bg .description {
    color: var(--text-color-how-help);
}

.cards {
    display: flex;
    justify-content: center;
    width: 100%;
    gap: 20px;
}

.card {
    display: flex;
    flex-direction: column;
    border-radius: var(--border-radius-card);
    overflow: hidden;
    height: auto;
    max-width: 100%;
    min-width: 30%;
    background-color: var(--bg-color-card);
}

.card:hover .card__button {
    animation: bounce-horizontal 1s infinite ease-in-out;
}

@keyframes bounce-horizontal {
    0% {
        transform: translateX(0);
    }

    50% {
        transform: translateX(5px);
    }

    100% {
        transform: translateX(0);
    }
}

.card__details {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 20px;
    justify-content: space-between;
    height: 100%;
}

.card__title__group {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.card__content {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.image {
    width: 100%;
    min-height: 300px;
    overflow: hidden;
}

.primary__icon {
    background-color: rgba(141, 141, 141, 0.178);
    padding: 10px;
    display: flex;
    width: 50px;
    border-radius: 10px;
}

.card__button {
    display: flex;
    align-items: center;
    height: auto;
    width: max-content;
    color: var(--secondary-color);
    gap: 5px;
    font-size: 0.9rem;
}

.icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 15px;
    height: 15px;
}
</style>