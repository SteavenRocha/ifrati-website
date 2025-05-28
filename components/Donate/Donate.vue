<script setup>
const props = defineProps({
    /* DONATE DATA */
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
    donationForm: {
        type: Object,
        required: true,
    },
    goalsForm: {
        type: Object,
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

/* STYLOS FORM */
const bgColorForm = props.donationForm?.formStyle?.backgroundColor ?? null
const titleColorForm = props.donationForm?.formStyle?.titleColor ?? null
const textColorForm = props.donationForm?.formStyle?.textColor ?? null

/* CTA STYLES */
const bgColorCta = props.goalsForm?.cta?.ctaStyle?.backgroundColor ?? null
const titleColorCta = props.goalsForm?.cta?.ctaStyle?.titleColor ?? null
const textColorCta = props.goalsForm?.cta?.ctaStyle?.textColor ?? null

// ESTADOS
const activeTab = ref('general') // 'general' o 'specific'
const selectedAmountId = ref(props.donationForm.donationDetails[0]?.id)
const selectedFrequency = ref('mensual')
const otherAmount = ref('')

// Computed para obtener el amount seleccionado
const selectedDonation = computed(() =>
    props.donationForm.donationDetails.find(d => d.id === selectedAmountId.value)
)

watch(otherAmount, (newVal) => {
    if (newVal !== '') {
        selectedAmountId.value = null
    }
})

const svgHtmlMap = reactive({})
const cards = props.donationForm.donationDetails.flatMap(detail => detail.detailsCard || [])

for (const detail of cards) {
    const url = getResource(detail.resource?.url).imageUrl
    if (url) {
        const { svgHtml, loadSvg } = getSvgHtml()
        await loadSvg(url)
        svgHtmlMap[detail.id] = svgHtml.value
    }
}

/* SLIDER */
// TODAS LAS METAS CON ESTADO TRUE
const dataGoals = await useApi('goals?populate[image][fields][0]=url&populate[image][fields][1]=alternativeText')
const goals = dataGoals?.data ?? []
/* OBTNER CANTIDAD DE CARDS ACTIVAS */
const activeCardsCount = goals.value.data.length
/* OBTNER CANTIDAD DE CARDS VISIBLES */
const visibleCards = 3

function daysRemaining(deadline) {
    const today = new Date()
    const endDate = new Date(deadline)
    const diffTime = endDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? `${diffDays} días restantes` : 'Fecha vencida'
}

const getProgress = (collected, goal) => {
    if (!goal || goal === 0) return 0
    const total = collected || 0
    return Math.min(100, Math.round((total / goal) * 100))
}

/* CARD STYLES */
const bgColorCard = props.goalsForm?.cardStyle?.backgroundColor ?? null
const titleColorCard = props.goalsForm?.cardStyle?.titleColor ?? null
const textColorCard = props.goalsForm?.cardStyle?.textColor ?? null
</script>

<template>
    <section :style="{
        '--bg-color-donate': bgColor ?? 'var(--background-color)',
        '--title-color-donate': titleColor ?? 'var(--title-color)',
        '--text-color-donate': textColor ?? 'var(--text-color)',
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

            <div class="form__container" :style="{
                '--bg-color-form': bgColorForm ?? 'var(--background-color)',
                '--title-color-form': titleColorForm ?? 'var(--title-color)',
                '--text-color-form': textColorForm ?? 'var(--text-color)',
            }">
                <div class="type">
                    <h1 class="item" :class="{ active: activeTab === 'general' }" @click="activeTab = 'general'">
                        {{ donationForm.selectedTitle }}
                    </h1>
                    <h1 class="item" :class="{ active: activeTab === 'specific' }" @click="activeTab = 'specific'">
                        {{ goalsForm.selectedTitle }}
                    </h1>
                </div>

                <div class="general__donation" v-if="activeTab === 'general'">
                    <div class="amount__frm">
                        <div class="amount__content">
                            <h1 class="title__amount">{{ donationForm.title }}</h1>
                            <div class="container__frm">
                                <div class="amount__container" v-for="amount in donationForm?.donationDetails"
                                    :key="amount.id"
                                    :class="{ selected: selectedAmountId === amount.id && otherAmount === '' }"
                                    @click="() => { selectedAmountId = amount.id; otherAmount = '' }">
                                    <div class="amount">{{ amount.amount }}PEN</div>
                                </div>
                            </div>
                            <div class="another__amount">
                                <div class="input-wrapper">
                                    <input type="number" placeholder="PEN Otra cantidad" v-model="otherAmount" />
                                </div>
                            </div>
                            <div class="frequency">
                                <button :class="{ active: selectedFrequency === 'mensual' }"
                                    @click="selectedFrequency = 'mensual'">
                                    Mensual
                                </button>
                                <button :class="{ active: selectedFrequency === 'unica' }"
                                    @click="selectedFrequency = 'unica'">
                                    Única
                                </button>
                            </div>
                        </div>
                        <div class="button__container">
                            <button>Donar</button>
                            <p class="button__text">Tu donación es deducible fiscalmente</p>
                        </div>
                    </div>

                    <!-- Mostrar mensaje personalizado si hay un monto personalizado -->
                    <div v-if="otherAmount !== ''" class="impact__frm">
                        <h1 class="title__impact">Donación personalizada</h1>
                        <p class="description">Gracias por tu generosidad. Esta donación será destinada a nuestras
                            causas principales.</p>
                    </div>

                    <!-- Mostrar impacto solo si se seleccionó un amount fijo -->
                    <div class="impact__frm" v-else-if="selectedDonation">
                        <h1 class="title__impact">{{ donationForm.secondTitle }}</h1>
                        <div class="impact__container">
                            <div class="image">
                                <img :src="getResource(selectedDonation.impact.resource?.url).imageUrl" alt="">
                                <h1 class="image__title">{{ selectedDonation.impact.title }}</h1>
                            </div>
                            <p class="description">{{ selectedDonation.impact.description }}</p>

                            <div class="details__cards">
                                <div v-for="(detail, index) in selectedDonation.detailsCard" :key="detail.id"
                                    class="details__card">
                                    <div class="title__card">
                                        <div class="icon">
                                            <span v-if="svgHtmlMap[detail.id]" v-html="svgHtmlMap[detail.id]" />
                                        </div>
                                        <h3 class="details__card__title">{{ detail.title }}</h3>
                                    </div>
                                    <p class="details__card__description">{{ detail.description }}</p>
                                </div>
                            </div>

                            <div class="aditional__impact">
                                <h1 class="aditional__title">{{ selectedDonation.aditionalImpact.title }}</h1>
                                <p class="aditional__description">{{ selectedDonation.aditionalImpact.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="specific_goals" v-if="activeTab === 'specific'" :style="{
                    '--bg-color-card': bgColorCard ?? 'var(--background-color)',
                    '--title-color-card': titleColorCard ?? 'var(--title-color)',
                    '--text-color-card': textColorCard ?? 'var(--text-color)',
                }">
                    <h1 class="title__goals">
                        {{ goalsForm.title }}
                    </h1>

                    <Slider id="goalsSlider" :totalCards=activeCardsCount :visibleCards=visibleCards>
                        <div class="card__section" v-for="(item, index) in goals.data" :key="index">
                            <div class="goal__image">
                                <img :src="getResource(item.image?.url).imageUrl" alt="">
                                <h2 class="deadline">
                                    {{ daysRemaining(item.deadline) }}
                                </h2>
                            </div>
                            <div class="card__content">
                                <div class="card__texts">
                                    <h1 class="card__title">
                                        {{ item.title }}
                                    </h1>
                                    <p class="card__description">
                                        {{ item.description }}
                                    </p>
                                </div>
                                <div class="progress__container">
                                    <div class="progress__content">
                                        <p class="progress">{{ getProgress(item.totalCollected, item.goal) }}%
                                            completado</p>
                                        <div class="collected__content">
                                            <p class="collected__text">
                                                {{ item.totalCollected || 0 }} S/. de
                                            </p>
                                            <p class="goal__text">
                                                {{ item.goal }} S/.
                                            </p>
                                        </div>
                                    </div>
                                    <div class="progress__bar">
                                        <div class="progress__fill"
                                            :style="{ width: getProgress(item.totalCollected, item.goal) + '%' }"></div>
                                    </div>
                                </div>
                                <button class="goal__button">
                                    Donar a esta meta
                                </button>
                            </div>
                        </div>
                    </Slider>

                    <div class="cta" :style="{
                        '--bg-color-cta': bgColorCta ?? 'var(--background-color)',
                        '--title-color-cta': titleColorCta ?? 'var(--title-color)',
                        '--text-color-cta': textColorCta ?? 'var(--text-color)',
                    }">
                        <h1 class="cta__title">
                            {{ goalsForm.cta?.title }}
                        </h1>
                        <p class="cta__description">
                            {{ goalsForm.cta?.description }}
                        </p>
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
    background-color: var(--bg-color-donate);
    padding: var(--padding-section);
    scroll-margin-top: 40px;
}

.content {
    display: flex;
    margin: auto;
    flex-direction: column;
    max-width: var(--max-width);
    overflow: hidden;
    gap: 50px;
}

.pill__title {
    align-items: center;
}

.centered__texts .title {
    color: var(--title-color-donate);
}

.centered__texts .description {
    color: var(--text-color-donate);
}

.type {
    display: flex;
    gap: 20px;
}

.item {
    width: auto;
    cursor: pointer;
    font-size: clamp(1rem, 3vw, 1.1rem);
    font-weight: 400;
    padding-bottom: 15px;
    transition: all .3s ease;
    border-bottom: 2px solid transparent;
    color: gray;
}

.item.active {
    color: var(--primary-color);
    border-bottom: 2px solid var(--primary-color);
}

.form__container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    border: 1px solid rgba(185, 185, 185, 0.3);
    padding: 25px;
    border-radius: var(--border-radius);
    background-color: var(--bg-color-form);
}

