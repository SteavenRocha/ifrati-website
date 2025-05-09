<script setup>
import { ref, computed, watch, onMounted } from 'vue'

// Props
const props = defineProps({
    title: { type: String, required: true },
    description: { type: String, required: true },
    component: { type: Object, required: true },
    styles: { type: Object, required: true },
})

// Formateo de texto
const formattedTitle = computed(() => getTextFormated(props.title))
const formattedDescription = computed(() => getTextFormated(props.description))

// Estilos
const bgColor = props.styles?.backgroundColor?.color ?? null
const titleColor = props.styles?.titleColor?.color ?? null
const textColor = props.styles?.textColor?.color ?? null

// Estilos del faq card
const bgColorCard = props.component?.cardStyles?.backgroundColor?.color ?? null
const titleColorCard = props.component?.cardStyles?.titleColor?.color ?? null
const textColorCard = props.component?.cardStyles?.textColor?.color ?? null

// Guarda la última pregunta abierta por categoría
const lastOpenedQuestionByCategory = ref({})

// Categoría seleccionada
const selectedCategory = ref(props.component?.faqComponent?.[0]?.category ?? null)

// Pregunta activa
const activeQuestion = ref(null)

// Computed para datos de la categoría seleccionada
const selectedCategoryData = computed(() => {
    return props.component?.faqComponent?.find(c => c.category === selectedCategory.value)
})

onMounted(() => {
    const firstCategory = props.component?.faqComponent?.[0]
    if (firstCategory?.faq?.[0]) {
        activeQuestion.value = firstCategory.faq[0].id
        lastOpenedQuestionByCategory.value[firstCategory.category] = firstCategory.faq[0].id
    }
})

// Observa cambios de categoría
watch(selectedCategory, (newCategory) => {
    const categoryData = props.component?.faqComponent.find(c => c.category === newCategory)
    const lastOpened = lastOpenedQuestionByCategory.value[newCategory]
    if (lastOpened !== undefined && lastOpened !== null) {
        activeQuestion.value = lastOpened
    } else if (categoryData?.faq?.[0]) {
        activeQuestion.value = categoryData.faq[0].id
        lastOpenedQuestionByCategory.value[newCategory] = activeQuestion.value
    }
})

// Alternar pregunta
function toggleQuestion(faqId) {
    activeQuestion.value = activeQuestion.value === faqId ? null : faqId
    if (activeQuestion.value) {
        lastOpenedQuestionByCategory.value[selectedCategory.value] = activeQuestion.value
    }
}
</script>

<template>
    <section>
        <div class="content__bg" :style="{
            '--bg-color-faq': bgColor ?? 'var(--background-color)',
            '--title-color-faq': titleColor ?? 'var(--title-color)',
            '--text-color-faq': textColor ?? 'var(--text-color)',
        }">
            <div class="content">
                <div class="texts">
                    <h1 class="title" v-html="formattedTitle"></h1>
                    <p class="description" v-html="formattedDescription"></p>
                </div>

                <div class="faq__content" :style="{
                    '--bg-color-card': bgColorCard ?? 'var(--background-color)',
                    '--title-color-card': titleColorCard ?? 'var(--title-color)',
                    '--text-color-card': textColorCard ?? 'var(--text-color)',
                }">
                    <!-- Botones de categoría -->
                    <div class="category">
                        <Button v-for="button in component?.faqComponent" :key="button.id" :text="button.category"
                            :icon-url="getResource(button.icon?.url).imageUrl"
                            :extra-class="`${selectedCategory === button.category ? 'PRIMARY' : 'SECONDARY'} full__width`"
                            @click="selectedCategory = button.category" />
                    </div>

                    <!-- Transición de contenido -->
                    <Transition name="fade" mode="out-in">
                        <div v-if="selectedCategoryData" :key="selectedCategoryData.id" class="faq__container">
                            <div class="faq" v-for="faq in selectedCategoryData.faq" :key="faq.id">
                                <div class="question__icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path
                                            d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM13 13.3551V14H11V12.5C11 11.9477 11.4477 11.5 12 11.5C12.8284 11.5 13.5 10.8284 13.5 10C13.5 9.17157 12.8284 8.5 12 8.5C11.2723 8.5 10.6656 9.01823 10.5288 9.70577L8.56731 9.31346C8.88637 7.70919 10.302 6.5 12 6.5C13.933 6.5 15.5 8.067 15.5 10C15.5 11.5855 14.4457 12.9248 13 13.3551Z">
                                        </path>
                                    </svg>
                                </div>
                                <div class="question__answer">
                                    <div class="question__content" @click="toggleQuestion(faq.id)">
                                        <h2 class="question" v-html="getTextFormated(faq.question)"></h2>
                                        <div class="down__icon" :class="{ rotate: activeQuestion === faq.id }">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                fill="currentColor">
                                                <path
                                                    d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z">
                                                </path>
                                            </svg>
                                        </div>
                                    </div>

                                    <div class="answer" :class="{ open: activeQuestion === faq.id }">
                                        <p v-html="getTextFormated(faq.answer)"></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>
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
    background-color: var(--bg-color-faq);
    overflow: hidden;
}

.content {
    display: flex;
    flex-direction: column;
    margin: auto;
    max-width: var(--max-width);
    gap: 50px;
}

.texts .title {
    color: var(--title-color-faq);
}

.texts .description {
    color: var(--text-color-faq);
}

.category {
    display: flex;
    justify-content: center;
    gap: 20px;
}

.faq__content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.faq__container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: all .3s ease;
}

.faq {
    display: flex;
    border-radius: var(--border-radius-card);
    gap: 10px;
    padding: 10px;
    background-color: var(--bg-color-card);
}

.question__answer {
    display: flex;
    flex-direction: column;
}

.question__content {
    cursor: pointer;
    display: flex;
    align-items: center;
}

.answer {
    width: 80%;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
}

.answer p {
    padding-top: 10px;
    font-size: var(--font-size-card);
    color: var(--text-color-card);
}

.answer.open {
    max-height: 300px;
}

.down__icon {
    transition: transform 0.3s ease;
    display: inline-block;
}

.down__icon.rotate {
    transform: rotate(180deg);
}
    
.question {
    font-size: var(--font-size-card);
    font-weight: 600;
    color: var(--title-color-card);
}

.question__icon {
    color: var(--primary-color);
    width: 25px;
    height: 25px;
}

.down__icon {
    width: 20px;
}

/* TRANSICIONES */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>