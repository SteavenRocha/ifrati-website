<script setup>
const props = defineProps({
    /* CHOOSE DATA */
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
    choose: {
        type: Array,
        required: true,
    },
    chooseStyles: {
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

/* STYLOS CONTENT*/
const bgColorChoose = props.chooseStyles?.backgroundColor ?? null
const titleColorChoose = props.chooseStyles?.titleColor ?? null
const textColorChoose = props.chooseStyles?.textColor ?? null

// ============ OBTENER SVG POR ÍTEM ============ //
/* const processedChooseInformation = reactive([])

if (props.choose?.length) {
    for (const link of props.choose) {
        const { svgHtml, loadSvg } = getSvgHtml()
        const iconUrl = getResource(link.icon?.url ?? '').imageUrl
        if (iconUrl) {
            await loadSvg(iconUrl)
        }
        processedChooseInformation.push({
            ...link,
            svgHtml: svgHtml.value,
        })
    }
} */

// LOGICA PARA LA SELECCION DE CARDS
// ID de la card seleccionada
const selectedChooseId = ref(null)
// Cuando se hace clic en una card, se actualiza el ID
const selectChoose = (id) => {
    selectedChooseId.value = id
}
// Seleccionar la primera card por defecto
if (props.choose.length > 0 && !selectedChooseId.value) {
    selectedChooseId.value = props.choose[0].id
}
// seleccionada completa
const selectedChoose = computed(() =>
    props.choose.find((choose) => choose.id === selectedChooseId.value)
)
</script>

<template>
    <section>
        <div class="content__bg" :style="{
            /* COLORES DE LA SECCION */
            '--bg-color-choose': bgColor ?? 'var(--background-color)',
            '--title-color-choose': titleColor ?? 'var(--title-color)',
            '--text-color-choose': textColor ?? 'var(--text-color)',
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

                <div class="container" :style="{
                    /* COLORES DE LA SECCION */
                    '--bg-color-choose-content': bgColorChoose ?? 'var(--background-color)',
                    '--title-color-choose-content': titleColorChoose ?? 'var(--title-color)',
                    '--text-color-choose-content': textColorChoose ?? 'var(--text-color)',
                }">
                    <div class="left__content">
                        <div class="option" v-for="choose in choose" :key="choose.id" @click="selectChoose(choose.id)"
                            :class="{ active: selectedChooseId === choose.id }">
                            <div class="icon">
                                <img :src="getResource(choose?.icon?.url).imageUrl" alt="">
                            </div>
                            <h3 class="option__text">{{ choose.title }}</h3>
                        </div>
                    </div>
                    <transition name="fade-slide" mode="out-in">
                        <div class="rigth__content" v-if="selectedChoose" :key="selectedChoose.id"
                            :id="'pillar-' + selectedChoose.id">

                            <div class="top__img">
                                <img :src="getResource(selectedChoose?.image?.url).imageUrl" alt="">
                                <div class="title__top">
                                    <h3>{{ selectedChoose.title }}</h3>
                                </div>
                            </div>

                            <div class="choose__container">
                                <div class="choose__content">
                                    <p class="choose__description"> {{ selectedChoose.description }}</p>

                                    <div class="benefits__container">
                                        <h3 class="title__benefits">{{ selectedChoose.benefits.title }}</h3>
                                        <div class="benefits__content">
                                            <div class="benefits"
                                                v-for="benefits in selectedChoose.benefits.textComponent"
                                                :key="benefits.id">
                                                <div class="bullet__icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                        fill="currentColor">
                                                        <path
                                                            d="M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm8-10a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm5.46 7.46-1.42-1.42L11 13.1l-2.8-2.8-1.4 1.42 4.2 4.2 6.46-6.45Z" />
                                                    </svg>
                                                </div>
                                                <p class="benefits__description">{{ benefits.text }}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="characteristics__container">
                                        <div class="characteristics"
                                            v-for="characteristics in selectedChoose.characteristics"
                                            :key="characteristics.id">

                                            <h3 class="characteristics__title">{{ characteristics.title }}</h3>
                                            <p class="characteristics__description">{{ characteristics.description }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <Button :key="selectedChoose.button.id" :text="selectedChoose.button.text"
                                    :style="selectedChoose.button.style" :href="selectedChoose.button.href"
                                    :icon-url="getResource(selectedChoose.button.icon?.url).imageUrl" />
                            </div>
                        </div>
                    </transition>
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
    background-color: var(--bg-color-choose);
    display: flex;
    flex-direction: column;
    gap: 50px;
}

.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    max-width: var(--max-width);
    /*  overflow: hidden; */
    gap: 50px;
}

.pill__title {
    align-items: center;
}

.centered__texts .title {
    color: var(--title-color-choose);
}

.centered__texts .description {
    color: var(--text-color-choose);
}

.title__benefits,
.characteristics__title {
    font-size: clamp(1rem, 3vw, 1.1rem);
    font-weight: 500;
}

.title__benefits {
    color: var(--title-color-choose-content);
}

.characteristics__title {
    color: var(--primary-color);
}

.choose__description,
.benefits__description,
.characteristics__description {
    color: var(--text-color-choose-content);
    font-size: clamp(1rem, 3vw, 1.1rem);
    font-weight: 350;
    line-height: 1.3;
}

.container {
    display: flex;
    align-items: start;
    gap: 30px;
    max-width: 1150px;
    overflow: clip ;
}

.left__content {
    position: sticky;
    top: 130px;
    display: flex;
    flex-direction: column;
    width: max-content;
    gap: 10px;
    background-color: var(--bg-color-choose-content);
    /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); */
    border: 1px solid rgba(185, 185, 185, 0.3);
    padding: 5px;
    border-radius: 15px;
    z-index: 10;
    /*  overflow: hidden; */
}

