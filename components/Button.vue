<script setup>
import { onMounted } from 'vue'
import { getSvgHtml } from '@/composables/getSvgHtml' // ajusta la ruta si es necesario

const props = defineProps({
    text: String,
    style: String,
    iconUrl: String,
    href: String,
    height: String,
    extraClass: String,
})

const { svgHtml, loadSvg } = getSvgHtml()

onMounted(() => {
    if (props.iconUrl) loadSvg(props.iconUrl)
})
</script>

<template>
    <a class="button" :href="href" :class="[style, extraClass]" :style="{ height: height || '50px' }">
        <span v-if="svgHtml" v-html="svgHtml" />
        {{ text }}
    </a>
</template>

<style scoped>
.button {
    width: max-content;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    gap: 10px;
    transition: filter 0.3s ease;
    border-radius: var(--border-radius-btn);
    box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
}

.PRIMARY {
    color: white;
    background-color: var(--primary-color);
}

.button:hover {
    filter: brightness(97%);
}

.SECONDARY {
    color: var(--primary-color);
    background-color: white;
    border: 1px solid var(--primary-color);
}

.full__width {
    width: 100%;
}

.button:hover {
    filter: brightness(90%);
}
</style>