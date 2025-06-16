<script setup>
const props = defineProps({
    /* ABOUT DATA */
    title: {
        type: String,
        required: true,
    },
    pill: {
        type: Object,
        required: true,
    },
    styles: {
        type: Object,
        required: true,
    },
    brands: {
        type: Object,
        required: true,
    },
})

// FORMATEAR EL TITULO Y DESCRIPTION **
const formattedTitle = ref(getTextFormated(props.title))

/* STYLOS DE BRANDS SECTION */
const bgColor = props.styles?.backgroundColor ?? null
const titleColor = props.styles?.textColor ?? null

// RECUPERAMOS STYLOS DE LA PILL
const bgColorPill = props.pill?.pillStyle?.backgroundColor ?? 'var(--pill-bg-color)'
const textColorPill = props.pill?.pillStyle?.textColor ?? 'var(--pill-text-color)'

/* SCROLLER */
onMounted(() => {
    const scrollers = document.querySelectorAll(".scroller");

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        addAnimation(scrollers);
    }
});

function addAnimation(scrollers) {
    scrollers.forEach((scroller) => {
        scroller.setAttribute("data-animated", true);

        const scrollerInner = scroller.querySelector(".scroller__inner");
        const scrollerContent = Array.from(scrollerInner.children);

        scrollerContent.forEach((item) => {
            const duplicatedItem = item.cloneNode(true);
            duplicatedItem.setAttribute("aria-hidden", true);
            scrollerInner.appendChild(duplicatedItem);
        });
    });
}
</script>

<template>
    <section>
        <div class="content__bg" :style="{
            /* COLORES DE LA SECCION */
            '--bg-color-brands': bgColor ?? 'var(--background-color)',
            '--title-color-brands': titleColor ?? 'var(--title-color)',
        }">
            <div class="content">
                <div class="sub__texts">
                    <Pill :key="pill.id" :text="pill.text" :icon-url="getResource(pill.icon?.url).imageUrl"
                        :bgColor="bgColorPill" :textColor="textColorPill" />
                    <h1 class="title" v-html="formattedTitle"></h1>
                </div>

                <div class="scroller" data-direction="left" data-speed="fast">
                    <div class="scroller__inner">
                        <a v-for="item in brands.brands" :key="item.id" class="brand" :href="item?.href"
                            target="_blank">
                            <img :src="getResource(item?.image?.url).imageUrl"
                                :alt="item?.alternativeText || item.textName" />
                        </a>
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
    background-color: var(--bg-color-brands);
}

.content {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: auto;
    max-width: var(--max-width);
    overflow: hidden;
    gap: 50px;
}

.sub__texts {
    align-items: center;
}

.content .sub__texts .title {
    font-size: 1.5rem;
}

.content .sub__texts .title {
    color: var(--title-color-brands);
}

img {
    object-fit: contain;
}

/* .scroller__inner {
    display: flex;
    justify-content: center;
    gap: 50px;
} */

.brand {
    width: 200px;
    height: auto;
    transition: scale .3s ease;
}

.brand:hover {
    scale: 1.1;
}

.scroller__inner {
    padding-block: 1rem;
    display: flex;
    flex-wrap: wrap;
    gap: 50px;
}

.scroller[data-animated="true"]:hover .scroller__inner {
    animation-play-state: paused;
}

.scroller[data-animated="true"] {
    overflow: hidden;
    -webkit-mask: linear-gradient(90deg,
            transparent,
            white 20%,
            white 80%,
            transparent);
    mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
}

.scroller[data-animated="true"] .scroller__inner {
    width: max-content;
    flex-wrap: nowrap;
    animation: scroll var(--_animation-duration, 40s) var(--_animation-direction, forwards) linear infinite;
}

.scroller[data-direction="right"] {
    --_animation-direction: reverse;
}

.scroller[data-direction="left"] {
    --_animation-direction: forwards;
}

.scroller[data-speed="fast"] {
    --_animation-duration: 20s;
}

.scroller[data-speed="slow"] {
    --_animation-duration: 60s;
}

@keyframes scroll {
    to {
        transform: translate(calc(-50% - 0.5rem));
    }
}

@media (max-width: 1024px) {
    .sub__texts {
        width: 80%;
    }
}

@media (max-width: 640px) {
    .sub__texts {
        width: 100%;
    }
}
</style>