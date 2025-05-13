<script setup>
const props = defineProps({
    /* PROGRAM DATA */
    title: { type: String, required: true },
    description: { type: String, required: true },
    video: { type: Object, required: true },
    styles: { type: Object, required: true },
    button: { type: Object, required: true },
    pill: {
        type: Object,
        required: true,
    },

    /* HOW HELP DATA */
    titleHowHelp: { type: String, required: true },
    descriptionHowHelp: { type: String, required: true },
    cards: { type: Object, required: true },
    stylesHowHelp: { type: Object, required: true },
    pillHowHelp: {
        type: Object,
        required: true,
    },
})

const formattedTitle = ref(getTextFormated(props.title))
const formattedDescription = ref(getTextFormated(props.description))

// VIDEO
const rawVideoLink = props.video?.videoLink ?? null
const embedVideoLink = rawVideoLink
    ? rawVideoLink.replace("watch?v=", "embed/").split("&")[0]
    : null

const useVideoLink = ref(Boolean(embedVideoLink))
const youtubeVideoId = embedVideoLink ? embedVideoLink.split('/').pop() : ''

const videoFilePath = props.video?.video?.url ?? null
const { imageUrl: videoUrl } = getResource(videoFilePath)
const altVideo = props.video?.video?.alternativeText ?? ''
const videoDescription = props.video?.videoDescription ?? ''

/* ESTILOS */
const bgColor = props.styles?.backgroundColor ?? null
const titleColor = props.styles?.titleColor ?? null
const textColor = props.styles?.textColor ?? null

/* RECUPERAMOS STYLOS DE LA PILL */
const bgColorPill = props.pill?.pillStyle?.backgroundColor ?? 'var(--pill-bg-color)'
const textColorPill = props.pill?.pillStyle?.textColor ?? 'var(--pill-text-color)'

/* CÓMO AYUDAMOS */
const formattedTitleHowHelp = ref(getTextFormated(props.titleHowHelp))
const formattedDescriptionHowHelp = ref(getTextFormated(props.descriptionHowHelp))
const card = props.cards?.card ?? []
const bgColorCard = props.cards?.cardStyle?.backgroundColor ?? null
const titleColorCard = props.cards?.cardStyle?.titleColor ?? null
const textColorCard = props.cards?.cardStyle?.textColor ?? null

const bgColorHowHelp = props.stylesHowHelp?.backgroundColor ?? null
const titleColorHowHelp = props.stylesHowHelp?.titleColor ?? null
const textColorHowHelp = props.stylesHowHelp?.textColor ?? null

/* RECUPERAMOS STYLOS DE LA PILL */
const bgColorPillHowHelp = props.pillHowHelp?.pillStyle?.backgroundColor ?? 'var(--pill-bg-color)'
const textColorPillHowHelp = props.pillHowHelp?.pillStyle?.textColor ?? 'var(--pill-text-color)'

const iconPaht = props.cards?.cardButton?.icon?.url ?? ''
const iconUrl = getResource(iconPaht).imageUrl

const { svgHtml, loadSvg } = getSvgHtml()

const showModal = ref(false)
const modalType = ref('')

if (iconUrl) await loadSvg(iconUrl)
</script>

