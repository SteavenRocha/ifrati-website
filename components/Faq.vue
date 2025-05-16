<script setup>
const props = defineProps({
    /* FAQ DATA */
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    pill: {
        type: Object,
        required: true,
    },
    questions: {
        type: Array,
        required: true,
    },
    style: {
        type: Object,
        required: false,
    },
})

// FORMATEAR EL TITULO Y DESCRIPTION **
const formattedTitle = ref(getTextFormated(props.title))
const formattedDescription = ref(getTextFormated(props.description))

/* RECUPERAMOS STYLOS DE LA PILL */
const bgColorPill = props.pill?.pillStyle?.backgroundColor ?? 'var(--pill-bg-color)'
const textColorPill = props.pill?.pillStyle?.textColor ?? 'var(--pill-text-color)'

/* STYLOS */
const bgColor = props.style?.backgroundColor ?? null
const titleColor = props.style?.titleColor ?? null
const textColor = props.style?.textColor ?? null

// Pregunta activa
const activeQuestion = ref(null)
if (props.questions.length > 0) {
    activeQuestion.value = props.questions[0].id
}
// Alternar pregunta
function toggleQuestion(faqId) {
    activeQuestion.value = activeQuestion.value === faqId ? null : faqId
}
</script>

<template>
    <section :style="{
        /* COLORES DE LA SECCION */
        '--bg-color-faq': bgColor ?? 'var(--background-color)',
        '--title-color-faq': titleColor ?? 'var(--title-color)',
        '--text-color-faq': textColor ?? 'var(--text-color)',
    }">
        <div class="content">
            <div class="centered__texts">
                <div class="pill__title">
                    <Pill :key="pill.id" :text="pill.text" :icon-url="getResource(pill.icon?.url).imageUrl"
                        :bgColor="bgColorPill" :textColor="textColorPill" />
                    <h1 class="title" v-html="formattedTitle"></h1>
                </div>
                <p class="description" v-html="formattedDescription"></p>
            </div>

            <div class="faq__container">
                <div class="faq" v-for="faq in questions" :key="faq.id">
                    <div class="question__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM13 13.3551V14H11V12.5C11 11.9477 11.4477 11.5 12 11.5C12.8284 11.5 13.5 10.8284 13.5 10C13.5 9.17157 12.8284 8.5 12 8.5C11.2723 8.5 10.6656 9.01823 10.5288 9.70577L8.56731 9.31346C8.88637 7.70919 10.302 6.5 12 6.5C13.933 6.5 15.5 8.067 15.5 10C15.5 11.5855 14.4457 12.9248 13 13.3551Z">
                            </path>
                        </svg>
                    </div>
                    <div class="question__answer">
                        <div class="question__content" @click="toggleQuestion(faq.id)">
                            <h2 class="question" :class="{ active: activeQuestion === faq.id }"
                                v-html="getTextFormated(faq.title)">
                            </h2>
                            <div class="down__icon" :class="{ rotate: activeQuestion === faq.id }">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z">
                                    </path>
                                </svg>
                            </div>
                        </div>

                        <div class="answer" :class="{ open: activeQuestion === faq.id }">
                            <p v-html="getTextFormated(faq.description)"></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
section {
    display: flex;
    height: auto;
    background-color: var(--bg-color-faq);
    padding: var(--padding-section);
    scroll-margin-top: 40px;
}

.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    max-width: var(--max-width);
    gap: 50px;
}

.pill__title {
    align-items: center;
}

.centered__texts .title {
    color: var(--title-color-faq);
}

.centered__texts .description {
    color: var(--text-color-faq);
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
    max-width: 60%;
}

.faq {
    display: flex;
    border-radius: var(--border-radius-card);
    gap: 10px;
    padding: 10px;
    background-color: white;
    border: 1px solid rgba(185, 185, 185, 0.3);
}

.faq:hover .question {
    color: var(--primary-color);
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
    padding-top: 20px;
    font-size: var(--font-size-card);
    color: var(--text-color-faq);
}

.answer.open {
    max-height: 500px;
}

.question.active {
    color: var(--primary-color);
}

.down__icon {
    transition: transform 0.3s ease;
    display: inline-block;
}

.down__icon.rotate {
    transform: rotate(180deg);
}

.question {
    font-size: clamp(1rem, 3vw, 1.1rem);
    font-weight: 500;
    color: var(--title-color-faq);
    transition: all .3s ease;
}

.question__icon {
    color: var(--primary-color);
    width: 25px;
    height: 25px;
}

.down__icon {
    width: 20px;
}
</style>