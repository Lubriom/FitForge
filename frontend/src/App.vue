<script setup>
import HelloWorld from './components/HelloWorld.vue'
import { ref, onMounted } from 'vue';

const count = ref(0);

function sum() {
  count.value ++;
}

onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})
</script>

<template>
  <h1>Hello World</h1>
  <p>Desde Vue y Vite</p>
  <HelloWorld class="text-red-500" />
  <button
    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300" @click="sum">
    Count is: {{ count }}
  </button>
</template>

<setup>

</setup>