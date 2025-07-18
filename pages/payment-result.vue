<script setup>
const route = useRoute()
const id = route.query.id

const { data: result, error } = await useAsyncData('paymentResult', async () => {
  const response = await $fetch('/api/getPaymentResult', {
    method: 'GET',
    params: { id }
  })

  console.log('✅ Datos recibidos:', response) 
  return response
})
</script>

<template>
  <div class="body">
    <template v-if="result && !error">
      <h1>✅ Pago procesado correctamente</h1>
      <p><strong>ID:</strong> {{ result.id }}</p>
      <p><strong>Monto:</strong> S/. {{ result.amount }}</p>
      <!-- Agrega más info de result si lo deseas -->
    </template>

    <template v-else-if="error">
      <h1>❌ Error al procesar el pago</h1>
      <p>Revisa que tu transacción se haya completado correctamente.</p>
    </template>

    <template v-else>
      <p>Cargando información de tu transacción...</p>
    </template>
  </div>
</template>

<style>
.body {
  height: 100vh;
  padding: 200px;
}
</style>