.general__donation {
    display: flex;
    gap: 40px;
    min-height: 620px;
}

.title__amount,
.title__impact {
    font-size: clamp(1rem, 3vw, 1.4rem);
    font-weight: 500;
    color: var(--title-color-form);
}

.title__goals {
    font-size: clamp(1rem, 3vw, 1.4rem);
    font-weight: 500;
    color: var(--title-color-form);
}

.amount__frm {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-width: 50%;
    border: 1px solid rgba(185, 185, 185, 0.3);
    padding: 30px;
    gap: 20px;
    border-radius: var(--border-radius);
}

.amount__content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.impact__frm {
    width: 50%;
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: #F9FAFB;
    border-radius: 20px;
}

.container__frm {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
}

.amount__container {
    border: 1px solid rgba(185, 185, 185, 0.6);
    border-radius: 10px;
    padding: 15px;
    flex: 1 1 calc(33.33% - 20px);
    box-sizing: border-box;
    cursor: pointer;
    color: var(--text-color-form);
}

.amount__container:hover {
    background-color: #F3F4F6;
}

.amount__container.selected {
    border-color: var(--primary-color);
    background-color: var(--primary-color);
    color: white;
}

.amount {
    font-size: 1rem;
    font-weight: 400;
}

.input-wrapper input {
    border: 1px solid rgba(185, 185, 185, 0.6);
    border-radius: 10px;
    padding: 15px;
    flex: 1 1 calc(33.33% - 20px);
    box-sizing: border-box;
}

