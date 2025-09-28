<template>
  <div class="flex flex-1 flex-col justify-between h-full gap-3">
    <div class="flex flex-col h-full gap-3">
      <!-- Filtros y crear ejercicio PC -->
      <div class="hidden md:flex flex-row justify-between items-center gap-3">
        <router-link
          v-if="auth.getRole() === 'admin' || auth.getRole() === 'entrenador'"
          :to="{ name: 'ExercisesCreate' }"
          class="bg-tertiary-500 hover:bg-tertiary-600 h-full flex text-white font-medium px-4 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-200 shadow-md shadow-black/20"
        >
          <span class="flex items-center gap-1"><Plus /> Nuevo</span>
        </router-link>
        <form
          @submit.prevent="emitirFiltros"
          class="w-full flex flex-wrap gap-3 items-center bg-gray-100 p-2 rounded-xl shadow-[0px_10px_10px_-5px_rgba(0,0,0,0.3)]"
        >
          <!-- Nombre -->
          <input
            v-model="filtros.nombre"
            type="text"
            placeholder="Buscar por nombre"
            class="rounded-xl px-4 py-2 flex-1 min-w-[200px] bg-white text-black border border-gray-300 hover:border-tertiary-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all"
          />

          <!-- Tipo -->
          <select
            v-model="filtros.tipo"
            class="rounded-xl px-4 py-2 bg-white text-black border border-gray-300 hover:border-tertiary-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all"
          >
            <option disabled value="">Filtrar por tipo</option>
            <option value="pull">Pull</option>
            <option value="press">Press</option>
            <option value="squat">Squat</option>
            <option value="lunges">Lunges</option>
            <option value="hit">Hit</option>
            <option value="core">Core</option>
          </select>

          <!-- Categoría -->
          <select
            v-model="filtros.categoria"
            class="rounded-xl px-4 py-2 bg-white text-black border border-gray-300 hover:border-tertiary-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all"
          >
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
            class="bg-tertiary-500 hover:bg-tertiary-600 h-full flex text-white font-medium px-4 py-2 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-200"
          >
            <span class="flex items-center gap-1"><Funnel /> Filtrar</span>
          </button>

          <!-- Botón Reset -->
          <button
            type="button"
            @click="resetFiltros"
            class="bg-gray-500 h-full flex text-white font-medium p-2 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:bg-gray-700 active:text-gray-200 hover:bg-gray-600 hover:inset-shadow-gray-400 active:inset-shadow-gray-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-gray-300 rotate"
          >
            <RotateCcw />
          </button>
        </form>
      </div>

      <!-- Filtros y crear ejercicio MOBILE -->
      <div
        class="flex flex-col md:hidden absolute z-10 right-7 gap-2.5"
        :class="{ 'bottom-20': filterActive, 'bottom-3': !filterActive }"
      >
        <button
          class="bg-gray-500 flex text-white font-medium p-4 rounded-2xl shadow-md ml-3 disabled:opacity-50 disabled:cursor-not-allowed active:bg-gray-700 active:text-tertiary-200 hover:bg-gray-600 hover:inset-shadow-gray-400 active:inset-shadow-gray-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-gray-300"
          @click="enableMobileFilter()"
        >
          <Search v-if="!filterActive" />
          <X v-if="filterActive" />
        </button>

        <router-link
          v-if="auth.getRole() === 'admin' || auth.getRole() === 'entrenador'"
          :to="{ name: 'ExercisesCreate' }"
          class="h-fit bg-tertiary-500 hover:bg-tertiary-600 flex text-white font-medium p-4 rounded-2xl shadow-md ml-3 disabled:opacity-50 disabled:cursor-not-allowed active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-200"
        >
          <span class="flex items-center gap-1"><Plus /></span>
        </router-link>
      </div>

      <!-- Listado de ejercicios -->
      <div class="bg-quaternary-500 px-4 p-2 rounded-2xl text-gray-100 text-sm">
        <p>Listando {{ exercises.length }} ejercicios</p>
      </div>
      <!-- Ejercicios -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-rows-[208px] grid-flow-row gap-4 h-full pr-3 overflow-y-auto"
      >
        <div
          v-for="exercise in exercises"
          :key="exercise.id"
          class="flex h-[208px] cursor-pointer"
          @click="selectExerciseHandler(exercise)"
        >
          <div class="relative w-full rounded-2xl">
            <!-- Front Side -->
            <div class="absolute w-full h-full rounded-2xl shadow-md">
              <!-- Fondo combinado con efecto de 'abrazo' -->
              <div class="absolute bg-white inset-0 rounded-2xl">
                <!-- Fondo base (imagen a la derecha) -->
                <div
                  :style="{
                    backgroundImage: `url(${getImageUrl(exercise.categoria)})`
                  }"
                  class="w-2/5 h-full bg-cover bg-no-repeat float-right rounded-r-2xl"
                ></div>

                <!-- Capa superior con clip-path en curva -->
                <div class="absolute inset-0 bg-linear-[90deg,white_60%,transparent_70%] rounded-2xl"></div>
              </div>

              <!-- Contenido -->
              <div class="relative p-5 h-full flex flex-col justify-between bg-opacity-80 rounded-2xl">
                <div class="flex flex-row justify-between items-center">
                  <h2 class="max-w-[150px] text-xl font-semibold text-tertiary-600">{{ exercise.nombre }}</h2>
                  <button
                    v-if="auth.getRole() === 'admin' || auth.getRole() === 'entrenador'"
                    class="flex gap-1 font-semibold items-center p-1.5 rounded-xl bg-gray-50 hover:bg-gray-200 active:bg-gray-500 cursor-pointer text-orange-600 hover:text-orange-800 inset-shadow-sm inset-shadow-black/40 transition-colors"
                    :title="mostrarOpcionesId == exercise.id ? 'Ocultar opciones' : 'Mostrar opciones'"
                    @click.stop="mostrarOpcionesFunc(exercise)"
                    ref="mostrarOpcionesButton"
                  >
                    <Ellipsis v-if="mostrarOpcionesId !== exercise.id" class="pointer-events-none" />
                    <X v-else class="pointer-events-none" />
                  </button>
                </div>
                <div class="text-gray-700 text-sm space-y-1">
                  <p><strong>Tipo:</strong> {{ capitalizar(exercise.tipo) }}</p>
                  <p><strong>Categoría:</strong> {{ capitalizar(exercise.categoria) }}</p>
                </div>
              </div>

              <!-- Dropdown de opciones  -->
              <Transition name="fade-slide">
                <div
                  :style="{ top: posicionOpciones.top + 5 + 'px', left: posicionOpciones.left - 240 + 'px' }"
                  class="z-20 fixed bg-gray-200 p-3 rounded-2xl shadow-lg shadow-black/50 flex gap-2 flex-col w-[280px] border-1 border-gray-300"
                  v-if="mostrarOpcionesId == exercise.id"
                  ref="mostrarOpcionesMenu"
                >
                  <router-link
                    v-if="auth.getRole() === 'admin' || auth.getRole() === 'entrenador'"
                    :to="{ name: 'ExercisesEdit', params: { id: exercise.id } }"
                    class="bg-tertiary-500 hover:bg-tertiary-600 flex gap-1 justify-center text-white font-semibold items-center px-3 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-300"
                    title="Editar Ejercicio"
                  >
                    Editar Ejercicio <SquarePen />
                  </router-link>

                  <button
                    v-if="auth.getRole() === 'admin' || auth.getRole() === 'entrenador'"
                    class="bg-red-500 text-white font-semibold p-2 flex gap-1 justify-center rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:bg-red-700 active:text-tertiary-200 hover:bg-red-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-200"
                    type="button"
                    @click="eliminarEjercicio(exercise.id)"
                  >
                    Eliminar Ejercicio <Trash />
                  </button>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>

      <!-- Popup del ejercicio seleccionado -->
      <Transition name="slide-up">
        <div
          v-if="selectExercise"
          class="absolute top-0 left-0 w-full h-full bg-black/70 flex justify-end items-end md:justify-center md:items-center z-30"
        >
          <div class="relative w-full md:w-[80%] bg-black h-[60%] md:h-[70%] rounded-t-3xl md:rounded-3xl">
            <div class="absolute w-full h-full rounded-3xl">
              <div class="absolute bg-black inset-0 rounded-3xl bottom-0">
                <!-- Fondo base (imagen a la derecha) -->
                <div
                  :style="{
                    backgroundImage: `url(${getImageUrl(selectExercise.categoria)})`
                  }"
                  class="w-2/5 h-full bg-cover bg-no-repeat float-right rounded-r-2xl opacity-50"
                ></div>

                <!-- Capa superior con clip-path en curva -->
                <div class="absolute inset-0 bg-linear-[90deg,black_60%,transparent_70%] rounded-3xl"></div>
              </div>

              <div class="relative flex w-full h-full flex-col p-5">
                <div class="flex flex-row justify-end gap-2">
                  <router-link
                    v-if="auth.getRole() === 'admin' || auth.getRole() === 'entrenador'"
                    :to="{ name: 'ExercisesEdit', params: { id: selectExercise.id } }"
                    class="bg-tertiary-500 hover:bg-tertiary-600 flex gap-1 justify-center text-white font-semibold items-center px-3 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-300"
                    title="Editar Ejercicio"
                  >
                    Editar<SquarePen />
                  </router-link>
                  <button
                    class="flex gap-1 font-semibold items-center p-1.5 px-2 rounded-xl bg-gray-50 hover:bg-gray-200 active:bg-gray-500 cursor-pointer text-orange-600 hover:text-orange-800 inset-shadow-sm inset-shadow-black/40 transition-colors"
                    @click="selectExercise = null"
                  >
                    <X />
                  </button>
                </div>
                <div class="flex flex-col ml-4 text-gray-400 gap-5">
                  <p class="text-orange-500 text-5xl font-semibold">{{ capitalizar(selectExercise.nombre) }}</p>
                  <div class="flex gap-5">
                    <p class="text-white bg-orange-500/80 px-3 py-1 rounded-xl">
                      <span class="font-semibold">Categoria:</span> {{ capitalizar(selectExercise.categoria) }}
                    </p>
                    <p class="text-white bg-orange-500/80 px-3 py-1 rounded-xl">
                      <span class="font-semibold">Tipo:</span> {{ capitalizar(selectExercise.tipo) }}
                    </p>
                  </div>
                  <div>
                    <span
                      ><span class="font-semibold text-gray-200">Descripcion:</span>
                      {{ selectExercise.descripcion ?? "Este ejercicio no posee descripción alguna" }}</span
                    >
                  </div>
                  <div class="flex gap-5 bottom-0">
                    <p>
                      <span class="font-semibold text-orange-500">Recomendado: </span>Se recomienda hacer
                      {{ selectExercise.repeticiones }}
                      {{ selectExercise.repeticiones > 1 ? "repeticiones" : "repeticion" }} de
                      {{ selectExercise.series }} {{ selectExercise.series > 1 ? "series" : "serie" }}.
                      <span v-if="selectExercise.peso > 0">Con un peso de {{ selectExercise.peso }} kg </span
                      ><span v-else>Sin peso</span> Y
                      <span v-if="selectExercise.descanso > 0"
                        >un descanso de {{ selectExercise.descanso }} segundos</span
                      ><span v-else>Sin descanso</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <div :class="{ hidden: !filterActive }" class="flex w-full h-fit self-end text-white md:hidden transition-all">
        <form
          @submit.prevent="emitirFiltros"
          class="w-full flex gap-3 items-center bg-gray-100 p-2 rounded-xl shadow-[0px_10px_10px_-5px_rgba(0,0,0,0.3)] self-end"
        >
          <div class="relative flex-1">
            <input
              v-model="filtros.nombre"
              type="text"
              placeholder="Buscar por nombre"
              class="w-full rounded-xl px-4 py-2 pr-10 bg-white text-black border border-gray-300 hover:border-tertiary-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all"
            />
            <button
              type="button"
              @click="resetFiltros"
              v-if="filtros.nombre"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 transition"
            >
              <X class="w-6 h-6" />
            </button>
          </div>

          <!-- Botón Filtrar -->
          <button
            type="submit"
            class="bg-tertiary-500 hover:bg-tertiary-600 h-full flex gap-1 text-white font-medium p-2 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-300"
          >
            <Funnel />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";
