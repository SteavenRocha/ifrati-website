<template>
    <a class="floating__button" :href="whatsappLink" target="_blank" rel="noopener noreferrer">
        <div class="icon">
            <img :src="getResource(icon).imageUrl" alt="WhatsApp" />
        </div>
    </a>
</template>

<script setup>
const props = defineProps({
    icon: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
    href: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        default: '',
    },
})

const whatsappLink = computed(() => {
    const base = props.href.replace('+', '')
    return props.message
        ? `${base}?text=${encodeURIComponent(props.message)}`
        : base
})
</script>

<style scoped>
.floating__button {
    position: fixed;
    right: 0;
    bottom: 0;
    padding: 25px 25px;
    width: max-content;
    z-index: 100;
}

.icon {
    width: 70px;
    height: 70px;
    cursor: pointer;
    transition: scale ease .3s;
}

.icon:hover {
    scale: 1.1;
}

@media (max-width: 480px) {
    .floating__button {
        padding: 10px 8px;
    }

    .icon {
        width: 60px;
        height: 60px;
    }
}
</style>