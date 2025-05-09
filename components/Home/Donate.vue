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
    cta: {
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

/* STYLOS DEL DONATE SECTION */
const bgColor = props.styles?.backgroundColor?.color ?? null
const titleColor = props.styles?.titleColor?.color ?? null
const textColor = props.styles?.textColor?.color ?? null

/* DATA DEL CTA TESTIMONY */
/* OBTENER CANTIDAD DE CARDS ACTIVAS */
const activeCardsCount = computed(() => props.cta?.testimonies?.testimoniesCard?.filter(c => c.isActive).length)
/* OBTNER CANTIDAD DE CARDS VISIBLES */
const visibleCards = 1

/* RECUPERAR LA SIDEIMAGE */
const imagePath = props.cta.sideImage?.url ?? ''  // SIDEIMAGE
const { imageUrl: imageUrl } = getResource(imagePath)
const altImage = props.cta.sideImage?.alternativeText ?? ''

/* DETERMINAR Z-INDEX DE LAS IMAGENES */
function getZIndex(index) {
    const distance = Math.abs(index - positionSlider.position);
    return 10 - distance;
}

/* STYLOS DEL CARD PRINCIPAL SECTION */
const bgColorPrimaryCard = props.cta?.componentStyles?.backgroundColor?.color ?? null
const titleColorPrimaryCard = props.cta?.componentStyles?.titleColor?.color ?? null
const textColorPrimaryCard = props.cta?.componentStyles?.textColor?.color ?? null

/* STYLOS DEL CARD TESTIMONIO PRINCIPAL SECTION */
const bgColorCard = props.cta?.testimonies?.cardStyles?.backgroundColor?.color ?? null
const titleColorCard = props.cta?.testimonies?.cardStyles?.titleColor?.color ?? null
const textColorCard = props.cta?.testimonies?.cardStyles?.textColor?.color ?? null

</script>

<template>
    <section>
        <div class="content__bg" :style="{
            /* COLORES DE LA SECCION */
            '--bg-color-donate': bgColor ?? 'var(--background-color)',
            '--title-color-donate': titleColor ?? 'var(--title-color)',
            '--text-color-donate': textColor ?? 'var(--text-color)',
        }">
            <div class="content">
                <div class="texts">
                    <h1 class="title" v-html="formattedTitle"></h1>
                    <p class="description" v-html="formattedDescription"></p>
                </div>

                <div class="cta__section">
                    <div class="cta__right__content" :style="{
                        /* COLORES DE LA SECCION */
                        '--bg-color-primary': bgColorPrimaryCard ?? 'var(--background-color)',
                        '--title-color-primary': titleColorPrimaryCard ?? 'var(--title-color)',
                        '--text-color-primary': textColorPrimaryCard ?? 'var(--text-color)',
                    }">
                        <div class="title__content">
                            <h1>{{ cta.number }}</h1>
                            <p>{{ cta.description }}</p>
                        </div>

                        <div class="content__donor__button">
                            <div class="donor__content" :style="{
                                /* COLORES DE LA SECCION */
                                '--bg-color-card': bgColorCard ?? 'var(--background-color)',
                                '--title-color-card': titleColorCard ?? 'var(--title-color)',
                                '--text-color-card': textColorCard ?? 'var(--text-color)',
                            }">
                                <div class="donor__images">
                                    <div class="donor__img__wrapper"
                                        v-for="(donor, index) in props.cta?.testimonies?.testimoniesCard?.filter(c => c.isActive)"
                                        :key="'donor-img-' + index">

                                        <img :src="getResource(donor.image?.url).imageUrl" :alt="donor.name"
                                            :class="{ active: index === positionSlider.position }" :style="{
                                                zIndex: getZIndex(index),
                                                marginLeft: index === 0 ? '0' : '-20px'
                                            }" />

                                        <div class="donor__indicator"
                                            :class="{ active: index === positionSlider.position }" :style="{
                                                marginLeft: index === 0 ? '0' : '-20px'
                                            }"></div>
                                    </div>
                                </div>
                                <Slider id="donateSlider" :totalCards=activeCardsCount :visibleCards=visibleCards>
                                    <div class="card__section"
                                        v-for="(item, index) in props.cta?.testimonies?.testimoniesCard?.filter(c => c.isActive)"
                                        :key="index" :style="{ width: `${100 / activeCardsCount}%` }">
                                        <div class="donor">
                                            <div class="donor__img">
                                                <img :src="getResource(item.image?.url).imageUrl" :alt="item.name" />
                                            </div>
                                            <div class="donor__data">
                                                <h2 class="donor__name">{{ item.name }}</h2>
                                                <p class="donor__description">{{ item.description }}</p>
                                            </div>
                                        </div>

                                        <div class="testimony__content">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"
                                                viewBox="0 0 16 16" fill="currentColor">
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
                                            <p>{{ item.testimony }}</p>
                                        </div>
                                    </div>
                                </Slider>
                            </div>
                            <Button v-for="button in props.cta.button" :key="button.id" :text="button.text"
                                :style="button.style" :href="button.href"
                                :icon-url="getResource(button.icon?.url).imageUrl"/>
                        </div>
                    </div>

                    <div class="side__image ">
                        <img :src="imageUrl" :alt="altImage">
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
}

