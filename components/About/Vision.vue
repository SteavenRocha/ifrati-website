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
    sideImage: {
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
const bgColorPill = props.pill?.pillStyle?.backgroundColor ?? 'var(--primary-color)'
const textColorPill = props.pill?.pillStyle?.textColor ?? 'var(--title-color)'

/* RECUPERAR LA SIDEIMAGE */
const imagePath = props.sideImage?.url ?? ''  // SIDEIMAGE
const { imageUrl: imageUrl } = getResource(imagePath)
const altImage = props.sideImage?.alternativeText ?? ''

/* STYLOS */
const bgColor = props.style?.backgroundColor ?? null
const titleColor = props.style?.titleColor ?? null
const textColor = props.style?.textColor ?? null
</script>

<template>
    <section :style="{
        /* COLORES DE LA SECCION */
        '--bg-color-hero': bgColor ?? 'var(--background-color)',
        '--title-color-about': titleColor ?? 'var(--title-color)',
        '--text-color-about': textColor ?? 'var(--text-color)',
    }" id="about">
        <div class="content">
            <div class="texts">
                <div class="pill__title">
                    <Pill :key="pill.id" :text="pill.text" :icon-url="getResource(pill.icon?.url).imageUrl"
                        :bgColor="bgColorPill" :textColor="textColorPill" />
                    <h1 class="title" v-html="formattedTitle"></h1>
                </div>
                <p class="description" v-html="formattedDescription"></p>
            </div>
            <div class="side__image">
                <img :src="imageUrl" :alt="altImage" />
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
    scroll-margin-top: 40px;
}

.content {
    display: flex;
    margin: auto;
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

.texts .title {
    color: var(--title-color-about);
}

.texts .description {
    color: var(--text-color-about);
}
</style>