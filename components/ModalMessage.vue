<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div v-if="type === 'success'" class="modal-content" :class="type">

      <div class="close-button" @click="close">
        <svg xmlns="http://www.w3.org/2000/svg" width="118.64" height="128" viewBox="0 0 1216 1312">
          <path fill="currentColor"
            d="M1202 1066q0 40-28 68l-136 136q-28 28-68 28t-68-28L608 976l-294 294q-28 28-68 28t-68-28L42 1134q-28-28-28-68t28-68l294-294L42 410q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294l294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68L880 704l294 294q28 28 28 68" />
        </svg>
      </div>

      <!-- ICON -->
      <div class="icon success">
        <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="m10.6 13.8-2.15-2.15q-.28-.28-.7-.28t-.7.28-.28.7.28.7L9.9 15.9q.3.3.7.3t.7-.3l5.65-5.65q.28-.28.28-.7t-.28-.7-.7-.28-.7.28zM12 22q-2.08 0-3.9-.79t-3.17-2.14-2.14-3.17T2 12t.79-3.9 2.14-3.17T8.1 2.78 12 2t3.9.79 3.17 2.14 2.14 3.17T22 12t-.79 3.9-2.14 3.17-3.17 2.14T12 22m0-2q3.35 0 5.67-2.33T20 12t-2.33-5.67T12 4 6.33 6.33 4 12t2.33 5.67T12 20m0-8" />
        </svg>
      </div>

      <div class="header__container">
        <h3 class="title">¡Mensaje enviado exitosamente!</h3>
        <p class="description">Gracias por enviarnos un mensaje. Hemos recibido tu consulta correctamente.</p>
      </div>

      <div class="content__bg success">
        <div class="mini__icon success">
          <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="m20 8-8 5-8-5V6l8 5 8-5m0-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2" />
          </svg>
        </div>
        <div class="content__description">
          <h4>Revisa tu correo electrónico: <strong>{{ email }}</strong></h4>
          <p>Te hemos enviado una confirmación con los detalles de tu mensaje.</p>
        </div>
      </div>

      <!-- <div class="aditional">
        <ul>
          <li>Te estaremos respondiendo en un plazo máximo de <strong>24-48 horas hábiles</strong></li>
          <li>Si no ves nuestro correo, revisa tu carpeta de spam</li>
          <li>Para consultas urgentes, puedes llamarnos al <strong>(555) 123-4567</strong></li>
        </ul>
      </div> -->
    </div>

    <div v-else="type === 'error'" class="modal-content" :class="type">

      <div class="close-button" @click="close">
        <svg xmlns="http://www.w3.org/2000/svg" width="118.64" height="128" viewBox="0 0 1216 1312">
          <path fill="currentColor"
            d="M1202 1066q0 40-28 68l-136 136q-28 28-68 28t-68-28L608 976l-294 294q-28 28-68 28t-68-28L42 1134q-28-28-28-68t28-68l294-294L42 410q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294l294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68L880 704l294 294q28 28 28 68" />
        </svg>
      </div>

      <!-- ICON -->
      <div class="icon error">
        <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 256 256">
          <path fill="currentColor"
            d="M168.49 104.49 145 128l23.52 23.51a12 12 0 0 1-17 17L128 145l-23.51 23.52a12 12 0 0 1-17-17L111 128l-23.49-23.51a12 12 0 0 1 17-17L128 111l23.51-23.52a12 12 0 0 1 17 17ZM236 128A108 108 0 1 1 128 20a108.12 108.12 0 0 1 108 108m-24 0a84 84 0 1 0-84 84 84.09 84.09 0 0 0 84-84" />
        </svg>
      </div>

      <div class="header__container">
        <h3 class="title">Error al enviar mensaje</h3>
        <p class="description">Lo sentimos, ha ocurrido un error al procesar tu mensaje. Por favor, inténtalo
          nuevamente.</p>
      </div>

      <div class="content__bg error">
        <div class="mini__icon error">
          <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 15 15">
            <path fill="currentColor"
              d="M1.1 11.9 6.83 1.4a.75.75 0 0 1 1.32 0l5.75 10.5a.75.75 0 0 1-.66 1.1H1.75a.75.75 0 0 1-.66-1.1M8.3 8l.4-2.42A.5.5 0 0 0 8.21 5H6.79a.5.5 0 0 0-.5.58L6.7 8zm.3 1.9a1.1 1.1 0 1 0-2.2 0 1.1 1.1 0 0 0 2.2 0" />
          </svg>
        </div>
        <div class="content__description">
          <h4>Posibles causas del error:</h4>
          <ul>
            <li>Problemas temporales de conexión</li>
            <li>Servidor en mantenimiento</li>
            <li>Campos requeridos incompletos</li>
          </ul>
        </div>
      </div>

      <!--  <div class="aditional">
        <ul>
          <li>Verifica que todos los campos estén completos</li>
          <li>Revisa tu conexión a internet</li>
          <li>Intenta nuevamente en unos minutos</li>
        </ul>
      </div> -->
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  type: { type: String, default: 'info' },
  visible: Boolean,
  email: String
})

const emit = defineEmits(['update:visible'])

function close() {
  emit('update:visible', false)
}

watch(() => props.visible, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
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
  padding: 10px;
}

.modal-content {
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 20px;
  max-width: 600px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}

/* Barra de progreso */


.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #525252d2;
  transition: color 0.2s, scale 0.2s;
  width: 30px;
}

.close-button:hover {
  color: var(--primary-color);
  scale: 1.1;
}

.icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  padding: 10px;
}

.icon.success {
  color: #16A34A;
  background-color: #DCFCE7;
}

.icon.error {
  color: #DC2626;
  background-color: #FEE2E2;
}

/* SUCCESS */
p {
  line-height: 1.3;
}

li {
  text-align: start;
  line-height: 1.3;
  padding: 3px;
}

.title {
  font-size: clamp(1.25rem, 4vw, 1.5rem);
}

.description {
  padding-top: 5px;
}

.content__bg {
  display: flex;
  border-radius: 5px;
  padding: 20px;
  gap: 10px;
}

.content__bg.success {
  background-color: #DCFCE7;
  border: 1px solid #16A34A;
}

.content__bg.error {
  background-color: #FEE2E2;
  border: 1px solid #DC2626;
}

.mini__icon {
  width: 25px;
  height: 25px;
}

.mini__icon.success {
  color: #16A34A;
}

.mini__icon.error {
  color: #DC2626;
}

.content__description {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.content__description h4,
.content__description p {
  text-align: start;
}

.content__description h4 {
  font-weight: 500;
}
</style>