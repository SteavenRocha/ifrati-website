<script setup>

const { data } = await useApi('header-configuration')
const statusHeaderUp = statusHeaderUpStore()

// Config Header
const logo = data.value?.data?.header?.logo ?? null
const links = data.value?.data?.header?.links ?? []
const button = data.value?.data?.header?.button ?? null
const colors = data.value?.data?.header?.headerStyle ?? null

// Config HeaderUp
const rawItemsData = data.value?.data?.headerUp?.data ?? []
const colorsUp = data.value?.data?.headerUp?.headerUpStyle ?? null
const isActive = data.value?.data?.headerUp?.isActive ?? false
statusHeaderUp.setIsActive(isActive)

// COLORES
const headerUpBgColor = colorsUp?.backgroundColor ?? null
const headerUpTextColor = colorsUp?.textColor ?? null
const headerBgColor = colors?.backgroundColor ?? null
const headerTextColor = colors?.textColor ?? null

// LOGO
const imagePath = logo?.image?.url ?? ''
const { imageUrl } = getResource(imagePath)
const hrefLogo = logo?.href ?? '#'
const altLogo = logo?.image?.alternativeText ?? 'Logo'

// BOTÓN HEADER
const iconPath = button?.icon?.url ?? ''
const { imageUrl: iconUrl } = getResource(iconPath)
const text = button?.text ?? ''
const style = button?.style ?? ''
const hrefButton = button?.href ?? '#'

// ============ OBTENER SVG POR ÍTEM ============ //
const itemsData = reactive([])
for (const item of rawItemsData) {
    const { svgHtml, loadSvg } = getSvgHtml()
    const { imageUrl: iconUrl } = getResource(item.icon?.url ?? '')
    await loadSvg(iconUrl)
    itemsData.push({
        ...item,
        svgHtml: svgHtml.value,
    })
}
</script>

<template>
    <header :style="{
        '--header-bg': headerBgColor ?? 'var(--background-color)',
        '--header-text': headerTextColor ?? 'var(--title-color)',
        '--headerUp-bg': headerUpBgColor ?? 'var(--background-color)',
        '--headerUp-text': headerUpTextColor ?? 'var(--text-color)',
    }">
        <!-- Header-Up -->
        <div v-if="isActive" class="secondary__bg">
            <div class="secondary__content">
                <div class="social"></div>
                <div class="data">
                    <a v-for="item in itemsData" :key="item.id" :href="item.href" target="_blank">
                        <span v-if="item.svgHtml" v-html="item.svgHtml" />
                        {{ item.text }}
                    </a>
                </div>
            </div>
        </div>

        <!-- Header -->
        <div class="primary__bg">
            <div class="primary__content">
                <a class="logo" :href="hrefLogo">
                    <img :src="imageUrl" :alt="altLogo" />
                </a>
                <nav>
                    <ul class="nav__links">
                        <li v-for="link in links" :key="link.id">
                            <a :href="link.href">{{ link.text }}</a>
                        </li>
                    </ul>
                </nav>
                <Button :text="text" :style="style" :icon-url="iconUrl" :href="hrefButton" height="40px" />
            </div>
        </div>
    </header>
</template>

<style scoped>
header {
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    top: 0;
    left: 0;
    height: auto;
    max-height: 110px;
    box-shadow: var(--box-shadow);
    z-index: 20;
}

.primary__bg {
    display: flex;
    justify-content: center;
    background-color: var(--header-bg);
    padding: 0 var(--padding-width);
}

.primary__content {
    width: 100%;
    max-width: var(--max-width);
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.logo {
    display: flex;
    align-items: center;
    justify-content: start;
    padding: 15px 0;
    width: auto;
    max-width: 150px;
    height: 100%;
    cursor: pointer;
}

img {
    object-fit: contain;
}

/* CONTENIDO DEL HEADER SUPERIOR */
.secondary__bg {
    background-color: var(--headerUp-bg);
    display: flex;
    justify-content: center;
    border-bottom: 1px solid rgb(212, 212, 212);
    padding: 0 var(--padding-width);
}

.secondary__content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 40px;
    max-width: var(--max-width);
}

.social {
    width: 40%;
}

.data {
    display: flex;
    justify-content: end;
    align-items: center;
    gap: 20px;
    width: 60%;
    height: 100%;
}

.data a {
    display: flex;
    justify-content: end;
    align-items: center;
    color: var(--headerUp-text);
    position: relative;
    gap: 10px;
    width: auto;
    height: 100%;
    cursor: pointer;
}

.data a:hover {
    color: var(--primary-color);
}

.data a:not(:last-child) {
    padding-right: 20px;
}

.data a:not(:last-child)::after {
    content: "";
    position: absolute;
    right: 0;
    height: 100%;
    width: 1px;
    background-color: rgb(212, 212, 212);
    top: 50%;
    transform: translateY(-50%);
}

.data span {
    color: var(--primary-color);
}

/* NAVEGACION DEL HEADER */
nav {
    display: flex;
    justify-content: center;
    align-items: center;
    width: auto;
}

header ul {
    padding: 0;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

header ul li {
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
    width: auto;
}

header ul li a {
    position: relative;
    margin: 0 15px;
    letter-spacing: 0.5px;
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
    border-bottom: 3px solid transparent;
    width: auto;
    height: auto;
    color: var(--header-text);
    transition:
        border-bottom 0.3s,
        color 0.3s;
}

header ul li a:hover {
    color: var(--primary-color);
    border-bottom: 3px solid var(--primary-color);
}
</style>