<script setup>
const props = defineProps({
    /* SHOP DATA */
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    component: {
        type: Object,
        required: true,
    },
    button: {
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

// RECUPERAMOS EL TITLE DEL COMPONENT
const titleProduct = props.component?.title ?? ''
const fomarttedTitleProduct = ref(getTextFormated(titleProduct))

/* STYLOS DE LA SHOP SECTION */
const bgColor = props.styles?.backgroundColor?.color ?? null
const titleColor = props.styles?.titleColor?.color ?? null
const textColor = props.styles?.textColor?.color ?? null

/* STYLOS DE LA CARD PRODUCTS SECTION */
const bgColorCard = props.component?.cardStyles?.backgroundColor?.color ?? null
const titleColorCard = props.component?.cardStyles?.titleColor?.color ?? null
const textColorCard = props.component?.cardStyles?.textColor?.color ?? null

/*========== API PARA OBTENER LOS PRODUCTOS ==========*/
const { data } = await useApi('products?filters[featureProduct][$eq]=true')
/*========== OBTENER CANTIDAD DE CARDS ACTIVAS ==========*/
const activeCardsCount = computed(() => data.value?.data?.length || 0)
/* OBTNER CANTIDAD DE CARDS VISIBLES */
const visibleCards = 4

</script>

<template>
    <section>
        <div class="content__bg" :style="{
            /* COLORES DE LA SECCION */
            '--bg-color-shop': bgColor ?? 'var(--background-color)',
            '--title-color-shop': titleColor ?? 'var(--title-color)',
            '--text-color-shop': textColor ?? 'var(--text-color)',
        }">
            <div class="content">
                <div class="texts">
                    <h1 class="title" v-html="formattedTitle"></h1>
                    <p class="description" v-html="formattedDescription"></p>
                </div>

                <div class="products__section">
                    <div class="sub__texts">
                        <h1 class="title" v-html="fomarttedTitleProduct"></h1>
                    </div>

                    <div class="product__content" :style="{
                        /* COLORES DE LA CARD */
                        '--bg-color-card': bgColorCard ?? 'var(--background-color)',
                        '--title-color-card': titleColorCard ?? 'var(--title-color)',
                        '--text-color-card': textColorCard ?? 'var(--text-color)',
                    }">
                        <Slider id="productSlider" :totalCards="activeCardsCount" :visibleCards="visibleCards">
                            <div v-for="product in data?.data" :key="product.id" class="card__section">
                                <div class="image">
                                    <img :src="getResource(product.image?.url).imageUrl"
                                        :alt="product.image?.alternativeText || product.productName" />
                                </div>

                                <div class="card__container">
                                    <div class="card__content">
                                        <div class="category">
                                            <span v-for="category in product.product_categories" :key="category.id">
                                                {{ category.categoryName }}
                                            </span>
                                        </div>

                                        <div class="card__texts">
                                            <h1 class="title">{{ product.productName }}</h1>
                                            <p class="description">{{ product.description }}</p>
                                        </div>
                                    </div>
                                    <Button v-for="button in component?.productButton" :key="button.id"
                                        :text="button.text" :style="button.style" :href="button.href"
                                        :icon-url="getResource(button.icon?.url).imageUrl" height="40px"/>
                                </div>
                            </div>
                        </Slider>

                        <Button v-for="button in button" :key="button.id" :text="button.text" :style="button.style"
                            :href="button.href" :icon-url="getResource(button.icon?.url).imageUrl" />
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
    background-color: var(--bg-color-shop);
}

.content {
    display: flex;
    flex-direction: column;
    margin: auto;
    max-width: var(--max-width);
    overflow: hidden;
    gap: 50px;
}

.texts .title {
    color: var(--title-color-shop);
}

.texts .description {
    color: var(--text-color-shop);
}

.sub__texts .title {
    color: var(--title-color-shop);
}

.products__section {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.product__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
}

/* ESTILOS DEL CARD-SECTION / SLIDER*/
.card__section {
    display: flex;
    flex-direction: column;
    /* width: calc(100% / 3); */
    height: auto;
    border-radius: var(--border-radius-card);
    overflow: hidden;
    background-color: var(--bg-color-card);
}

.card__container {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    gap: 20px;
}

.card__content {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.image {
    width: 100%;
    min-height: 250px;
    max-height: 250px;
    overflow: hidden;
    position: relative;
    display: inline-block;
}

img {
    transition: scale .3s ease;
}

.card__section:hover img {
  scale: 1.1;
}

.category {
    display: flex;
    gap: 5px;
}

.category span {
    width: auto;
    padding: 5px;
    border-radius: 10px;
    background-color: var(--secondary-color);
    color: white;
    font-size: 0.7rem;
}

.card__texts {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.card__texts .title {
    color: var(--title-color-card);
    font-size: clamp(1.25rem, 3vw, 1.5rem);
}

.card__texts .description {
    color: var(--text-color-card);
    font-size: var(--font-size-card);
}
</style>