import { useLayoutStore } from "@/stores/layoutStore";
import { BadgeInfo, Undo2, RotateCcw, Plus, Funnel, SquarePen, Search, X, Ellipsis, Trash } from "lucide-vue-next";
import { computed } from "vue";
import { useAuthStore } from "@/utils/Auth";

const emit = defineEmits(["loading-start", "loading-end"]);

const auth = useAuthStore();

function getImageUrl(categoria) {
  return new URL(`/src/assets/imgs/exercises/${categoria}.avif`, import.meta.url).href;
}

const filterActive = ref(false);

const layoutStore = useLayoutStore();
layoutStore.setTitle("Ejercicios");

const exercises = ref([]);
const selectExercise = ref(null);

const mostrarOpcionesId = ref(null);
const mostrarOpcionesButton = ref(null);
const mostrarOpcionesMenu = ref(null);

const posicionOpciones = ref({ top: 0, left: 0 });
const exerciseOpcSeleccionada = ref(null);

function mostrarOpcionesFunc(exercise) {
  mostrarOpcionesId.value = mostrarOpcionesId.value === exercise.id ? null : exercise.id;
  exerciseOpcSeleccionada.value = exercises.value.indexOf(exercise);

  const rect = mostrarOpcionesButton.value[exerciseOpcSeleccionada.value].getBoundingClientRect();

  // console.log(posicionOpciones.value);
  posicionOpciones.value = {
    top: rect.bottom + window.scrollY,
    left: rect.left + window.scrollX
  };
  selectExercise.value = null;
}

