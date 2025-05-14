<script setup>
const props = defineProps({
    /* PURPOSE DATA */
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
    steps: {
        type: Object,
        required: true,
    },
    collaborators: {
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

/* STYLOS DE LA CARD */
const bgColorCard = props.collaborators?.cardStyle?.backgroundColor ?? null
const titleColorCard = props.collaborators?.cardStyle?.titleColor ?? null
const textColorCard = props.collaborators?.cardStyle?.textColor ?? null

// LOGICA PARA LA EXPANSION DE LAS TARJETAS
const expandedCard = ref(null)
const toggleCard = (id) => {
    expandedCard.value = expandedCard.value === id ? null : id
}
const isExpanded = (id) => expandedCard.value === id
if (props.collaborators?.card?.length > 0) {
    expandedCard.value = props.collaborators.card[0].id
}
</script>

<template>
    <section :style="{
        /* COLORES DE LA SECCION */
        '--bg-color-participate': bgColor ?? 'var(--background-color)',
        '--title-color-participate': titleColor ?? 'var(--title-color)',
        '--text-color-participate': textColor ?? 'var(--text-color)',
    }" id="steps">
        <div class="content">
            <div class="centered__texts">
                <div class="pill__title">
                    <Pill :key="pill.id" :text="pill.text" :icon-url="getResource(pill.icon?.url).imageUrl"
                        :bgColor="bgColorPill" :textColor="textColorPill" />
                    <h1 class="title" v-html="formattedTitle"></h1>
                </div>
                <p class="description" v-html="formattedDescription"></p>
            </div>

            <div class="steps__wrap">
                <div class="steps__contanier">
                    <div class="steps__content">
                        <h1 class="steps__title">
                            {{ steps.title }}
                        </h1>
                        <div class="all__steps">
                            <div class="steps" v-for="(step, index) in steps.steps" :key="step.id">
                                <div class="icon__number">
                                    {{ index + 1 }}
                                </div>
                                <div class="step__text">
                                    <h1 class="step__title">{{ step.title }}</h1>
                                    <p class="step__description">{{ step.description }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button :key="steps?.button.id" :text="steps?.button?.text" :style="steps?.button.style"
                        :href="steps?.button.href" :icon-url="getResource(steps?.button.icon?.url).imageUrl" />
                </div>
                <div class="side__image">
                    <img :src="getResource(steps.sideImage?.url).imageUrl" alt="">
                </div>
            </div>

            <div class="collaborators__content" :style="{
                /* COLORES DE LA SECCION */
                '--bg-color-card': bgColorCard ?? 'var(--background-color)',
                '--title-color-card': titleColorCard ?? 'var(--title-color)',
                '--text-color-card': textColorCard ?? 'var(--text-color)',
            }">
                <div class="side__image">
                    <img :src="getResource(collaborators.sideImage?.url).imageUrl" alt="">
                </div>
                <div class="collaborators__wrap">
                    <h1 class="collaborators__title">
                        {{ collaborators.title }}
                    </h1>
                    <div class="cards__container">
                        <div class="card" :class="{ expanded: isExpanded(card.id) }" v-for="card in collaborators.card"
                            :key="card.id" @click="toggleCard(card.id)">
                            <div class="card__content">
                                <div class="icon">
                                    <img :src="getResource(card?.icon?.url).imageUrl" alt="" />
                                </div>
                                <div class="card__text">
                                    <h1 class="card__title">{{ card.title }}</h1>
                                </div>
                            </div>
                            <div class="card__extra">
                                <p class="card__description">{{ card.description }}</p>
                                <Button :key="card?.button.id" :text="card?.button?.text" :style="card?.button.style"
                                    :href="card?.button.href"
                                    :icon-url="getResource(card?.button.icon?.url).imageUrl" />
                            </div>
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
    background-color: var(--bg-color-participate);
    padding: var(--padding-section);
    scroll-margin-top: 110px;
}

.content {
    display: flex;
    flex-direction: column;
    margin: auto;
    max-width: var(--max-width);
    gap: 80px;
}

.pill__title {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.centered__texts .title {
    color: var(--title-color-participate);
}

.centered__texts .description {
    color: var(--text-color-participate);
}

.steps__wrap {
    display: flex;
    align-items: center;
    gap: 50px;
}

.steps__contanier {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.icon {
    width: 40px;
    display: flex;
}

.icon img {
    object-fit: contain;
}

.icon__number {
    width: 30px;
    height: 30px;
    padding: 15px;
    font-size: 20px;
    font-weight: 600;
    border-radius: 50%;
    border: 2px solid var(--primary-color);
    color: var(--primary-color);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: default;
}

.steps {
    display: flex;
    gap: 20px;
}

.steps__content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.steps__title,
.collaborators__title {
    font-weight: 600;
    font-size: clamp(1.2rem, 3vw, 1.5rem);
}

.steps__title {
    color: var(--title-color-participate);
}

.collaborators__title {
    color: var(--title-color-participate);
}

.all__steps {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.step__text {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.step__title {
    color: var(--title-color-participate);
    font-size: clamp(1rem, 3vw, 1.2rem);
    font-weight: 500;
}

.step__description {
    font-size: clamp(1rem, 3vw, 1.1rem);
    color: var(--text-color-participate);
    font-weight: 350;
    line-height: 1.3;
}

.collaborators__wrap {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.collaborators__content {
    display: flex;
    align-items: center;
    gap: 50px;
}

.cards__container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.card {
    display: flex;
    flex-direction: column;
    gap: 20PX;
    padding: 20px;
    background-color: var(--bg-color-card);
    border-radius: var(--border-radius-card);
    justify-content: space-between;
    max-height: 75px;
    overflow: hidden;
    transition: all 0.3s ease;
    cursor: pointer;
}

.card:hover .card__title {
    color: var(--primary-color);
}

.card.expanded {
    max-height: 600px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.card.expanded .card__title {
    color: var(--primary-color);
}

.card__content {
    display: flex;
    align-items: center;
    gap: 10px;
}

.card__extra {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.card__text {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.card__title {
    transition: color .3s ease;
    font-weight: 500;
    font-size: clamp(1.2rem, 3vw, 1.4rem);
    color: var(--title-color-card);
}

.card__description {
    font-size: clamp(1rem, 3vw, 1rem);
    color: var(--text-color-card);
    font-weight: 350;
    line-height: 1.3;
}

.side__image {
    height: 550px;
    max-height: 550px;
}
</style>