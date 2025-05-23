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

            <div class="form__container">
                <div class="type">
                    <h1 class="item" :class="{ active: activeTab === 'general' }" @click="activeTab = 'general'">
                        Donación General</h1>
                    <h1 class="item" :class="{ active: activeTab === 'specific' }" @click="activeTab = 'specific'">Metas
                        Específicas</h1>
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
                            <div class="aditional__impact">
                                <h1 class="aditional__title">{{ selectedDonation.aditionalImpact.title }}</h1>
                                <p class="aditional__description">{{ selectedDonation.aditionalImpact.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="specific_goals" v-if="activeTab === 'specific'">
                    <p>Contenido de Metas Específicas</p>
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
    color: var(--title-color-donate);
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
    color: var(--text-color-donate);
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
    color: var(--text-color-donate);
    line-height: 1.3
}

.aditional__title {
    font-size: clamp(1rem, 3vw, 1.2rem);
    font-weight: 500;
    color: var(--primary-color);
}

.aditional__description {
    color: var(--text-color-donate);
    line-height: 1.3;
}
</style>