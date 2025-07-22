<script setup>
import { marked } from 'marked'
import 'github-markdown-css/github-markdown.css'

const statusHeaderUp = statusHeaderUpStore()
const isActive = ref(false)

const route = useRoute()
const slug = route.params.slug

const { data } = await useApi('footer-configuration')

const legalLinks = data.value?.data?.footer?.legalLinks?.links ?? []
const currentPage = legalLinks.find(link => link.slug === slug)

if (!currentPage) {
    throw createError({ statusCode: 404, message: 'Página no encontrada' })
}

useHead({
    title: 'IFRATI - Legal',
})

// Función para transformar la fecha al formato "16 de mayo del 2025"
function formatDateToSpanish(dateString) {
    const [year, month, day] = dateString.split('T')[0].split('-')
    const date = new Date(Date.UTC(year, month - 1, day))

    return date.toLocaleDateString('es-PE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC'
    }).replace(' de ', ' de ').replace(',', ' del')
}

// Función para insertar la fecha luego del primer título
function insertUpdateDate(markdown, formattedDate) {
    const lines = markdown.split('\n')
    const index = lines.findIndex(line => line.startsWith('# '))
    if (index !== -1) {
        lines.splice(index + 1, 0, `<p class="update__date">Última actualización: ${formattedDate}</p>\n`)
    }
    return lines.join('\n')
}

const markdownContent = currentPage.markdown ?? ''
const rawUpdateDate = currentPage.updateDate ?? ''
const formattedDate = rawUpdateDate ? formatDateToSpanish(rawUpdateDate) : ''

const finalMarkdown = insertUpdateDate(markdownContent, formattedDate)
const htmlContent = ref('')
htmlContent.value = marked.parse(finalMarkdown)

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
    flex-direction: column;
    margin: auto;
    max-width: var(--max-width);
    overflow: hidden;
    padding: 70px 80px;
}

.markdown-body {
    background-color: white;
}

::v-deep(.update__date) {
    font-size: .9rem;
    color: rgb(75, 75, 75);
}

::v-deep(del) {
    text-decoration: line-through !important;
}

::v-deep(u) {
    text-decoration: underline !important;
}

::v-deep(p) {
    color: var(--text-color);
}

::v-deep(.markdown-body li) {
    color: var(--text-color);
}

::v-deep(h1) {
    color: var(--primary-color);
}

::v-deep(h2),
::v-deep(h3),
::v-deep(h4),
::v-deep(h5),
::v-deep(h6) {
    color: var(--title-color);
}

@media (max-width: 1024px) {
    .content {
        padding: 70px 20px;
    }
}

@media (max-width: 480px) {
    .content {
        padding: 70px 0px;
    }
}
</style>