.input-wrapper input:focus {
    border-color: var(--primary-color);
    outline: none;
}

.frequency {
    display: flex;
    gap: 15px;
}

.frequency button {
    border: 1px solid rgba(185, 185, 185, 0.6);
    border-radius: 10px;
    padding: 15px;
    flex: 1 1 calc(33.33% - 20px);
    box-sizing: border-box;
    cursor: pointer;
    background-color: white;
    color: var(--text-color-form);
}

.frequency button:hover {
    background-color: #F3F4F6;
}

.frequency button .activo {
    background-color: var(--primary-color);
}

.frequency button.active {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.button__container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
}

.button__container button {
    border: 1px solid var(--primary-color);
    border-radius: 10px;
    padding: 15px;
    flex: 1 1 calc(33.33% - 20px);
    box-sizing: border-box;
    cursor: pointer;
    background-color: var(--primary-color);
    color: white;
}

.button__container button:hover {
    filter: brightness(90%);
}

.button__text {
    width: auto;
    font-size: .8rem;
    font-weight: 400;
    color: var(--text-color-form);
}

.image {
    position: relative;
    border-radius: 15px;
    overflow: hidden;
    height: 280px;
}

.image::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center,
            rgba(0, 0, 0, 0.1) 40%,
            rgba(0, 0, 0, 0.35) 80%);
    pointer-events: none;
    z-index: 1;
}

