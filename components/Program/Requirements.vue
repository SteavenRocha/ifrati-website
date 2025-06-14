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
    sideImage: {
        type: Object,
        required: true,
    },
    requirements: {
        type: Object,
        required: true,
    },
    cta: {
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

/* RECUPERAR LA SIDEIMAGE */
const imagePath = props.sideImage?.url ?? ''  // SIDEIMAGE
const { imageUrl: imageUrl } = getResource(imagePath)
const altImage = props.sideImage?.alternativeText ?? ''

/* RECUPERAR LOS REQUIREMENTS */
const requierements = props.requirements?.textComponent ?? []  // REQUIREMENTS

/* STYLOS */
const bgColor = props.style?.backgroundColor ?? null
const titleColor = props.style?.titleColor ?? null
const textColor = props.style?.textColor ?? null

/* STYLOS DEL CTA*/
const titleColorCta = props.cta?.ctaStyle?.titleColor ?? null
const textColorCta = props.cta?.ctaStyle?.textColor ?? null

// FORMATEAR EL TITULO Y DESCRIPTION DEL CTA
const formattedTitleCta = ref(getTextFormated(props.cta?.title))
const formattedDescriptionCta = ref(getTextFormated(props.cta?.description))
</script>

<template>
    <section :style="{
        /* COLORES DE LA SECCION */
        '--bg-color-requirements': bgColor ?? 'var(--background-color)',
        '--title-color-requirements': titleColor ?? 'var(--title-color)',
        '--text-color-requirements': textColor ?? 'var(--text-color)',
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

            <div class="container">
                <div class="side__image">
                    <img :src="imageUrl" :alt="altImage" />
                </div>

                <div class="content__texts">
                    <h2 class="title__requirements">
                        {{ props.requirements?.title }}
                    </h2>
                    <ul class="requierements">
                        <li class="requierements__content" v-for="list in requierements" :key="list.id">
                            <div class="bullet__icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm8-10a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm5.46 7.46-1.42-1.42L11 13.1l-2.8-2.8-1.4 1.42 4.2 4.2 6.46-6.45Z" />
                                </svg>
                            </div>
                            <div class="requierements__texts">
                                <h3 class="requirements__title">
                                    {{ list.title }}
                                </h3>
                                <p class="requirements__description">
                                    {{ list.description }}
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="cta" :style="{
                /* COLORES DE LA SECCION */
                '--title-color-cta': titleColorCta ?? 'var(--title-color)',
                '--text-color-cta': textColorCta ?? 'var(--text-color)',
            }">
                <div class="centered__texts">
                    <h1 class="cta__title" v-html="formattedTitleCta"></h1>
                    <p class="cta__description" v-html="formattedDescriptionCta"></p>

                    <Button :key="cta?.button.id" :text="cta?.button.text" :style="cta?.button.style"
                        :href="cta?.button.href" :icon-url="getResource(cta?.button.icon?.url).imageUrl" />
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
section {
    display: flex;
    height: auto;
    background-color: var(--bg-color-requirements);
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

.centered__texts .title {
    color: var(--title-color-requirements);
}

.centered__texts .description {
    color: var(--text-color-requirements);
}

.title__requirements {
    color: var(--title-color-requirements);
    font-weight: 500;
    font-size: clamp(1.2rem, 3vw, 1.5rem);
}

.requierements {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.requirements__title {
    color: var(--title-color-requirements);
    font-size: clamp(1rem, 3vw, 1.2rem);
    font-weight: 500;
}

.requirements__description {
    font-size: clamp(1rem, 3vw, 1.1rem);
    color: var(--text-color-requirements);
    font-weight: 350;
    line-height: 1.3;
}

.requierements__texts {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.content__texts {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
}

.pill__title {
    align-items: center;
}

.container {
    display: flex;
    gap: 50px;
}

.requierements__content {
    display: flex;
    gap: 10px;
}

ul {
    padding: 0;
}

.centered__texts {
    align-items: center;
}

.cta__title {
    color: var(--title-color-cta);
    font-weight: 600;
    font-size: clamp(1.2rem, 3vw, 1.5rem);
}

.cta__description {
    color: var(--text-color-cta);
    font-size: clamp(1rem, 3vw, 1.1rem);
    line-height: 1.3;
}

@media (max-width: 1024px) {
    .content {
        width: 80%;
        gap: 30px;
    }

    .centered__texts {
        width: 100%;
    }

    .container {
        flex-direction: column;
        gap: 30px;
    }

    .side__image {
        max-width: 100%;
    }

    .title__requirements {
        text-align: center;
    }
}

@media (max-width: 600px) {
    .content {
        width: 100%;
    }
}
</style>