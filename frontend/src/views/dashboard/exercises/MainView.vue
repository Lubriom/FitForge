<template>
  <div class="flex flex-col h-full gap-3">
    <div class="flex flex-row justify-between items-center gap-3">
      <router-link
        to="/ejercicios/nuevo"
        class="bg-tertiary-500 hover:bg-orange-700 text-white font-medium px-4 py-2 rounded-xl shadow-md ml-3"
      >
        Nuevo
      </router-link>
      <form
        @submit.prevent="emitirFiltros"
        class="w-full flex flex-wrap gap-3 bg-gray-100 p-2 rounded-xl shadow-[0px_10px_10px_-5px_rgba(0,0,0,0.3)]"
      >
        <!-- Nombre -->
        <input
          v-model="filtros.nombre"
          type="text"
          placeholder="Buscar por nombre"
          class="bg-white p-2 rounded-lg flex-1 min-w-[200px]"
        />

        <!-- Tipo -->
        <select v-model="filtros.tipo" class="p-2 border rounded-lg">
          <option disabled value="">Filtrar por tipo</option>
          <option value="cardio">Cardio</option>
          <option value="core">Core</option>
          <option value="fuerza">Fuerza</option>
          <!-- Agrega más tipos según tu modelo -->
        </select>

        <!-- Categoría -->
        <select v-model="filtros.categoria" class="p-2 border rounded-lg">
          <option disabled value="">Filtrar por categoría</option>
          <option value="piernas">Pierna</option>
          <option value="pecho">Pecho</option>
          <option value="espalda">Espalda</option>
          <option value="brazos">Brazos</option>
          <option value="abdomen">Abdomen</option>
          <option value="full body">Full Body</option>
        </select>

        <!-- Botón Filtrar -->
        <button type="submit" class="bg-tertiary-500 hover:bg-orange-700 text-white py-2 px-4 rounded-lg hover:bg-tertiary-600 cursor-pointer">
          Filtrar
        </button>

        <!-- Botón Reset -->
        <button
          type="button"
          @click="resetFiltros"
          class="bg-gray-300 text-black py-2 px-2 rounded-lg hover:bg-gray-400 cursor-pointer"
        >
          <RotateCcw />
        </button>
      </form>
    </div>

    <!-- Ejercicios -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-h-full overflow-y-auto">
      <div v-for="exercise in exercises" :key="exercise.id" class="perspective" style="perspective: 1000px">
        <div
          class="relative w-full h-52 transition-transform duration-700 transform-style-preserve-3d"
          :class="{ 'rotate-y-180': flippedExercises.has(exercise.id) }"
        >
          <!-- Front Side -->
          <div
            class="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between"
          >
            <div class="flex flex-row justify-between items-center">
              <h2 class="text-xl font-semibold text-tertiary-600">{{ exercise.nombre }}</h2>
              <button
                @click="toggleFlip(exercise.id)"
                class="bg-tertiary-500 hover:bg-orange-700 text-white font-medium p-1.5 rounded-xl cursor-pointer"
              >
                <BadgeInfo />
              </button>
            </div>
            <div class="text-gray-700 text-sm space-y-1">
              <p><strong>Tipo:</strong> {{ exercise.tipo }}</p>
              <p><strong>Categoría:</strong> {{ exercise.categoria }}</p>
              <p><strong>Descanso:</strong> {{ exercise.descanso }} segundos</p>
            </div>
          </div>

          <!-- Back Side -->
          <div
            class="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between rotate-y-180"
          >
            <div class="flex flex-row justify-between items-center">
              <h2 class="text-xl font-semibold text-tertiary-600">{{ exercise.nombre }}</h2>
              <button
                @click="toggleFlip(exercise.id)"
                class="bg-gray-500 hover:bg-gray-600 text-white font-medium p-1.5 rounded-xl"
              >
                <Undo2 />
              </button>
            </div>
            <div class="text-gray-700 text-sm space-y-1">
              <p><strong>Series:</strong> {{ exercise.series }}</p>
              <p><strong>Repeticiones:</strong> {{ exercise.repeticiones }}</p>
              <p><strong>Peso:</strong> {{ exercise.peso }} kg</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useLayoutStore } from "@/stores/layoutStore";
import { BadgeInfo, Undo2, RotateCcw } from "lucide-vue-next";

const layoutStore = useLayoutStore();
layoutStore.setTitle("Lista de Ejercicios");

const exercises = ref([]);
const flippedExercises = ref(new Set());

const toggleFlip = (id) => {
  if (flippedExercises.value.has(id)) {
    flippedExercises.value.delete(id);
  } else {
    flippedExercises.value.add(id);
  }
  // For Vue reactivity with Set:
  flippedExercises.value = new Set(flippedExercises.value);
};

const filtros = ref({
  nombre: "",
  tipo: "",
  categoria: ""
});

const originalData = ref([]); // Guardar todos los ejercicios

const emitirFiltros = () => {
  exercises.value = originalData.value.filter((ej) => {
    return (
      (!filtros.value.nombre || ej.nombre.toLowerCase().includes(filtros.value.nombre.toLowerCase())) &&
      (!filtros.value.tipo || ej.tipo.toLowerCase() === filtros.value.tipo.toLowerCase()) &&
      (!filtros.value.categoria || ej.categoria.toLowerCase() === filtros.value.categoria.toLowerCase())
    );
  });
};


const resetFiltros = () => {
  filtros.value = {
    nombre: "",
    tipo: "",
    categoria: ""
  };
  exercises.value = [...originalData.value];
};

onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:8081/exercises/get");
    originalData.value = response.data;
    exercises.value = response.data;
  } catch (error) {
    console.error("Error al cargar los ejercicios:", error);
  }
});
</script>

<style scoped>
.perspective {
  perspective: 1000px;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

.transform-style-preserve-3d {
  transform-style: preserve-3d;
}
</style>
