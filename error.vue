<script setup>
defineProps(['error'])
</script>

<template>
    <div class="error__container">
        <div class="error__header">
            <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24">
                <g fill="none" fill-rule="evenodd">
                    <path d="M12.6 23.3h-.2v.5h.2v-.5m.3-.2-.2.1v.5l.2.1v-.6m-.8 0v.6h.2v-.5z" />
                    <path fill="currentColor"
                        d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20m0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16m0 9a5 5 0 0 1 3.3 1.3 1 1 0 1 1-1.3 1.4 3 3 0 0 0-2-.7 3 3 0 0 0-2 .8 1 1 0 1 1-1.3-1.6A5 5 0 0 1 12 13M8.5 8a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3m7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3" />
                </g>
            </svg>
            <h1 class="error__code">{{ error.statusCode }}</h1>
        </div>
        <p class="error__message">{{ error.statusMessage }}</p>

        <Button v-if="error.statusCode === 404" text="Volver al inicio" class="button" href="/"/>
    </div>
</template>

<style scoped>
.error__container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #f4f4f4;
    text-align: center;
    padding: 0 20px;
}

.error__header {
    display: flex;
    justify-content: center;
    align-items: center;
}

svg {
    width: 150px;
    color: #666;
}

h1 {
    width: auto;
}

.error__code {
    font-size: 6rem;
    font-weight: 700;
    color: #666;
}

.error__message {
    font-size: 1.5rem;
    color: #666;
    margin: 1rem 0;
    max-width: 600px;
}
</style>