.content {
    display: flex;
    flex-direction: column;
    margin: auto;
    max-width: var(--max-width);
    overflow: hidden;
    gap: 50px;
}

.content .texts .title {
    color: var(--title-color-donate);
}

.content .texts .description {
    color: var(--text-color-donate);
}

.cta__section {
    display: flex;
    height: auto;
    overflow: hidden;
    gap: 20px;
}

.title__content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-bottom: 1px solid rgb(201, 201, 201);
}

.title__content p,
.title__content h1 {
    text-align: center;
}

.title__content h1 {
    color: var(--title-color-primary);
    font-size: 6rem;
    font-weight: 900;
    cursor: default;
    transition: scale .6s ease;
}

.title__content p {
    width: 80%;
    color: var(--text-color-primary);
}

.content__donor__button {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
}

.cta__right__content {
    width: 40%;
    background-color: var(--bg-color-primary);
    border-radius: var(--border-radius-card);
}

.cta__right__content,
.side__image {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
}

.side__image {
    border-radius: var(--border-radius-card);
    width: 60%;
    height: auto;
    overflow: hidden;
}

.donor__images img.active {
    border: 2px solid var(--primary-color);
    scale: 1.1;
}

.donor__images {
    display: flex;
    height: auto;
    justify-content: center;
}

.donor__img__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    width: auto;
}

.donor__images img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid white;
    transition: border 0.3s ease, scale 0.3s ease;
}

.donor__indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: transparent;
    transition: background-color 0.3s ease;
}

.donor__indicator.active {
    background-color: var(--primary-color);
}

/**/
.card__section {
    display: flex;
    flex-direction: column-reverse;
    justify-content: space-between;
    /* width: calc(100% / 3); */
    height: auto;
    border-radius: var(--border-radius-card);
    background-color: var(--bg-color-card);
    overflow: hidden;
    padding: 20px;
    gap: 25px;
    padding-bottom: 60px;
}

.donor__content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.donor {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 15px;
}

.donor__data {
    width: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: auto;
    z-index: 0;
    gap: 5px;
}

.donor__img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    z-index: 1;
}

.donor__name {
   color: var(--title-color-card);
}

.donor__description {
    color: var(--text-color-card);
    font-size: .9rem;
    font-weight: 400;
}

.testimony__content {
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 10px;
    color: var(--text-color-testimonies);
}

.testimony__content p {
    font-size: var(--font-size-card);
    color: var(--text-color-card);
}

svg {
    width: 40px;
    top: 0;
    left: 0;
    height: auto;
    color: var(--primary-color);
    opacity: 0.4;
}
</style>