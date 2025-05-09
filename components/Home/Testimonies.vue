<script setup>
const props = defineProps({
    /* TESTIMONIES DATA */
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    card: {
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

/* STYLOS DEL TESTIMONIES SECTION */
const bgColor = props.styles?.backgroundColor?.color ?? null
const titleColor = props.styles?.titleColor?.color ?? null
const textColor = props.styles?.textColor?.color ?? null

/* OBTENER LA CARD */
const cards = props.card?.testimoniesCard ?? null

/* STYLOS DEL CARD TESTIMONIES */
const bgColorCard = props.card?.cardStyles?.backgroundColor?.color ?? null
const titleColorCard = props.card?.cardStyles?.titleColor?.color ?? null
const textColorCard = props.card?.cardStyles?.textColor?.color ?? null

/* OBTNER CANTIDAD DE CARDS ACTIVAS */
const activeCardsCount = computed(() => cards.filter(c => c.isActive).length)
/* OBTNER CANTIDAD DE CARDS VISIBLES */
const visibleCards = 2

</script>

<template>
    <section class="section__main">
        <div class="content__bg" :style="{
            /* COLORES DE LA SECCION */
            '--bg-color-testimonies': bgColor ?? 'var(--background-color)',
            '--title-color-testimonies': titleColor ?? 'var(--title-color)',
            '--text-color-testimonies': textColor ?? 'var(--text-color)',
        }">
            <div class="content" :style="{
                /* COLORES DE LA SECCION */
                '--bg-color-card': bgColorCard ?? 'var(--background-color)',
                '--title-color-card': titleColorCard ?? 'var(--title-color)',
                '--text-color-card': textColorCard ?? 'var(--text-color)',
            }">
                <div class="texts">
                    <h1 class="title" v-html="formattedTitle"></h1>
                    <p class="description" v-html="formattedDescription"></p>
                </div>
                <client-only>
                    <Slider id="testimoniesSlider" :totalCards=activeCardsCount :visibleCards=visibleCards>
                        <div class="card__section" v-for="(item, index) in cards.filter(c => c.isActive)" :key="index"
                            :style="{ width: `${100 / activeCardsCount}%` }">
                            <div class="testimony__content">
                                <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 16 16"
                                    fill="currentColor">
                                    <g fill="none">
                                        <g clip-path="url(#a)">
                                            <path fill="currentColor" fill-rule="evenodd"
                                                d="M12.411 6.33A2.75 2.75 0 0 1 14.5 9v.25A2.75 2.75 0 0 1 11.75 12h-.25a2.747 2.747 0 0 1-2.748-2.657V9.34H8.75V9q0-.197.027-.386.03-.392.09-.77a8 8 0 0 1 .559-1.918 7.2 7.2 0 0 1 2.162-2.801l.098-.076A.24.24 0 0 1 11.83 3c.186 0 .306.202.22.367a19 19 0 0 0-.22.433 18 18 0 0 0-.43.951 14 14 0 0 0-.557 1.578l.054-.013a2.8 2.8 0 0 1 .603-.066h.25q.343.001.661.08m.549-1.405A4.25 4.25 0 0 1 16 9v.25a4.25 4.25 0 0 1-4.25 4.25h-.25A4.25 4.25 0 0 1 8 11.662 4.25 4.25 0 0 1 4.5 13.5h-.25A4.25 4.25 0 0 1 0 9.336V9q0-.275.035-.543c.207-2.62 1.358-4.966 3.488-6.599A1.74 1.74 0 0 1 4.58 1.5c1.341 0 2.146 1.425 1.548 2.564-.111.211-.26.508-.418.86.788.234 1.481.69 2.005 1.297a8.76 8.76 0 0 1 3.058-4.363A1.74 1.74 0 0 1 11.83 1.5c1.341 0 2.146 1.425 1.548 2.564-.111.211-.26.508-.418.86M5.16 6.33a2.8 2.8 0 0 0-.661-.08h-.25a2.8 2.8 0 0 0-.657.079 14 14 0 0 1 .68-1.865A18 18 0 0 1 4.8 3.367.25.25 0 0 0 4.58 3a.24.24 0 0 0-.144.049 8 8 0 0 0-.93.844 7.2 7.2 0 0 0-1.39 2.172 8 8 0 0 0-.498 1.779q-.062.378-.091.77A3 3 0 0 0 1.5 9v.339h.001v.004A2.747 2.747 0 0 0 4.25 12h.251a2.75 2.75 0 0 0 2.75-2.75V9c0-1.29-.89-2.374-2.089-2.67"
                                                clip-rule="evenodd" />
                                        </g>
                                        <defs>
                                            <clipPath id="a">
                                                <path fill="#000" d="M0 0h16v16H0z" />
                                            </clipPath>
                                        </defs>
                                    </g>
                                </svg>
                                <p class="testimony">{{ item.testimony }}</p>
                            </div>
                            <div class="student">
                                <div class="student__img">
                                    <img :src="getResource(item.image?.url).imageUrl" :alt="item.name" />
                                </div>
                                <div class="student__data">
                                    <h2 class="student__name">{{ item.name }}</h2>
                                    <h2 class="student__description" v-if="item.description"> {{ item.description }}</h2>
                                </div>
                            </div>
                        </div>
                    </Slider>
                </client-only>
            </div>
        </div>
    </section>
</template>

<style scoped>
.section__main {
    display: flex;
    flex-direction: column;
    height: auto;
}

.content__bg {
    padding: var(--padding-section);
    background-color: var(--bg-color-testimonies);
}

.content {
    display: flex;
    flex-direction: column;
    margin: auto;
    max-width: var(--max-width);
    /* overflow: hidden; */
    gap: 50px;
}

.content .texts .title {
    color: var(--title-color-testimonies);
}

.content .texts .description {
    color: var(--text-color-testimonies);
}

/* ESTILOS DEL CARD-SECTION / SLIDER*/
.card__section {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /* width: calc(100% / 3); */
    height: auto;
    border-radius: var(--border-radius-card);
    overflow: hidden;
    background-color: var(--bg-color-card);
    padding: 25px;
    gap: 20px;
}

.student {
    display: flex;
    align-items: center;
    width: auto;
    gap: 15px;
}

.student__data {
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: auto;
}

.student__img {
    border-radius: 50%;
    height: 70px;
    width: 70px;
    overflow: hidden;
}

.student__name {
    width: auto;
    height: max-content;
    color: var(--title-color-card);
    font-size: 1.2rem;
}

.student__description {
    width: auto;
    height: max-content;
    color: var(--title-color-card);
    font-size: 1rem;
    font-weight: 400;
}

.testimony__content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 20px;
    color: var(--text-color-card);
}

.testimony {
    font-size: var(--font-size-card);
}

svg {
    width: 50px;
    top: 0;
    left: 0;
    height: auto;
    color: var(--primary-color);
    opacity: 0.4;
}
</style>