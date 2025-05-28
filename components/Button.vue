<script setup>
import { getSvgHtml } from '@/composables/getSvgHtml'

const props = defineProps({
    text: String,
    style: String,
    iconUrl: String,
    href: String,
    height: String,
    extraClass: String,
    type: {
        type: String,
        default: 'button'
    }
})

const { svgHtml, loadSvg } = getSvgHtml()

if (props.iconUrl) await loadSvg(props.iconUrl)

const isLink = computed(() => !!props.href)

</script>

<template>
    <component :is="isLink ? 'a' : 'button'" :href="isLink ? href : undefined" :type="!isLink ? type : undefined"
        class="button" :class="[style, extraClass]" :style="{ height: height || '50px' }">
        {{ text }}
        <span v-if="svgHtml" v-html="svgHtml" />
    </component>
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

button {
    border: none;
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