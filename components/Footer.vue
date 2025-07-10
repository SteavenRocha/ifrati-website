<script setup>
const { data } = await useApi('footer-configuration')

// Config Footer
const logo = data.value?.data?.footer?.logo ?? null
const button = data.value?.data?.footer?.button ?? {}

// FORMATEAR TEXTOS **
const description = data.value?.data?.footer?.description ?? ''
const formattedDescription = ref(getTextFormated(description))

// COLORES
const bgColor = data.value?.data?.footerStyle?.backgroundColor ?? null
const titleColor = data.value?.data?.footerStyle?.titleColor ?? null
const textColor = data.value?.data?.footerStyle?.textColor ?? null
// BG COLOR DEL FOOTER COMPONENT
const bgColorFooterComponent = data.value?.data?.footerComponent?.backgroundColor ?? null

// Links
const quickLinks = data.value?.data?.footer?.quickLinks ?? null
const contactLinks = data.value?.data?.footer?.contactLinks ?? null
const legalLinks = data.value?.data?.footer?.legalLinks ?? null

// ============ OBTENER SVG POR ÍTEM ============ //
// Obtener SVG plano para los contactLinks
const processedContactLinks = reactive([])

if (contactLinks?.links?.length) {
    for (const link of contactLinks.links) {
        const { svgHtml, loadSvg } = getSvgHtml()
        const iconUrl = getResource(link.icon?.url ?? '').imageUrl
        if (iconUrl) {
            await loadSvg(iconUrl)
        }
        processedContactLinks.push({
            ...link,
            svgHtml: svgHtml.value,
        })
    }
}

// Disclaimer, Social y Libro de Reclamaciones
const disclaimer = data.value?.data?.footerComponent?.disclaimer ?? ''
//const socialLinks = data.value?.data?.footerComponent?.socialLinks ?? []
const complaintsBook = data.value?.data?.footerComponent?.complaintsBook ?? null

// FORMATEAR TEXTOS **
const formattedDisclaimer = ref(getTextFormated(disclaimer))
</script>

<template>
    <footer :style="{
        /* COLORES DE LA SECCION */
        '--bg-color-footer': bgColor ?? 'var(--secondary-color)',
        '--title-color-footer': titleColor ?? 'var(--title-color)',
        '--text-color-footer': textColor ?? 'var(--text-color)',
    }">
        <div class="content__bg">
            <div class="content">
                <div class="footer__content">
                    <div class="primary__item">
                        <div class="content__item">
                            <a class="logo" :href="logo?.href">
                                <img v-if="logo?.image?.url" :src="getResource(logo.image.url).imageUrl"
                                    :alt="logo.image.alternativeText || 'Logo'" />
                            </a>
                            <div class="description">
                                <p v-html="formattedDescription"></p>
                            </div>
                        </div>
                        <Button :key="button.id" :text="button.text" :style="button.style" :href="button.href"
                            :icon-url="getResource(button.icon?.url).imageUrl" />
                    </div>
                    <div class="item__container">
                        <!-- Quick Links -->
                        <div v-if="quickLinks" class="item">
                            <h1 class="title__item">{{ quickLinks?.title }}</h1>
                            <div class="links">
                                <a v-for="link in quickLinks?.links" :key="link.id" :href="link.href" class="link">
                                    {{ link.text }}
                                </a>
                            </div>
                        </div>
                        <!-- Contact Links -->
                        <div v-if="contactLinks" class="item">
                            <h1 class="title__item">{{ contactLinks?.title }}</h1>
                            <div class="links">
                                <a v-for="link in processedContactLinks" :key="link.id" :href="link.href"
                                    class="contact__link" :target="link.isExternal ? '_blank' : '_self'">
                                    <span class="icon" v-if="link.svgHtml" v-html="link.svgHtml"></span>
                                    {{ link.text }}
                                </a>
                            </div>
                        </div>
                        <!-- Legal Links -->
                        <div v-if="legalLinks" class="item">
                            <h1 class="title__item">{{ legalLinks.title }}</h1>
                            <div class="links">
                                <a v-for="link in legalLinks.links" :key="link.id" :href="`/legal/${link.slug}`"
                                    class="link">
                                    {{ link.text }}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="footer__component" :style="{
                    /* COLORES DE LA SECCION */
                    '--bg-color-footer--component': bgColorFooterComponent ?? 'var(--secondary-color)'
                }">
                    <!-- Disclaimer -->
                    <div class="disclaimer" v-if="disclaimer">
                        <p v-html="formattedDisclaimer"></p>
                    </div>

                    <!-- Redes Sociales -->
                    <!-- <div class="social" v-if="socialLinks.length">
                        <a v-for="link in socialLinks" :key="link.id" :href="link.href" class="social__link"
                            :target="link.isExternal ? '_blank' : '_self'">
                            <div class="social__icon">
                                <img :src="getResource(link.image?.url).imageUrl" alt="">
                            </div>
                        </a>
                    </div> -->

                    <!-- Libro de Reclamaciones -->
                    <div class="complaints__book" v-if="complaintsBook?.href">
                        <a :href="complaintsBook.href" target="_blank" rel="noopener noreferrer">
                            <div class="image__book">
                                <img :src="getResource(complaintsBook.image?.url).imageUrl" alt="">
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<style scoped>
footer {
    display: flex;
    flex-direction: column;
    height: auto;

    position: relative;
    max-width: none;
    padding: 0;
    margin: 0;
}

