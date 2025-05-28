<script setup>
import Hero from '~/components/About/Hero.vue';
import Faq from '~/components/Faq.vue';

const { data } = await useApi('shop-page')
// TODAS LAS CATEGORIAS FILTRADAS ASCEDENTEMENTE POR NOMBRE CON ESTADO TRUE
const dataCategories = await useApi('product-categories?sort[0]=category:asc')
// TODAS LOS PRODUCTOS FILTRADOS ASCEDENTEMENTE POR FECHA DE PUBLICACION CON ESTADO TRUE
/* const dataProduct = await useApi('products?filters[state][$eq]=true&sort[0]=createdAt:asc&populate[product_categories][fields][0]=category&populate[image][fields][0]=url&populate[image][fields][1]=alternativeText&pagination[pageSize]=2&pagination[page]=1&total[page]')
const dataProductFilter = await useApi('api/products?filters[state][$eq]=true&filters[product_categories][category][$eq]=Artesanal&sort[0]=createdAt:asc&populate[product_categories][fields][0]=category&populate[image][fields][0]=url&populate[image][fields][1]=alternativeText') */
/********************* HERO SECTION *********************/
/* CONFIGURACION GLOBAL DEL HERO SECTION */
const hero = data?.value?.data?.sections?.[0] ?? {}

/* DATOS DEL HERO SECTION */
const title = hero.title ?? '' // TITLE
const description = hero?.description ?? '' // DESCRIPTION
const style = hero?.heroStyle ?? {} // STYLES

/********************* SHOP SECTION *********************/
/* CONFIGURACION GLOBAL DEL HERO SECTION */
const shop = data?.value?.data?.sections?.[1] ?? {}

/* DATOS DEL SHOP SECTION */
const titleShop = shop.title ?? '' // TITLE
const subTitleShop = shop.subTitle ?? '' // SUBTITLE
const whatsappLink = shop.whatsappLink ?? '' // SUBTITLE
/* STYLOS DEL SHOP */
const shopBgColor = shop.sectionStyle?.backgroundColor ?? null
const shopTitleColor = shop.sectionStyle?.titleColor ?? null
const shopTextCoolor = shop.sectionStyle?.textColor ?? null

/* STYLOS DE LA CARD */
const cardBgColor = shop.cardStyle?.backgroundColor ?? null
const cardTitleColor = shop.cardStyle?.titleColor ?? null
const cardTextColor = shop.cardStyle?.textColor ?? null

/********************* CATEGORIES / PRODUCTS *********************/
const categories = dataCategories?.data ?? []
/* const products = dataProduct?.data ?? [] */

// Estado para la categoría seleccionada
const currentPage = ref(1)
const pageSize = ref(2)
const selectedCategory = ref('all')

const products = ref([])  // productos actuales
const totalPages = ref(1) // total páginas que devuelve la API
const totalProducts = ref(0)

function buildQuery() {
  let base = `products?filters[product_categories][publishedAt][$notNull]=true`

  // Filtro por categoría seleccionada
  if (selectedCategory.value !== 'all') {
    base += `&filters[product_categories][category][$eq]=${encodeURIComponent(selectedCategory.value)}`
  }

  // Orden por fecha de creación
  base += `&sort[0]=createdAt:desc`

  // Paginación
  base += `&pagination[pageSize]=${pageSize.value}&pagination[page]=${currentPage.value}`

  // Populate para categoría (nombre y estado) e imagen
  base += `&populate[product_categories][fields][0]=category`
  /* base += `&populate[product_categories][fields][1]=state` */
  base += `&populate[image][fields][0]=url`
  base += `&populate[image][fields][1]=alternativeText`

  return base
}

async function fetchProducts() {
  const query = buildQuery()
  const response = await useApi(query)
  if (response?.data) {
    products.value = response.data.value ?? []
    totalPages.value = response.data.value.meta?.pagination?.pageCount ?? 1
    totalProducts.value = response.data.value.meta?.pagination?.total ?? 0
  }
}

watch([currentPage, pageSize, selectedCategory], () => {
  fetchProducts()
}, { immediate: true })

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

// Función para seleccionar categoría
function selectCategory(category) {
  selectedCategory.value = category
  currentPage.value = 1
}

const productsPerPage = computed(() => products.value.data.length)

/********************* FAQS SECTION *********************/
/* CONFIGURACION GLOBAL DEL FAQ SECTION */
const faq = data?.value?.data?.sections?.[2] ?? {}