.image__title {
    position: absolute;
    bottom: 0;
    padding: 15px;
    color: white;
    font-size: clamp(1rem, 3vw, 1.4rem);
    font-weight: 600;
    z-index: 2;
}

.impact__container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.aditional__impact {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: rgba(128, 128, 128, 0.1);
    border-radius: 15px;
    padding: 15px;
}

.description {
    color: var(--text-color-form);
    line-height: 1.3
}

.aditional__title {
    font-size: clamp(1rem, 3vw, 1.2rem);
    font-weight: 500;
    color: var(--primary-color);
}

.aditional__description {
    color: var(--text-color-form);
    line-height: 1.3;
}

.details__cards {
    display: flex;
    gap: 20px;
}

.details__card {
    display: flex;
    flex-direction: column;
    background-color: white;
    padding: 15px;
    border-radius: 15px;
    gap: 5px;
}

.icon {
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.icon span {
    width: 20px;
    height: 20px;
    color: var(--secondary-color);
}

.title__card {
    display: flex;
    align-items: center;
    gap: 5px;
}

.details__card__title {
    font-weight: 500;
    color: var(--secondary-color);
}

.details__card__description {
    color: var(--text-color-form);
}

.specific_goals {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.cta {
    display: flex;
    flex-direction: column;
    background-color: var(--bg-color-cta);
    padding: 50px;
    border-radius: 15px;
    gap: 10px;
}

.cta__title {
    font-size: clamp(1rem, 3vw, 1.4rem);
    font-weight: 600;
    color: var(--title-color-cta);
    text-align: center;
}

.cta__description {
    line-height: 1.3;
    color: var(--text-color-cta);
    text-align: center;
}

.card__section {
    border: 1px solid rgba(185, 185, 185, 0.6);
    border-radius: 15px;
    overflow: hidden;
    background-color: var(--bg-color-card);
}

.card__content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 30px;
}

.card__texts {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.card__title {
    font-size: clamp(1rem, 3vw, 1.3rem);
    font-weight: 700;
    color: var(--title-color-card);
}

.card__description {
    line-height: 1.3;
    color: var(--text-color-card);
}

.goal__image {
    width: 100%;
    height: 250px;
    position: relative;
}

.deadline {
    position: absolute;
    width: auto;
    top: 5%;
    right: 2.5%;
    color: var(--primary-color);
    background-color: white;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: clamp(0.9rem, 3vw, 0.9rem);
    font-weight: 600;
    border: 1px solid var(--primary-color);
}

.goal__image img {
    object-fit: cover;
}

.goal__button {
    border: 1px solid rgba(185, 185, 185, 0.6);
    border-radius: 10px;
    padding: 15px;
    box-sizing: border-box;
    cursor: pointer;
    background-color: white;
    color: var(--text-color-card);
    transition: all .3s ease;
}

.goal__button:hover {
    border: 1px solid var(--primary-color);
    background-color: var(--primary-color);
    color: white;
}

.progress__content {
    display: flex;
    justify-content: space-between;
    gap: 5px;
    color: var(--text-color-card);
}

.collected__content,
.progress,
.collected__text,
.goal__text {
    width: auto;
}

.collected__content {
    display: flex;
    gap: 5px;
}

.progress__bar {
    width: 100%;
    height: 10px;
    background-color: #e0e0e0;
    border-radius: 5px;
    overflow: hidden;
    margin-top: 5px;
}

.progress__fill {
    height: 100%;
    background-color: var(--primary-color);
    transition: width 0.3s ease-in-out;
}
</style>