<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useAuthStore } from "@/utils/Auth";
import { useLayoutStore } from "@/stores/layoutStore";
import { useRouter, useRoute } from "vue-router";
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, FileDown, SquarePen } from "lucide-vue-next";

const emit = defineEmits(["loading-start", "loading-end"]);

const route = useRoute();

const layoutStore = useLayoutStore();
const auth = useAuthStore();

const plan = ref(null);
const planId = route.params.id;
const loading = ref(true);
const error = ref("");

const semanaActual = ref([]);
const diasSemanaActual = computed(() => semanaActual.value);
const diaSeleccionadoIndex = ref(0);
const diaSeleccionado = ref(null);

function seleccionarDia(index) {
  diaSeleccionadoIndex.value = index;
  diaSeleccionado.value = diasSemanaActual.value[index];
}

function obtenerFechaDelDia(diaNumero) {
  if (!plan.value) return "";

  const fechaInicio = new Date(plan.value.fechaInicio);
  const fechaDelDia = new Date(fechaInicio);
  fechaDelDia.setDate(fechaInicio.getDate() + diaNumero - 1);

  const opciones = { weekday: "long", day: "numeric", month: "long" };
  return fechaDelDia.toLocaleDateString("es-ES", opciones);
}

async function fetchPlan() {
  emit("loading-start");
  loading.value = true;
  error.value = "";

  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/trains/plan/${planId}`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` }
    });

    plan.value = res.data;
    semanaActual.value = plan.value.dias;
    seleccionarDia(0);
    layoutStore.setTitle("Rutina: " + plan.value.nombre);
  } catch (err) {
    error.value = "Error cargando el plan";
    console.error(err);
  } finally {
    loading.value = false;
    emit("loading-end");
  } 
}