.rigth__content {
    width: 100%;
    border-radius: 15px;
   /*  overflow: hidden; */
    /*  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); */
    border: 1px solid rgba(185, 185, 185, 0.3);
    overflow: clip;
}

.choose__content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.benefits__container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.characteristics__container {
    display: flex;
    gap: 20px;
}

.characteristics {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #F9FAFB;
    border-radius: 15px;
    padding: 15px;
}

.choose__container {
    background-color: var(--bg-color-choose-content);
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 30px;
    align-items: center;
}

.top__img {
    position: relative;
    height: 350px;
}

.top__img img {
    filter: brightness(60%);
}

.title__top {
    width: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.title__top h3 {
    font-size: clamp(1.5rem, 8vw, 3rem);
    width: max-content;
    color: white;
}

.benefits__content {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.benefits {
    display: flex;
    align-items: start;
    width: calc(50% - 10px);
    gap: 10px;
}

.option {
    display: flex;
    gap: 10px;
    justify-content: start;
    align-items: center;
    background-color: white;
    width: 100%;
    height: 50px;
    padding: 40px 20px;
    border-radius: 15px;
    cursor: pointer;
    transition: all ease .6s;
}

.option:hover {
    background-color: rgba(0, 0, 0, 0.07);
}

.option.active {
    background-color: var(--primary-color);
}

.option.active .option__text {
    color: white;
}

.option.active .icon {
    background-color: rgba(255, 255, 255, 0.3);
}

.icon {
    /*   background-color: rgba(102, 102, 102, 0.2); */
    border-radius: 15px;
    padding: 10px;
    max-width: 60px;
    min-width: 60px;
    height: 60px;
    color: var(--primary-color);
    transition: all ease .3s;
}

.option__text {
    font-weight: 500;
    font-size: clamp(1.1rem, 3vw, 1.3rem);
    width: max-content;
    color: var(--title-color-choose-content);
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

@media (max-width: 1024px) {
    .centered__texts {
        width: 80%;
    }

    .container {
        flex-direction: column;
    }

    .left__content {
        flex-direction: row;
        width: 100%;
    }
}

@media (max-width: 900px) {
    .option__text {
        width: auto;
    }
}

@media (max-width: 700px) {
    .option {
        padding: 40px 5px;
        width: 100%;
    }
}

@media (max-width: 640px) {
    .centered__texts {
        width: 100%;
    }

    .choose__container {
        padding: 20px;
    }

    /* .option__text {
        display: none;
    } */

    .characteristics__container {
        flex-wrap: wrap;
    }

    .characteristics {
        width: calc(50% - 10px);
    }
}

@media (max-width: 580px) {
    .option__text {
        display: none;
    }

    .option {
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .benefits__content {
        flex-direction: column;
        gap: 15px;
    }

    .benefits {
        width: 100%;
    }

    .characteristics {
        width: 100%;
    }
}
</style>