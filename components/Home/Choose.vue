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
    cards: {
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

/* STYLOS DE LA CARD */
const bgColorCard = props.cards?.cardStyles?.backgroundColor?.color ?? null
const titleColorCard = props.cards?.cardStyles?.titleColor?.color ?? null
const textColorCard = props.cards?.cardStyles?.textColor?.color ?? null

/* STYLOS DEL CHOOSE SECTION */
const bgColor = props.styles?.backgroundColor?.color ?? null
const titleColor = props.styles?.titleColor?.color ?? null
const textColor = props.styles?.textColor?.color ?? null

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
                <div class="sub__texts">
                    <h1 class="title" v-html="formattedTitle"></h1>
                    <p class="description" v-html="formattedDescription"></p>
                </div>

                <div class="cards" :style="{
                    /* COLORES DE LAS CARDS */
                    '--bg-color-card': bgColorCard ?? 'var(--background-color)',
                    '--title-color-card': titleColorCard ?? 'var(--title-color)',
                    '--text-color-card': textColorCard ?? 'var(--text-color)',
                }">
                    <div class="card" v-for="item in cards.chooseCard" :key="item.id">
                        <div class="image">
                            <img :src="getResource(item.image?.url).imageUrl"
                                :alt="item.image?.alternativeText || 'imagen de tarjeta'" />
                        </div>
                        <div class="card__content">
                            <div class="card__details">
                                <h1 class="card__title">{{ item.title }}</h1>
                                <p class="card__description">{{ item.description }}</p>
                            </div>
                            <Button v-for="button in item.button" :key="button.id" :text="button.text"
                                :style="button.style" :href="button.href"
                                :icon-url="getResource(button.icon?.url).imageUrl" extraClass="full__width" />
                        </div>
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
    background-color: var(--bg-color-program);
}

.content {
    display: flex;
    flex-direction: column;
    margin: auto;
    max-width: var(--max-width);
    overflow: hidden;
    gap: 50px;
}

.sub__texts .title {
    color: var(--title-color-choose);
}

.sub__texts .description {
    font-size: var(--font-size-card);
    color: var(--text-color-choose);
}

.cards {
    display: flex;
    gap: 20px;
}

.card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: var(--border-radius-card);
    background-color: var(--bg-color-card);
    overflow: hidden;
}

.card__content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 20px;
    padding: 20px;
    height: 100%;
}

.card__details {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.card h1 {
    text-align: start;
    color: var(--title-color-card);
}

.card p {
    text-align: start;
    color: var(--text-color-card);
}

.image {
    width: 100%;
    min-height: 300px;
    overflow: hidden;
}
</style>