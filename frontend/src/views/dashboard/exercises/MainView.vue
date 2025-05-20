<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="exercise in exercises"
      :key="exercise.id"
      class="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-5 flex flex-col gap-2"
    >
      <!-- Imagen de ejercicio (si tienes, opcional) -->
      <!-- <img :src="exercise.imgUrl" alt="Ejercicio" class="w-full h-40 object-cover rounded-xl mb-2" /> -->

      <!-- Título del ejercicio -->
      <h2 class="text-xl font-semibold text-tertiary-600">{{ exercise.nombre }}</h2>

      <!-- Detalles en grid o lista -->
      <div class="text-gray-700 text-sm space-y-1">
        <p><strong>Tipo:</strong> {{ exercise.tipo }}</p>
        <p><strong>Categoría:</strong> {{ exercise.categoria }}</p>
        <p><strong>Descanso:</strong> {{ exercise.descanso }} segundos</p>
        <p><strong>Series:</strong> {{ exercise.series }}</p>
        <p><strong>Repeticiones:</strong> {{ exercise.repeticiones }}</p>
        <p><strong>Peso:</strong> {{ exercise.peso }} kg</p>
      </div>

      <!-- (Opcional) Botón de acción -->
      <div class="mt-3">
        <button class="w-full bg-tertiary-500 hover:bg-tertiary-600 text-white font-medium py-2 px-4 rounded-xl">
          Ver más
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useLayoutStore } from "@/stores/layoutStore";

const layoutStore = useLayoutStore();
layoutStore.setTitle("Lista de Ejercicios");

const exercises = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:8081/exercises/get");
    exercises.value = response.data;
  } catch (error) {
    console.error("Error al cargar los ejercicios:", error);
  }
});
</script>
