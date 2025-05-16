<script setup>
const props = defineProps({
    /* CTA DATA */
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    button: {
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

/* STYLOS DEL CTA */
const ctaSectionBgColor = props.style?.sectionBackgroundColor ?? null
const bgPath = props.style?.backgroundImage?.url ?? null
const { imageUrl: bgUrl } = getResource(bgPath)
const ctaBgColor = props.style?.backgroundColor ?? null
const ctaTitleColor = props.style?.titleColor ?? null
const ctaTextColor = props.style?.textColor ?? null

const ctaBackgroundStyle = computed(() => {
    if (bgUrl) {
        return { backgroundImage: `url('${bgUrl}')` }
    } else if (ctaBgColor) {
        return { backgroundColor: ctaBgColor }
    } else {
        return { backgroundColor: 'var(--background-color)' }
    }
})
</script>

<template>
    <section :style="{
        '--sectionBg-color': ctaSectionBgColor ?? 'var(--background-color)',
        '--title-color-cta': ctaTitleColor ?? 'var(--title-color)',
        '--text-color-cta': ctaTextColor ?? 'var(--text-color)'
    }">
        <div class="content" :style="{
            ...ctaBackgroundStyle,
        }">
            <div class="centered__texts">
                <h1 class="title" v-html="formattedTitle"></h1>
                <p class="description" v-html="formattedDescription"></p>

                <div class="buttons">
                    <Button v-for="button in button" :key="button.id" :text="button.text" :style="button.style"
                        :href="button.href" :icon-url="getResource(button.icon?.url).imageUrl" />
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
section {
    display: flex;
    height: auto;
    background-color: var(--sectionBg-color);
    padding: var(--padding-section);
    scroll-margin-top: 40px;
}

.content {
    padding: 100px;
    border-radius: var(--border-radius);
    display: flex;
    flex-direction: column;
    margin: auto;
    max-width: var(--max-width);
    overflow: hidden;
    gap: 50px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.title {
    color: var(--title-color-cta);
}

.description {
    color: var(--text-color-cta);
}

.buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
}
</style>