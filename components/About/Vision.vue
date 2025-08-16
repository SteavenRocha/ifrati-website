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
const bgColorPill = props.pill?.pillStyle?.backgroundColor ?? 'var(--pill-bg-color)'
const textColorPill = props.pill?.pillStyle?.textColor ?? 'var(--pill-text-color)'

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
        '--bg-color-vision': bgColor ?? 'var(--background-color)',
        '--title-color-vision': titleColor ?? 'var(--title-color)',
        '--text-color-vision': textColor ?? 'var(--text-color)',
    }">
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
    background-color: var(--bg-color-vision);
    padding: var(--padding-section);
    scroll-margin-top: 40px;
}

.content {
    display: flex;
    align-items: center;
    margin: auto;
    max-width: var(--max-width);
    overflow: hidden;
    gap: 50px;
}

.texts {
    width: 100%;
    text-align: start;
}

.texts .title {
    color: var(--title-color-vision);
}

.texts .description {
    color: var(--text-color-vision);
}

@media (max-width: 1024px) {
    .content {
        flex-direction: column;
        align-items: center;
        width: 80%;
    }

    .texts {
        align-items: center;
    }

    .title {
        text-align: center;
    }

    .description {
        text-align: center;
    }
}

@media (max-width: 640px) {
    .content {
        width: 100%;
    }
}
</style>