/* DATOS DEL HERO SECTION */
const titleFaq = faq.title ?? '' // TITLE
const descriptionFaq = faq?.description ?? '' // DESCRIPTION
const pillFaq = faq?.pill ?? {} // PILL
const questions = faq?.questions ?? [] // QUESTIONS
const styleFaq = faq?.sectionStyle ?? {} // STYLES

/********************* CTA SECTION *********************/
/* CONFIGURACION GLOBAL DEL CTA SECTION */
const cta = data?.value?.data?.sections?.[3] ?? {}

/* DATOS DEL ABOUT SECTION */
const titleCta = cta?.title ?? '' // TITLE
const descriptionCta = cta?.description ?? '' // DESCRIPTION
const buttonCta = cta?.button ?? [] // BUTTON
const styleCta = cta?.ctaStyle ?? {} // STYLES
</script>

<template>
  <div>
    <Hero :title="title" :description="description" :style="style" />

    <section class="shop" :style="{
      '--bg-color-shop': shopBgColor ?? 'var(--background-color)',
      '--title-color-shop': shopTitleColor ?? 'var(--title-color)',
      '--text-color-shop': shopTextCoolor ?? 'var(--text-color)',
    }">
      <div class="container">
        <h1 class="title__shop">{{ titleShop }}</h1>

        <div class="shop__container">
          <div class="categories__container">
            <h2 class="subTitle__shop">{{ subTitleShop }}</h2>

            <div class="categories__content">
              <button class="category" :class="{ active: selectedCategory === 'all' }" key="all"
                @click="selectCategory('all')">
                Todos
              </button>
              <button class="category" v-for="item in categories.data" :key="item.id"
                :class="{ active: selectedCategory === item.category }" @click="selectCategory(item.category)">
                {{ item.category }}
              </button>
            </div>
          </div>
          <div class="products__container">
            <p class="quantity__products">
              Mostrando {{ productsPerPage }} productos de {{ totalProducts }}
            </p>
            <div class="products__content">
              <div class="card__container" :style="{
                '--bg-color-card': cardBgColor ?? 'var(--background-color)',
                '--title-color-card': cardTitleColor ?? 'var(--title-color)',
                '--text-color-card': cardTextColor ?? 'var(--text-color)',
              }">
                <div class="card" v-for="product in products.data" :key="product.id">
                  <div class="product__image">
                    <img :src="getResource(product.image?.url).imageUrl" alt="">
                    <p class="tag" :class="{
                      'tag--nuevo': product.tag === 'Nuevo',
                      'tag--mas-vendido': product.tag === 'Mas vendido',
                      'tag--oferta': product.tag === 'Oferta',
                      'tag--otro': product.tag !== 'Nuevo' && product.tag !== 'Mas vendido' && product.tag !== 'Oferta'
                    }">
                      {{ product.tag }}
                    </p>

                  </div>
                  <div class="card__content">
                    <div class="product__container">
                      <div class="product__details">
                        <h1 class="card__text">{{ product.title }}</h1>
                        <h1 class="card__price">S/ {{ product.price }}</h1>
                      </div>
                      <p class="product__description">{{ product.description }}</p>
                    </div>
                    <div class="icon__content">
                      <a class="icon"
                        :href="`${whatsappLink}?text=Hola,%20estoy%20interesado%20por%20este%20producto:%20*${encodeURIComponent(product.title)}*%0ACon%20este%20precio:%20*S/%20${product.price}*%0AQuisiera%20más%20información,%20por%20favor.`"
                        target="_blank" rel="noopener noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24">
                          <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="1">
                            <path d="M4 19a2 2 0 1 0 4 0 2 2 0 1 0-4 0m11 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0" />
                            <path d="M17 17H6V3H4" />
                            <path d="m6 5 14 1-1 7H6" />
                          </g>
                        </svg>
                      </a>
                      <p>Pedir producto</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="pagination" v-if="totalPages > 1">
                <button class="button left" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="4" d="M31 36L19 24l12-12" />
                  </svg>
                </button>
                <div class="button__number__container">
                  <button class="button number" v-for="page in totalPages" :key="page" @click="goToPage(page)"
                    :class="{ active: currentPage === page }">
                    {{ page }}
                  </button>
                </div>
                <button class="button right" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="4" d="m19 12l12 12l-12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Faq :title="titleFaq" :description="descriptionFaq" :pill="pillFaq" :questions="questions" :style="styleFaq" />

    <Cta :title="titleCta" :description="descriptionCta" :button="buttonCta" :style="styleCta" />
  </div>
