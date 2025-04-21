<script setup>
import HelloWorld from './components/HelloWorld.vue'
import { ref, watch } from 'vue'

const count = ref(1)
const user = ref(null)

function sum() {
  count.value++
}

// Este watch se dispara cada vez que cambia `count`
watch(count, async (newCount) => {
  const res = await fetch(`http://localhost:8081/users/${newCount}`)
  const data = await res.json()
  user.value = data
}, { immediate: true }) // Esto hace que se ejecute también al inicio
</script>

<template>
  <h1>Hello World</h1>
  <p>Desde Vue y Vite</p>
  <HelloWorld class="text-red-500" />

  <button
    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
    @click="sum"
  >
    Count is: {{ count }}
  </button>

  <div v-if="user">
    <h2 class="mt-4 font-bold text-lg">Usuario actual:</h2>
    <pre>{{ user }}</pre>
  </div>
</template>