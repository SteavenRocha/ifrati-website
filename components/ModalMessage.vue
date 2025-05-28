<template>
    <div v-if="visible" class="modal-overlay" @click.self="close">
        <div class="modal-content" :class="type" @mouseenter="pauseProgress" @mouseleave="resumeProgress">
            
            <button class="close-button" @click="close">✕</button>
            
            {{ message }}
            <!--  <h1 class="title">¡Gracias por contactarnos!</h1>
            <p class="message"> Hemos recibido tu mensaje y te responderemos pronto. ¡Esperamos poder ayudarte!</p> -->
            <div class="progress-bar">
                <div class="progress" :style="{ width: progress + '%' }"></div>
            </div>

            <button @click="close">Cerrar</button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    message: String,
    type: { type: String, default: 'info' },
    visible: Boolean,
})

const emit = defineEmits(['update:visible'])

const progress = ref(0)
let intervalId = null
let paused = false

function close() {
  emit('update:visible', false)
}

function startProgress() {
  clearInterval(intervalId)
  intervalId = setInterval(() => {
    if (!paused) {
      progress.value += 1
      if (progress.value >= 100) {
        clearInterval(intervalId)
        close()
      }
    }
  }, 50)
}

function pauseProgress() {
  paused = true
}

function resumeProgress() {
  paused = false
}

watch(() => props.visible, (newVal) => {
  if (newVal) {
    progress.value = 0
    startProgress()
  } else {
    progress.value = 0
    clearInterval(intervalId)
  }
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal-content {
    background: white;
    padding: 1.5rem 2rem;
    border-radius: 20px;
    width: 300px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    text-align: center;
    position: relative;
}

.modal-content.success {
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
}

.modal-content.error {
    border: 2px solid #f44336;
    color: #b71c1c;
}

button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
}

/* Barra de progreso */
.progress-bar {
    height: 6px;
    width: 100%;
    background-color: #eee;
    border-radius: 3px;
    margin-top: 1rem;
    overflow: hidden;
}

.progress {
    height: 100%;
    background-color: #4CAF50;
    width: 0%;
    transition: width 0.03s linear;
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: #888;
    transition: color 0.2s;
}

.close-button:hover {
    color: #000;
}
</style>