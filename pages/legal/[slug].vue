<script setup>
import { marked } from 'marked'
import 'github-markdown-css/github-markdown.css'
/* OBTENER ESTADO DEL HEADER-UP */
const statusHeaderUp = statusHeaderUpStore()
const isActive = ref(false)

const route = useRoute()
const slug = route.params.slug

const { data } = await useApi('footer-configuration')

// Buscar el markdown correspondiente
const legalLinks = data.value?.data?.footer?.legalLinks?.links ?? []
const currentPage = legalLinks.find(link => link.slug === slug)

if (!currentPage) {
    // Redirige o muestra 404 si no existe
    throw createError({ statusCode: 404, message: 'Página no encontrada' })
}

const markdownContent = currentPage.markdown ?? ''
const htmlContent = ref('')
htmlContent.value = marked.parse(markdownContent)
// HEADER STATUS
isActive.value = statusHeaderUp.isActive
</script>

<template>
    <section :style="{
        '--header-height': isActive ? '110px' : '70px',
        paddingTop: 'var(--header-height)'
    }">
        <div class="content">
            <div class="markdown-body" v-html="htmlContent" />
        </div>
    </section>
</template>

<style scoped>
section {
    display: flex;
    height: auto;
    background-color: var(--bg-color-mission);
    padding: var(--padding-section);
}

.content {
    display: flex;
    margin: auto;
    max-width: var(--max-width);
    overflow: hidden;
    gap: 50px;
    padding: 30px 0;
}

::v-deep(del) {
    text-decoration: line-through !important;
}

::v-deep(u) {
    text-decoration: underline !important;
}
</style>