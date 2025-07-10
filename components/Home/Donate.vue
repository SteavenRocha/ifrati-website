<script setup>
const positionSlider = positionSliderStore()

const props = defineProps({
    /* DONATE DATA */
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
    number: {
        type: String,
        required: true,
    },
    secondDescription: {
        type: String,
        required: true,
    },
    donors: {
        type: Array,
        required: true,
    },
    buttons: {
        type: Array,
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

</script>

<template>
    <section>
        <div class="content__bg" :style="{
            /* COLORES DE LA SECCION */
            '--bg-color-donate': bgColor ?? 'var(--background-color)',
            '--title-color-donate': titleColor ?? 'var(--title-color)',
            '--text-color-donate': textColor ?? 'var(--text-color)',
        }">
            <div class="centered__texts">
                <div class="pill__title">
                    <Pill :key="pill.id" :text="pill.text" :icon-url="getResource(pill.icon?.url).imageUrl"
                        :bgColor="bgColorPill" :textColor="textColorPill" />
                    <h1 class="title" v-html="formattedTitle"></h1>
                </div>
                <p class="description" v-html="formattedDescription"></p>
            </div>

            <div class="container">
                <p class="number">
                    {{ props.number }}
                </p>
                <div class="donors__description">
                    <div class="donors__container">
                        <div class="image" v-for="donor in props.donors" :key="donor.id">
                            <img :src="getResource(donor?.url).imageUrl" :alt="donor.alternativeText || 'Donante'"
                                class="donor__image" />
                        </div>
                    </div>
                    <p class="second__description">
                        {{ props.secondDescription }}
                    </p>

                    <div class="buttons">
                        <Button v-for="button in buttons" :key="button.id" :text="button.text" :style="button.style"
                            :href="button.href" :icon-url="getResource(button.icon?.url).imageUrl"
                            extraClass="responsive__button" />
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
    background-color: var(--bg-color-donate);
    display: flex;
    flex-direction: column;
    gap: 50px;
}

.content {
    display: flex;
    flex-direction: column;
    margin: auto;
    max-width: var(--max-width);
    overflow: hidden;
    gap: 50px;
}

.pill__title {
    align-items: center;
}

.centered__texts .title {
    color: var(--title-color-donate);
}

.centered__texts .description {
    color: var(--text-color-donate);
}

.second__description {
    color: var(--text-color-donate);
    padding-bottom: 10px;
}

.buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.container p {
    width: auto;
}

.number {
    font-size: clamp(5rem, 10vw, 8rem);
    font-weight: 800;
    color: var(--primary-color);
}

.donors__description {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.donors__container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.image {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid var(--primary-color);
}

@media (max-width: 1024px) {
    .centered__texts {
        width: 80%;
    }
}

@media (max-width: 640px) {
    .centered__texts {
        width: 100%;
    }
}
</style>