const capitalizar = (texto) => {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

function formatFecha(fecha) {
  if (!fecha) return "";
  const opciones = { day: "2-digit", month: "2-digit" };
  return new Intl.DateTimeFormat("es-ES", opciones).format(new Date(fecha));
}

const paginaActual = ref(0);
const diasPorPagina = 7;

const diasPaginados = computed(() => {
  const inicio = paginaActual.value * diasPorPagina;
  return semanaActual.value.slice(inicio, inicio + diasPorPagina);
});

const totalPaginas = computed(() => {
  return Math.ceil(semanaActual.value.length / diasPorPagina);
});

function irPagina(p) {
  if (p < 0) p = 0;
  if (p >= totalPaginas.value) p = totalPaginas.value - 1;
  paginaActual.value = p;
  // Reseteamos la selección al primer día visible
  seleccionarDia(p * diasPorPagina);
}

function siguientePagina() {
  if (paginaActual.value < totalPaginas.value - 1) {
    irPagina(paginaActual.value + 1);
  }
}

function paginaAnterior() {
  if (paginaActual.value > 0) {
    irPagina(paginaActual.value - 1);
  }
}

function abreviarDia(nombre) {
  if (!nombre || typeof nombre !== "string") return "";
  return nombre.slice(0, 3);
}

onMounted(() => {
  fetchPlan();
});
</script>

<template>
  <div class="w-full h-full">
    <div v-if="loading" class="text-center text-gray-500">Cargando plan...</div>
    <div v-if="error" class="text-center text-red-600">{{ error }}</div>

    <div v-if="plan" class="flex flex-col bg-white shadow rounded-lg p-5 gap-3 h-full">
      <div class="gap-2 flex flex-col">
        <div class="flex flex-row w-full justify-between items-center">
          <h2 class="text-xl font-semibold">
            <b>Nombre: {{ plan.nombre }}</b>
          </h2>
          <div class="flex flex-row gap-2">
            <button
              class="text-md text-white bg-tertiary-500 hover:bg-orange-700 rounded-md p-2 cursor-pointer flex gap-1 items-center"
            >
              Exportar PDF <FileDown />
            </button>
            <router-link
              :to="{ name: 'ExercisesTrainEdit', params: { id: plan.id, userId: auth.getId() } }"
              class="text-md text-white bg-tertiary-500 hover:bg-orange-700 rounded-md p-2 cursor-pointer flex gap-1 items-center"
            >
              Editar <SquarePen />
            </router-link>
          </div>
        </div>
        <div class="flex flex-row justify-between">
          <p class="text-gray-700"><b>Descripcion: </b>{{ plan.descripcion || "Sin descripción" }}</p>
          <div class="flex flex-col gap-2 text-sm text-gray-500 mb-1">
            <div class="flex flex-row gap-2">
              <p class="flex items-center gap-2">
                <strong>Objetivo:</strong>
                <span class="text-sm px-3 py-1 bg-tertiary-500/20 text-tertiary-500 rounded-full">{{
                  capitalizar(plan.objetivo) || "No definido"
                }}</span>
              </p>
              <p class="flex items-center gap-2">
                <strong>Nivel:</strong>
                <span class="text-sm px-3 py-1 bg-tertiary-500/20 text-tertiary-500 rounded-full">{{
                  capitalizar(plan.nivel) || "Nivel no especificado"
                }}</span>
              </p>
            </div>
            <div class="flex flex-row">
              <p class="text-sm text-gray-500 justify-stretch">
                <b>Desde:</b> {{ new Date(plan.fechaInicio).toLocaleDateString() }} | <b>Hasta:</b>
                {{ new Date(plan.fechaFin).toLocaleDateString() }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Navegación paginada de días -->
      <div class="flex items-center gap-2">
        <button
          @click="irPagina(0)"
          :disabled="paginaActual === 0"
          class="p-2 rounded-md bg-tertiary-500 hover:bg-orange-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 text-white h-full"
          title="Primera página"
        >
          <ChevronFirst />
        </button>
        <button
          @click="paginaAnterior"
          :disabled="paginaActual === 0"
          class="p-2 rounded-md bg-tertiary-500 hover:bg-orange-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 text-white h-full"
          title="Página anterior"
        >
          <ChevronLeft />
        </button>

        <div class="flex gap-2 w-full">
          <button
            v-if="diasPaginados.length > 0"
            v-for="(dia, index) in diasPaginados"
            :key="paginaActual * diasPorPagina + index"
            @click="seleccionarDia(paginaActual * diasPorPagina + index)"
            :class="[
              'w-full p-3 rounded-md font-medium whitespace-nowrap cursor-pointer',
              diaSeleccionadoIndex === paginaActual * diasPorPagina + index
                ? 'bg-tertiary-500 hover:bg-orange-600 text-white flex flex-col items-center justify-center'
                : 'bg-gray-100 hover:bg-gray-200 flex flex-col items-center justify-center'
            ]"
          >
            <p>{{ capitalizar(abreviarDia(obtenerFechaDelDia(dia.diaNumero))) + " " + formatFecha(dia.fecha) }}</p>
            <span class="text-xs text-gray-600">{{ capitalizar(dia.grupoMuscular) || "Descanso" }}</span>
          </button>
          <p v-else class="mx-auto">No hay dias para este entrenamiento</p>
        </div>

        <button
          @click="siguientePagina"
          :disabled="paginaActual === totalPaginas - 1"
          class="p-2 rounded-md bg-tertiary-500 hover:bg-orange-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 text-white h-full"
          title="Página siguiente"
        >
          <ChevronRight />
        </button>
        <button
          @click="irPagina(totalPaginas - 1)"
          :disabled="paginaActual === totalPaginas - 1"
          class="p-2 rounded-md bg-tertiary-500 hover:bg-orange-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 text-white h-full"
          title="Última página"
        >
          <ChevronLast />
        </button>
      </div>

      <div class="bg-gray-50 p-4 rounded-lg shadow-inner flex flex-col overflow-y-auto max-h-full gap-2">
        <template v-if="diaSeleccionado && diaSeleccionado.ejercicios.length > 0">
          <h3 class="text-lg font-semibold px-2">
            {{ capitalizar(obtenerFechaDelDia(diaSeleccionado.diaNumero)) }} -
            {{ capitalizar(diaSeleccionado.grupoMuscular) || "Sin grupo muscular" }}
          </h3>

          <div class="grid lg:grid-cols-2 gap-2">
            <div
              v-for="ej in diaSeleccionado.ejercicios"
              :key="ej.id"
              class="bg-white rounded-2xl p-3 flex justify-between items-center shadow-lg"
            >
              <div>
                <p class="font-medium text-gray-900">{{ ej.ejercicio.nombre }}</p>
                <p class="text-gray-600 text-sm">
                  Series: {{ ej.series }}, Repeticiones: {{ ej.repeticiones }}, Descanso: {{ ej.descanso }} seg
                </p>
              </div>
              <div class="text-tertiary-500 font-semibold">{{ ej.peso }} kg</div>
            </div>
          </div>
        </template>

        <template v-else-if="diaSeleccionado && diaSeleccionado.ejercicios.length === 0">
          <p class="text-center text-gray-500 text-lg">Este día puedes descansar 😌</p>
        </template>

        <template v-else>
          <p class="text-center text-gray-600 text-lg">No hay un dia seleccionado</p>
        </template>
      </div>
    </div>
  </div>
</template>

<style>
/* Tailwind incluido globalmente */
</style>
