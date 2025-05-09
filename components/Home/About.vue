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
    button: {
        type: Array,
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

/* RECUPERAR LA SIDEIMAGE */
const imagePath = props.sideImage?.url ?? ''  // SIDEIMAGE
const { imageUrl: imageUrl } = getResource(imagePath)
const altImage = props.sideImage?.alternativeText ?? ''

/* STYLOS */
const bgColor = props.styles?.backgroundColor?.color ?? null
const titleColor = props.styles?.titleColor?.color ?? null
const textColor = props.styles?.textColor?.color ?? null
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
                    <h1 class="title" v-html="formattedTitle"></h1>
                    <p class="description" v-html="formattedDescription"></p>
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
    height: auto;
    background-color: var(--bg-color-hero);
    padding: var(--padding-section);
    padding-top: 180px;
    scroll-margin-top: 40px;
}

.content {
    display: flex;
    margin: auto;
    max-width: var(--max-width);
    overflow: hidden;
    gap: 50px;
}

.side__image {
    border-radius: var(--border-radius);
    overflow: hidden;
    width: 100%;
    height: auto;
}

.content__about {
    display: flex;
    margin: auto;
    flex-direction: column;
    gap: 80px;
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
</style>