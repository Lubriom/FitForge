<template>
  <div class="flex flex-col h-full gap-3">
    <div class="hidden md:flex flex-row justify-between items-center gap-3 ">
      <router-link
        v-if="auth.getRole() === 'admin' || auth.getRole() === 'trainer'"
        :to="{ name: 'ExercisesCreate' }"
        class="bg-tertiary-500 hover:bg-orange-700 text-white font-medium px-4 py-2 rounded-xl shadow-md ml-3"
      >
        <span class="flex items-center gap-1"><Plus /> Nuevo</span>
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
          class="rounded-xl px-4 py-2 flex-1 min-w-[200px] bg-white text-black border border-gray-300 hover:border-tertiary-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all"
        />

        <!-- Tipo -->
        <select v-model="filtros.tipo" class="rounded-xl px-4 py-2 bg-white text-black border border-gray-300 hover:border-tertiary-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all">
          <option disabled value="">Filtrar por tipo</option>
          <option value="pull">Pull</option>
          <option value="press">Press</option>
          <option value="squat">Squat</option>
          <option value="lunges">Lunges</option>
          <option value="hit">Hit</option>
          <option value="core">Core</option>
        </select>

        <!-- Categoría -->
        <select v-model="filtros.categoria" class="rounded-xl px-4 py-2 bg-white text-black border border-gray-300 hover:border-tertiary-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all">
          <option disabled value="">Filtrar por categoría</option>
          <option value="piernas">Pierna</option>
          <option value="pecho">Pecho</option>
          <option value="espalda">Espalda</option>
          <option value="hombros">Hombros</option>
          <option value="brazos">Brazos</option>
          <option value="abdomen">Abdomen</option>
          <option value="full body">Full Body</option>
        </select>

        <!-- Botón Filtrar -->
        <button
          type="submit"
          class="bg-tertiary-500 hover:bg-orange-700 text-white py-2 px-4 rounded-lg hover:bg-tertiary-600 cursor-pointer"
        >
          <span class="flex items-center gap-1"><Funnel /> Filtrar</span>
        </button>

        <!-- Botón Reset -->
        <button
          type="button"
          @click="resetFiltros"
          class="bg-gray-300 text-black py-2 px-2 rounded-lg hover:bg-gray-400 cursor-pointer rotate"
        >
          <RotateCcw />
        </button>
      </form>
    </div>

    <div class="bg-quaternary-500 px-4 p-2 rounded-2xl text-gray-100 text-sm">
      <p>Listando {{ exercises.length }} ejercicios</p>
    </div>
    <!-- Ejercicios -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-h-full pr-3 overflow-y-auto">
      <div v-for="exercise in exercises" :key="exercise.id" class="perspective" style="perspective: 1000px">
        <div
          class="relative w-full h-52 transition-transform duration-700 transform-style-preserve-3d"
          :class="{ 'rotate-y-180': flippedExercises.has(exercise.id) }"
        >
          <!-- Front Side -->
          <div class="absolute w-full h-full backface-hidden rounded-2xl shadow-md overflow-hidden">
            <!-- Fondo combinado con efecto de 'abrazo' -->
            <div class="absolute bg-white inset-0">
              <!-- Fondo base (imagen a la derecha) -->
              <div
                :style="{
                  backgroundImage: `url(${getImageUrl(exercise.categoria)})`
                }"
                class="w-2/5 h-full bg-cover bg-no-repeat float-right"
              ></div>

              <!-- Capa superior con clip-path en curva -->
              <div class="absolute inset-0 bg-linear-[90deg,white_60%,transparent_70%]"></div>
            </div>

            <!-- Contenido -->
            <div class="relative p-5 h-full flex flex-col justify-between bg-opacity-80 rounded-2xl">
              <div class="flex flex-row justify-between items-center">
                <h2 class="max-w-[150px] text-xl font-semibold text-tertiary-600">{{ exercise.nombre }}</h2>
                <button
                  @click="toggleFlip(exercise.id)"
                  class="bg-tertiary-500 hover:bg-orange-700 text-white font-medium p-1.5 rounded-xl cursor-pointer"
                >
                  <BadgeInfo />
                </button>
              </div>
              <div class="text-gray-700 text-sm space-y-1">
                <p><strong>Tipo:</strong> {{ capitalizar(exercise.tipo) }}</p>
                <p><strong>Categoría:</strong> {{ capitalizar(exercise.categoria) }}</p>
                <p><strong>Descanso:</strong> {{ exercise.descanso }} segundos</p>
              </div>
            </div>
          </div>

          <!-- Back Side -->

          <div
            class="absolute w-full h-full backface-hidden overflow-hidden text-white rounded-2xl shadow-md rotate-y-180"
          >
            <!-- Fondo combinado con efecto de 'abrazo' -->
            <div class="absolute bg-slate-800 inset-0">
              <!-- Fondo base (imagen a la derecha) -->
              <div
                :style="{
                  backgroundImage: `url(${getImageUrl(exercise.categoria)})`
                }"
                class="w-2/5 h-full bg-cover bg-no-repeat float-right"
              ></div>

              <!-- Capa superior con clip-path en curva -->
              <div class="absolute inset-0 bg-linear-[90deg,#1e293b_60%,transparent_70%]"></div>
            </div>
            <!-- Contenido -->
            <div class="relative p-5 h-full flex flex-col justify-between bg-opacity-80 rounded-2xl">
              <div class="flex flex-row justify-between items-center">
                <h2 class="max-w-[150px] text-xl font-semibold text-tertiary-600">{{ exercise.nombre }}</h2>
                <button
                  @click="toggleFlip(exercise.id)"
                  class="bg-gray-500 hover:bg-gray-600 text-white font-medium p-1.5 rounded-xl z-15 cursor-pointer"
                >
                  <Undo2 />
                </button>
              </div>
              <div class="flex flex-row justify-between items-center">
                <div class="text-gray-200 text-sm space-y-1">
                  <p><strong>Series:</strong> {{ exercise.series }}</p>
                  <p><strong>Repeticiones:</strong> {{ exercise.repeticiones }}</p>
                  <p><strong>Peso:</strong> {{ exercise.peso }} kg</p>
                </div>
                <div class="flex h-full items-end justify-end">
                  <router-link
                    v-if="auth.getRole() === 'admin' || auth.getRole() === 'trainer'"
                    class="bg-tertiary-500 hover:bg-orange-700 text-white font-medium p-1.5 rounded-xl cursor-pointer"
                    :to="{ name: 'ExercisesEdit', params: { id: exercise.id } }"
                    ><SquarePen
                  /></router-link>
                </div>
              </div>
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
import { BadgeInfo, Undo2, RotateCcw, Plus, Funnel, SquarePen } from "lucide-vue-next";
import { computed } from "vue";
import { useAuthStore } from "@/utils/auth";

const auth = useAuthStore();

function getImageUrl(categoria) {
  return new URL(`/src/assets/imgs/exercises/${categoria}.avif`, import.meta.url).href;
}

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

const capitalizar = (texto) => {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};
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

.rotate:hover > *{
  transition: all 0.5s ease-in-out;
  transform: rotate(-360deg);
}
</style>