</template>

<style scoped>
button {
  all: unset;
  cursor: pointer;
}

.shop {
  display: flex;
  height: auto;
  min-height: 900px;
  background-color: var(--bg-color-shop);
  padding: var(--padding-section);
}

.container {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: var(--max-width);
  gap: 50px;
}

.shop__container {
  display: flex;
  height: auto;
  gap: 30px;
}

.title__shop {
  color: var(--title-color-shop);
}

.subTitle__shop {
  font-weight: 600;
  font-size: clamp(1.1rem, 3vw, 1.2rem);
  color: var(--title-color-shop);
}

.category {
  color: var(--text-color-shop);
  padding: 10px;
  cursor: pointer;
  border-radius: 10px;
  transition: all .3s ease;
}

.quantity__products {
  color: var(--text-color-shop);
}

.category.active {
  background-color: var(--primary-color);
  color: #fff;
}

.category:hover:not(.active) {
  background-color: rgba(0, 0, 0, 0.07);
}

.categories__container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 25%;
}

.categories__content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.products__container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 75%;
  height: auto;
}

.card__container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  height: auto;
}

.card:hover .product__image img {
  scale: 1.2;
}

.card:hover {
  box-shadow: var(--box-shadow);
}

.card__text {
  max-width: 85%;
  font-size: clamp(1.1rem, 3vw, 1.2rem);
  color: var(--title-color-card);
}

.card__price {
  color: var(--primary-color);
  font-weight: 800;
  font-size: clamp(1.2rem, 3vw, 1.2rem);
}

.product__description {
  color: var(--text-color-card);
}

.product__image img {
  transition: all 0.6s ease;
}

.products__content {
  display: flex;
  flex-direction: column;
  gap: 50px;
  height: auto;
}

.card {
  flex: 1 1 calc(33.333% - 20px);
  box-sizing: border-box;
  border: 1px solid rgba(185, 185, 185, 0.3);
  border-radius: var(--border-radius-card);
  overflow: hidden;
  max-width: calc(100% / 3);
  transition: box-shadow .6s ease;
  background-color: var(--bg-color-card);
}

.card__content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: auto;
  justify-content: space-between;
  gap: 20px;
  height: calc(100% - 200px);
}

.product__container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.product__details {
  display: flex;
  justify-content: space-between;
}

.product__details h1 {
  width: auto;
}

.product__image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.tag {
  position: absolute;
  top: 0;
  right: 0;
  color: white;
  background-color: var(--primary-color);
  width: auto;
  padding: 4px 8px;
  margin: 10px;
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 700;
}

.tag--nuevo {
  background-color: #3B82F6;
}

.tag--mas-vendido {
  background-color: green;
}

.tag--oferta {
  background-color: #F43F5E;
}

.tag--otro {
  background-color: var(--primary-color);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.button {
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all .3s ease;
  pointer-events: all;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  color: rgba(0, 0, 0, 0.685);
  border: 1px solid rgb(161, 161, 161);
}

.button__number__container {
  display: flex;
  width: auto;
  gap: 5px;
}

.button:hover {
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.button.number:hover {
  color: var(--primary-color);
}

.button.left,
.button.right {
  width: 40px;
  height: 40px;
}

.button.number {
  border-radius: 10px;
  width: 30px;
  height: 30px;
  color: var(--text-color-shop);
}

.button.number.active {
  background-color: var(--primary-color);
  color: white;
  border: none;
  font-weight: bold;
  border: 1px solid var(--primary-color);
}

button svg {
  width: 30px;
}

.icon__content {
  display: flex;
  overflow: hidden;
  padding: 6px;
  border-radius: 10px;
  cursor: pointer;
  gap: 15px;
  max-width: 40px;
  max-height: 50px;
  align-items: center;
  height: max-content;
  transition: all 0.4s ease;
  color: rgb(0, 0, 0);
  border: 1px solid rgba(185, 185, 185, 0.3);
}

.icon {
  min-width: 25px;
  max-width: 25px;
  max-height: 25px;
  min-height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon__content p {
  white-space: nowrap;
  font-weight: 500;
  opacity: 0;
  transition: opacity .3s ease;
  font-weight: 400;
  font-size: .9rem;
}

.icon__content:hover {
  max-width: 160px;
  background-color: var(--primary-color);
  color: white;
}

.icon__content:hover p {
  opacity: 1;
}

svg {
    width: 30px;
    height: auto;
}
</style>