function handleClickOutside(event) {
  if (exerciseOpcSeleccionada.value == null) return;

  const clickedOutside =
    !mostrarOpcionesMenu.value[exerciseOpcSeleccionada.value]?.contains(event.target) &&
    !mostrarOpcionesButton.value[exerciseOpcSeleccionada.value]?.contains(event.target);

  if (clickedOutside) {
    mostrarOpcionesId.value = null;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

function selectExerciseHandler(exercise) {
  selectExercise.value = exercise;
}

function enableMobileFilter() {
  filterActive.value = filterActive.value ? false : true;
}

const originalData = ref([]); // Guardar todos los ejercicios

const filtros = ref({
  nombre: "",
  tipo: "",
  categoria: ""
});

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
  emit("loading-start");

  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/exercises/get`);
    originalData.value = response.data;
    exercises.value = response.data;
  } catch (error) {
    console.error("Error al cargar los ejercicios:", error);
  } finally {
    emit("loading-end");
  }
});

const eliminarEjercicio = async (id) => {
  const ejercicioId = id;
  try {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/exercises/delete/${ejercicioId}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` }
      }
    );
    toast.success("Ejercicio eliminado con exito");
    router.push({ name: "Exercises" });
  } catch (error) {
    console.error("Error al eliminar el ejercicio:", error);
    error.value.serverError = "No se pudo eliminar el ejercicio.";
  }
};

const capitalizar = (texto) => {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.fade-out-leave-active {
  transition: opacity 1s ease 0.2s; /* Solo salida, con delay */
}

.fade-out-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  /* transform: translateY(4px); */
}
</style>
