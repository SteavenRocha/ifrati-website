<script setup>
import { getSvgHtml } from '@/composables/getSvgHtml'

const props = defineProps({
    text: String,
    iconUrl: String,
    textColor: String,
    bgColor: String,
})

const { svgHtml, loadSvg } = getSvgHtml()

if (props.iconUrl) await loadSvg(props.iconUrl)

</script>

<template>
    <div class="pill" :style="{
        color: textColor,
        backgroundColor: bgColor
    }">
        <span v-if="svgHtml" v-html="svgHtml" />
        {{ text }}
    </div>
</template>

<style scoped>
.pill {
    display: flex;
    width: max-content;
    align-items: center;
    padding: 5px 10px;
    border-radius: 5px;
    gap: 5px;
    font-size: 0.9rem;
    font-weight: 450;
}

.pill span {
    display: flex;
    align-items: center;
    width: 18px;
    height: 18px;
}
</style>