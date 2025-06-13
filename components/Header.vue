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

/* BURGER */
const isMenuOpen = ref(false)

watch(isMenuOpen, (newVal) => {
    if (window.matchMedia('(max-width: 480px)').matches) {
        document.body.style.overflow = newVal ? 'hidden' : ''
    }
})
</script>

<template>
    <header :style="{
        '--header-bg': headerBgColor ?? 'var(--background-color)',
        '--header-text': headerTextColor ?? 'var(--title-color)',
        '--headerUp-bg': headerUpBgColor ?? 'var(--background-color)',
        '--headerUp-text': headerUpTextColor ?? 'var(--text-color)',
        '--sticky': isActive ? '110px' : '70px'
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
                    <ul :class="['nav__links', { open: isMenuOpen }]">
                        <li v-for="link in links" :key="link.id">
                            <a :href="link.href">{{ link.text }}</a>
                        </li>
                    </ul>
                </nav>
                <Button :text="text" :style="style" :icon-url="iconUrl" :href="hrefButton" height="40px" />
            </div>

            <label class="burger">
                <input type="checkbox" id="burger" v-model="isMenuOpen">
                <span></span>
                <span></span>
                <span></span>
            </label>
        </div>

        <div :class="['menu-overlay', { hidden: !isMenuOpen }]" @click="isMenuOpen = false"></div>
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
    align-items: center;
    gap: 30px;
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
    height: 40px;
}

.secondary__content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    max-width: var(--max-width);
}

.social {
    display: none;
}

.data {
    display: flex;
    justify-content: end;
    align-items: center;
    gap: 20px;
    width: 100%;
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
    z-index: 99;
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

.menu-overlay {
    position: fixed;
    top: var(--sticky);
    left: 0;
    width: 100vw;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 1;
    transition: opacity 0.3s ease;
    z-index: 98;
}

.menu-overlay.hidden {
    opacity: 0;
    pointer-events: none;
}


/* MENU BUTTON */
.burger {
    position: relative;
    min-width: 40px;
    max-width: 40px;
    height: 30px;
    background: transparent;
    cursor: pointer;
    display: none;
}

.burger input {
    display: none;
}

.burger span {
    display: block;
    position: absolute;
    height: 4px;
    width: 100%;
    background: var(--header-text);
    border-radius: 9px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: .25s ease-in-out;
}

.burger span:nth-of-type(1) {
    top: 0px;
    transform-origin: left center;
}

.burger span:nth-of-type(2) {
    top: 50%;
    transform: translateY(-50%);
    transform-origin: left center;
}

.burger span:nth-of-type(3) {
    top: 100%;
    transform-origin: left center;
    transform: translateY(-100%);
}

.burger input:checked~span:nth-of-type(1) {
    transform: rotate(45deg);
    top: 0px;
    left: 5px;
}

.burger input:checked~span:nth-of-type(2) {
    width: 0%;
    opacity: 0;
}

.burger input:checked~span:nth-of-type(3) {
    transform: rotate(-45deg);
    top: 28px;
    left: 5px;
}

@media (max-width: 1024px) {
    .burger {
        display: block;
    }

    header ul {
        position: fixed;
        display: block;
        overflow-y: scroll;
        width: 35%;
        height: 100%;
        top: var(--sticky);
        right: -100%;
        padding: 40px 30px;
        background-color: var(--header-bg);
        transition:
            top 0.3s ease-in-out,
            right 0.3s ease-in-out;
    }

    header ul li {
        padding: 10px 0;
        justify-content: start;
    }

    header ul li a {
        font-size: 1.25rem;
    }

    header ul.open {
        background-color: var(--header-bg);
        transition:
            top 0.3s ease-in-out,
            right 0.3s ease-in-out;
        top: var(--sticky);
        border-top: 1px solid rgb(212, 212, 212);
    }

    header ul.open {
        right: 0;
    }

    .data {
        gap: 10px;
    }

    .primary__bg {
        gap: 10px;
    }
}

@media (max-width: 900px) {
    header ul {
        width: 40%;
    }
}

@media (max-width: 480px) {
    header ul {
        width: 100%;
    }

    header ul li a {
        font-size: 1.5rem;
    }

    .no-scroll {
        overflow: hidden;
    }

    .secondary__content .data a:not(:first-of-type) {
        display: none;
    }

    .data a:not(:last-child)::after {
        background-color: transparent;
    }

    .data a:not(:last-child) {
        padding-right: 0;
    }
}
</style>