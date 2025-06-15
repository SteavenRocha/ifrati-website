<script setup>
/* OBTENER ESTADO DEL HEADER-UP */
const statusHeaderUp = statusHeaderUpStore()
const isActive = statusHeaderUp.isActive

const props = defineProps({
    /* HERO DATA */
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    style: {
        type: Object,
        required: false,
    },
})
// FORMATEAR EL TITULO **
const formattedTitle = ref(getTextFormated(props.title))
const formattedDescription = ref(getTextFormated(props.description))

/* STYLOS DEL HERO */
const bgPath = props.style?.backgroundImage?.url ?? null
const { imageUrl: bgUrl } = getResource(bgPath)
const heroBgColor = props.style?.backgroundColor ?? null
const heroTitleColor = props.style?.titleColor ?? null
const heroTextColor = props.style?.textColor ?? null

const heroBackgroundStyle = computed(() => {
    if (bgUrl) {
        return { backgroundImage: `url('${bgUrl}')` }
    } else if (heroBgColor) {
        return { backgroundColor: heroBgColor }
    } else {
        return { backgroundColor: 'var(--background-color)' }
    }
})

</script>

<template>
    <section :style="{
        '--header-height': isActive ? '110px' : '70px',
        paddingTop: 'var(--header-height)'
    }">
        <div :class="style" class="hero__bg" :style="{
            ...heroBackgroundStyle,
            '--title-color-hero': heroTitleColor ?? 'var(--title-color)',
            '--text-color-hero': heroTextColor ?? 'var(--text-color)',
        }">
            <div class="content__hero">
                <div class="texts">
                    <h1 class="title" v-html="formattedTitle"></h1>
                    <p class="description" v-html="formattedDescription"></p>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
section {
    display: flex;
    height: auto;
}

.hero__bg {
    display: flex;
    height: 450px;
    align-items: center;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    padding: 0 var(--padding-width);
}

.content__hero {
    display: flex;
    margin: auto;
    max-width: var(--max-width);
}

.texts {
    margin: 0;
    width: 50%;
}

.content__hero .texts .title {
    color: var(--title-color-hero);
    font-size: var(--font-size-hero);
    font-weight: 800;
    line-height: 1.125;
    text-align: start;
}

.content__hero .texts .description {
    color: var(--text-color-hero);
    text-align: start;
    font-size: var(--font-size-parrafo-hero);
}

@media (max-width: 1024px) {
    .content__hero {
        justify-content: center;
    }

    .content__hero .texts {
        width: 80%;
    }

    .content__hero .texts .title,
    .content__hero .texts .description {
        text-align: center;
    }
}

@media (max-width: 640px) {
    .content__hero .texts {
        width: 100%;
    }
}
</style>