<template>
    <section id="program">
        <div class="content__bg" :style="{
            '--bg-color-program': bgColor ?? 'var(--background-color)',
            '--title-color-program': titleColor ?? 'var(--title-color)',
            '--text-color-program': textColor ?? 'var(--text-color)',
        }">
            <div class="content">
                <div class="content__program">
                    <div class="texts">
                        <div class="pill__title">
                            <Pill :key="pill.id" :text="pill.text" :icon-url="getResource(pill.icon?.url).imageUrl"
                                :bgColor="bgColorPill" :textColor="textColorPill" />
                            <h1 class="title" v-html="formattedTitle"></h1>
                        </div>
                        <p class="description" v-html="formattedDescription"></p>
                    </div>

                    <Button :key="button.id" :text="button.text" :style="button.style" :href="button.href"
                        :icon-url="getResource(button.icon?.url).imageUrl" />
                </div>

                <div class="video__container">
                    <div class="video">
                        <div class="video__thumbnail" @click="() => {
                            modalType = useVideoLink ? 'youtube' : 'local'
                            showModal = true
                        }">
                            <div class="play">
                                <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 48 48">
                                    <defs>
                                        <mask id="a">
                                            <g fill="none" stroke-linejoin="round" stroke-width="4">
                                                <path fill="#fff" stroke="#fff"
                                                    d="M24 44a20 20 0 1 0 0-40 20 20 0 0 0 0 40Z" />
                                                <path fill="#000" stroke="#000"
                                                    d="M20 24v-7l6 3.5 6 3.5-6 3.5-6 3.4z" />
                                            </g>
                                        </mask>
                                    </defs>
                                    <path fill="currentColor" d="M0 0h48v48H0z" mask="url(#a)" />
                                </svg>
                                <p>Haz click para reproducir</p>
                            </div>
                            <img v-if="useVideoLink" :src="`https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`"
                                alt="YouTube preview" />

                            <video v-else :src="videoUrl" :alt="altVideo" muted></video>
                        </div>
                    </div>
                    <p class="video__description">{{ videoDescription }}</p>
                </div>

                <!-- Modal para ambos tipos de video -->
                <div class="popup__video" v-if="showModal" @click.self="() => {
                    showModal = false
                }">
                    <span @click="showModal = false"><svg xmlns="http://www.w3.org/2000/svg" width="118.64" height="128"
                            viewBox="0 0 1216 1312">
                            <path fill="currentColor"
                                d="M1202 1066q0 40-28 68l-136 136q-28 28-68 28t-68-28L608 976l-294 294q-28 28-68 28t-68-28L42 1134q-28-28-28-68t28-68l294-294L42 410q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294l294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68L880 704l294 294q28 28 28 68" />
                        </svg></span>

                    <!-- YouTube -->
                    <iframe v-if="modalType === 'youtube'" :src="embedVideoLink + '?autoplay=1'" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>

                    <!-- Video Local -->
                    <video v-else :src="videoUrl" autoplay muted controls>
                    </video>
                </div>
            </div>
        </div>
    </section>

    <!-- Sección cómo ayuda (sin cambios) -->
    <section>
        <div class="how__help__bg" :style="{
            '--bg-color-how-help': bgColorHowHelp ?? 'var(--background-color)',
            '--title-color-how-help': titleColorHowHelp ?? 'var(--title-color)',
            '--text-color-how-help': textColorHowHelp ?? 'var(--text-color)',
        }">
            <div class="how__help__content">
                <div class="sub__texts">
                    <div class="pill__title">
                        <Pill :key="pillHowHelp.id" :text="pillHowHelp.text"
                            :icon-url="getResource(pillHowHelp.icon?.url).imageUrl" :bgColor="bgColorPillHowHelp"
                            :textColor="textColorPillHowHelp" />
                        <h1 class="title" v-html="formattedTitleHowHelp"></h1>
                    </div>
                    <p class="description" v-html="formattedDescriptionHowHelp"></p>
                </div>

                <div class="cards" :style="{
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
                            <a v-if="cards.cardButton?.href" :href="cards.cardButton.href" class="card__button"
                                :target="cards.cardButton.isExternal ? '_blank' : '_self'" rel="noopener noreferrer">
                                {{ cards.cardButton.text }}
                                <span class="icon" v-if="svgHtml" v-html="svgHtml" />
                            </a>
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

.content__program {
    display: flex;
    margin: auto;
    flex-direction: column;
    gap: 60px;
}

.how__help__content {
    flex-direction: column;
}

.video__container {
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
    position: relative;
    border-radius: var(--border-radius);
    overflow: hidden;
    width: 100%;
    height: 425px;
    cursor: pointer;
}

.video img {
    width: 100%;
    height: 425px;
}

.play {
    position: absolute;
    width: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    gap: 20px;
    z-index: 1;
}

.play p {
    font-size: 1rem;
}

.play svg {
    transition: scale .3s ease;
    width: 125px;
    color: rgba(255, 255, 255, 0.85);
}

.video:hover .play svg {
    scale: 1.2;
}

iframe {
    height: 100%;
}

video {
    width: 100%;
    height: 400px;
    object-fit: cover;
    transition: scale .3s ease;
}

.popup__video {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.8);
    height: 100%;
    width: 100%;
}

.popup__video video,
.popup__video iframe {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    height: 70vh;
    border-radius: 10px;
    object-fit: cover;
}

.popup__video span {
    position: absolute;
    top: 30px;
    right: 50px;
    width: 50px;
    color: white;
    font-weight: bolder;
    z-index: 40;
    cursor: pointer;
    transition: all .3s ease;
}

.popup__video span:hover {
    color: var(--primary-color);
    scale: 1.2;
}

@media (max-width: 768px) {
    .popup__video video {
        width: 95%;
    }
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
    height: auto;
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
    box-shadow: var(--box-shadow);
    border: 1px solid rgba(216, 216, 216, 0.7);
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
    gap: 20px;
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
    min-height: 280px;
    max-height: 280px;
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