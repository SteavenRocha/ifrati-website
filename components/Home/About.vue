<script setup>
const props = defineProps({
    /* ABOUT DATA */
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
    button: {
        type: Object,
        required: true,
    },
    sideImage: {
        type: Object,
        required: true,
    },
    styles: {
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

/* STYLOS */
const bgColor = props.styles?.backgroundColor ?? null
const titleColor = props.styles?.titleColor ?? null
const textColor = props.styles?.textColor ?? null
</script>

<template>
    <section :style="{
        /* COLORES DE LA SECCION */
        '--bg-color-hero': bgColor ?? 'var(--background-color)',
        '--title-color-about': titleColor ?? 'var(--title-color)',
        '--text-color-about': textColor ?? 'var(--text-color)',
    }" id="about">
        <div class="content">
            <div class="side__image">
                <img :src="imageUrl" :alt="altImage" />
            </div>
            <div class="content__about">
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
        </div>
    </section>
</template>

<style scoped>
section {
    display: flex;
    height: auto;
    background-color: var(--bg-color-hero);
    padding: var(--padding-section);
    padding-top: 160px;
    scroll-margin-top: 40px;
}

.content {
    display: flex;
    margin: 0 auto;
    max-width: var(--max-width);
    overflow: hidden;
    gap: 50px;
}

.content__about {
    display: flex;
    margin: auto;
    flex-direction: column;
    gap: 60px;
}

.texts {
    width: 100%;
    text-align: start;
}

.content__about .texts .title {
    color: var(--title-color-about);
}

.content__about .texts .description {
    color: var(--text-color-about);
}

@media (max-width: 1024px) {
    section {
        padding-top: 140px;
    }

    .content {
        flex-direction: column-reverse;
        align-items: center;
    }

    .content__about {
        width: 80%;
        align-items: center;
    }

    .texts {
        text-align: center;
    }
}

@media (max-width: 640px) {
    .content__about {
        width: 100%;
    }
}
</style>