.content__bg {
    padding: var(--padding-section);
    background-color: var(--bg-color-footer);
}

.content {
    display: flex;
    flex-direction: column;
    margin: auto;
    max-width: var(--max-width);
    overflow: hidden;
    gap: 50px;
}

.footer__content {
    display: flex;
    justify-content: space-between;
    gap: 15px;
}

.logo {
    width: auto;
    max-width: 150px;
}

.icon {
    min-width: 30px;
    max-width: 30px;
    height: 30px;
}

.item__container {
    display: flex;
    justify-content: space-around;
    width: 70%;
    gap: 15px;
}

.item {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: auto;
}

.primary__item {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 30%;
}

.content__item {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.links {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.link,
.contact__link,
.description {
    color: var(--text-color-footer);
}

.description p {
    font-size: 1rem;
}

.contact__link {
    display: flex;
    gap: 10px;
    align-items: center;
}

.title__item {
    font-size: 1.2rem;
    color: var(--title-color-footer);
}

a {
    width: max-content;
}

.item a:hover {
    color: var(--primary-color);
}

span {
    color: var(--primary-color);
}

.footer__component {
    background-color: var(--bg-color-footer--component);
    display: flex;
    justify-content: space-between;
    padding: 20px;
    border-radius: 20px;
    align-items: center;
    gap: 20px;
}

.disclaimer {
    width: 40%;
}

.social {
    display: flex;
    width: 20%;
    gap: 10px;
}

.complaints__book {
    display: flex;
    width: 60%;
    justify-content: end;
}

.complaints__book a {
    width: 120px;
    height: 80px;
    border-radius: 10px;
    overflow: hidden;
    transition: scale .3s ease;
}

.disclaimer p {
    font-size: 0.8rem;
    color: var(--text-color-footer);
}

.image__book {
    width: 100%;
}

.complaints__book a:hover {
    scale: 1.05;
}

.social__icon {
    width: 45px;
    height: 45px;
    background-color: #3131316b;
    border-radius: 50%;
    padding: 10px;
    transition: scale .3s ease;
}

.social__icon:hover {
    scale: 1.2;
}

.contact__link {
    width: auto;
    max-width: 300px;
}

img {
    object-fit: contain;
}

@media (max-width: 900px) {
    .footer__content {
        flex-direction: column;
        gap: 30px;
    }

    .primary__item {
        width: 60%;
    }

    .item__container {
        width: 100%;
        gap: 30px;
        justify-content: space-between;
    }

    .item {
        gap: 10px;
    }
}

@media (max-width: 550px) {
    .primary__item {
        width: 100%;
    }

    .item__container {
        flex-direction: column;
        gap: 20px;
    }

    .footer__component {
        flex-direction: column;
    }

    .disclaimer {
        width: 100%;
    }

    .complaints__book {
        width: 100%;
        justify-content: start;
    }
}
</style>
