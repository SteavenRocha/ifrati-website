<script setup>
const props = defineProps({
    /* ABOUT DATA */
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
})

// FORMATEAR EL TITULO Y DESCRIPTION **
const formattedTitle = ref(getTextFormated(props.title))
const formattedDescription = ref(getTextFormated(props.description))

</script>

<template>
    <section>
        <div class="content__bg">
            <div class="content">
                <div class="texts">
                    <h1 class="title" v-html="formattedTitle"></h1>
                    <p class="description" v-html="formattedDescription"></p>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
section {
    display: flex;
    height: auto;
    background-color: var(--bg-color-hero);
    padding: var(--padding-section);
    padding-top: 90px;
    scroll-margin-top: 110px;
}

.content {
    display: flex;
    margin: auto;
    max-width: var(--max-width);
    overflow: hidden;
    gap: 50px;
}
</style>