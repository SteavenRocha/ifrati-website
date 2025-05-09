<script setup>
const props = defineProps({
    /* ABOUT DATA */
    title: {
        type: String,
        required: true,
    },
    styles: {
        type: Object,
        required: true,
    },
    brands: {
        type: Object,
        required: true,
    },
})

// FORMATEAR EL TITULO Y DESCRIPTION **
const formattedTitle = ref(getTextFormated(props.title))

/* STYLOS DE BRANDS SECTION */
const bgColor = props.styles?.backgroundColor?.color ?? null
const titleColor = props.styles?.textColor?.color ?? null

</script>

<template>
    <section>
        <div class="content__bg" :style="{
            /* COLORES DE LA SECCION */
            '--bg-color-brands': bgColor ?? 'var(--background-color)',
            '--title-color-brands': titleColor ?? 'var(--title-color)',
        }">
            <div class="content">
                <div class="sub__texts">
                    <h1 class="title" v-html="formattedTitle"></h1>
                </div>

                <div class="brands">
                    <a class="brand" v-for="item in brands.brands" :key="item.id" :href="item?.href" target="_blank">
                        <img :src="getResource(item?.image_icon?.url).imageUrl"
                            :alt="item?.alternativeText || item.textName" />
                    </a>
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
    background-color: var(--bg-color-brands);
}

.content {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: auto;
    max-width: var(--max-width);
    overflow: hidden;
    gap: 50px;
}

.content .sub__texts .title {
    font-size: 1.5rem;
}

.content .sub__texts .title {
    color: var(--title-color-brands);
}

.brands {
    display: flex;
    justify-content: center;
    gap: 50px;
}

.brand {
    width: 200px;
    height: auto;
}

img {
    object-fit: contain;
}
</style>