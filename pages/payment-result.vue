<script setup>
const route = useRoute()

const id = route.query.id
</script>

<template>
  <div class="body">
    <h1>✅ Pago procesado correctamente</h1>
    <p><strong>ID:</strong> {{ id }}</p>
  </div>
</template>

<style>
.body {
    height: 100vh;
    padding: 200px;
}
</style>
