<script setup>
const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    totalCards: {
        type: Number,
        default: 0,
    },
    visibleCards: {
        type: Number,
        required: true,
    },
})

const positionSlider = positionSliderStore()

const slider = ref(null)
const counter = ref(props.id === 'donateSlider' ? positionSlider.position : 0)
const widthPercentage = computed(() => `${(props.totalCards * 100) / props.visibleCards}%`)
const widthCard = 100 / props.totalCards
const maxCounter = computed(() => props.totalCards - props.visibleCards)
const paginationDots = computed(() => Math.max(0, maxCounter.value + 1))

function movetoRight() {
    if (counter.value >= maxCounter.value) return
    counter.value++

    if (props.id === 'donateSlider') {
        positionSlider.setPosition(counter.value)
    }

    const operacion = widthCard * counter.value
    if (slider.value) {
        slider.value.style.transform = `translateX(-${operacion}%)`
    }
}

function movetoLeft() {
    if (counter.value <= 0) return
    counter.value--

    if (props.id === 'donateSlider') {
        positionSlider.setPosition(counter.value)
    }

    const operacion = widthCard * counter.value
    if (slider.value) {
        slider.value.style.transform = `translateX(-${operacion}%)`
    }
}
</script>

<template>
    <div class="container__carousel" :id="id">
        <div class="carruseles" ref="slider" :style="{ width: widthPercentage }">
            <slot />
        </div>

        <div class="pagination" v-if="id === 'donateSlider'">
            <span v-for="(dot, index) in paginationDots" :key="index" :class="{ active: index === counter }"
                class="dot" />
        </div>

        <div class="direction">
            <div class="btn__left" :class="{ disable: counter <= 0 }" @click="movetoLeft">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="4" d="M31 36L19 24l12-12" />
                </svg>
            </div>

            <div class="pagination" v-if="id === 'testimoniesSlider' || id == 'productSlider'">
                <span v-for="(dot, index) in paginationDots" :key="index" :class="{ active: index === counter }"
                    class="dot" />
            </div>

            <div class="btn__right" :class="{ disable: counter >= maxCounter }" @click="movetoRight">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="4" d="m19 12l12 12l-12 12" />
                </svg>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container__carousel {
    margin: auto;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    gap: 20px;
    overflow: hidden;
    position: relative;
    padding-bottom: 10px;
    border-radius: var(--border-radius-card);
}

.carruseles {
    /* width: 300%; */
    height: 100%;
    display: flex;
    margin: auto;
    gap: 20px;
    transition: transform ease 0.6s;
}

.direction {
    position: relative;
    height: auto;
    display: flex;
    gap: 20px;
    justify-content: center;
}

/* donateSlider */
#donateSlider .direction {
    position: absolute;
    bottom: 0;
    padding: 20px;
    gap: 10px;
}

#donateSlider .pagination {
    right: 0;
    position: absolute;
    top: 0;
    padding: 20px 25px;
}

#donateSlider .btn__left,
#donateSlider .btn__right {
    width: 35px;
    height: 35px;
}

/* testimoniesSlider */
.btn__left,
.btn__right {
    width: 40px;
    height: 40px;
    font-weight: bold;
    border-radius: 15px;
    cursor: pointer;
    pointer-events: all;
    user-select: none;
    transition: background-color 0.3s ease;
    padding: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    color: rgba(0, 0, 0, 0.685);
    border: 1px solid rgb(161, 161, 161);
}

.btn__left:hover,
.btn__right:hover {
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
}

.disable {
    opacity: 0.3;
    background-color: white;
    color: black;
    pointer-events: none;
    cursor: default;
    border: 1px solid rgb(199, 199, 199);
}

svg {
    width: 30px;
    height: auto;
}

.pagination {
    display: flex;
    align-items: center;
    width: auto;
    gap: 6px;
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #ccc;
    transition: background-color 0.3s ease, transform 0.2s ease, width 0.2s ease;
}

.dot.active {
    width: 20px;
    height: 10px;
    border-radius: 50px;
    background-color: var(--primary-color);
    transform: scale(1.2);
}
</style>
