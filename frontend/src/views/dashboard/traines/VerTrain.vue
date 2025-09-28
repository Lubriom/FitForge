<template>
  <div class="w-full h-full">
    <div v-if="loading" class="text-center text-gray-500">Cargando plan...</div>
    <div v-if="error" class="text-center text-red-600">{{ error }}</div>

    <div v-if="plan" class="flex flex-col bg-white shadow rounded-lg p-5 gap-3 h-full">
      <div class="gap-2 flex flex-col">
        <div class="flex flex-row w-full justify-between items-center gap-2">
          <h2 class="text-xl font-semibold">
            <p class="font-semibold">{{ capitalizar(plan.nombre) }}</p>
          </h2>

          <div class="flex flex-row gap-2">
            <!-- Fechas -->
            <div class="flex-row gap-2 text-gray-600 lg:flex hidden">
              <div class="flex gap-1 items-center">
                <b>Desde:</b>
                <span
                  class="text-sm font-semibold px-3 py-1 bg-tertiary-500/20 text-tertiary-500 rounded-full border-2 border-orange-400"
                  >{{ new Date(plan.fechaInicio).toISOString().split("T")[0] }}</span
                >
              </div>
              <div class="flex gap-1 items-center">
                <b>Hasta:</b>
                <span
                  class="text-sm font-semibold px-3 py-1 bg-tertiary-500/20 text-tertiary-500 rounded-full border-2 border-orange-400"
                  >{{ new Date(plan.fechaFin).toISOString().split("T")[0] }}</span
                >
              </div>
            </div>

            <!-- Categorias -->
            <div class="hidden flex-row gap-2 sm:flex">
              <p class="flex items-center gap-2">
                <!-- <strong>Objetivo:</strong> -->
                <span
                  class="text-sm font-semibold px-2 py-1 bg-tertiary-500/20 text-tertiary-500 rounded-full border-2 border-orange-400 flex gap-1"
                >
                  <Dumbbell v-if="plan.objetivo == 'hipertrofia'" />
                  <HandIcon v-if="plan.objetivo == 'fuerza'" />
                  <PaintbrushVertical v-if="plan.objetivo == 'personalizado'" />
                  {{ capitalizar(plan.objetivo) || "No definido" }}</span
                >
              </p>
              <p class="flex items-center gap-2">
                <!-- <strong>Nivel:</strong> -->
                <span
                  class="text-sm font-semibold px-2 py-1 bg-tertiary-500/20 text-tertiary-500 rounded-full border-2 border-orange-400 flex gap-1"
                >
                  <Gauge />{{ capitalizar(plan.nivel) || "Nivel no especificado" }}</span
                >
              </p>
            </div>
            <button
              @click="exportarPDF"
              class="bg-tertiary-500 hover:bg-tertiary-600 hidden lg:flex gap-1 text-white font-semibold items-center px-3 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-300"
              title="Descargar Plan"
            >
              <span class="hidden md:inline min-w-[100px]">Exportar PDF</span> <FileDown />
            </button>
            <button
              class="flex gap-1 font-semibold items-center px-3 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 active:bg-gray-400 roudned-2xl cursor-pointer text-orange-600"
              title="Opciones"
              @click="mostrarOpciones = !mostrarOpciones"
              ref="mostrarOpcionesButton"
            >
              <Ellipsis />
            </button>

            <!-- Dropdown de opciones  -->
            <Transition name="fade-slide">
              <div
                class="z-10 absolute top-38 sm:top-38 md:top-36 right-8 bg-gray-200 p-3 rounded-2xl shadow-lg shadow-black/50 flex gap-2 flex-col w-[280px] border-1 border-gray-300"
                v-if="mostrarOpciones"
                ref="mostrarOpcionesMenu"
              >
                <div
                  class="bg-white p-2 rounded-2xl shadow-sm lg:hidden shadow-gray-400/50 inset-shadow-gray-100 inset-shadow-sm mb-1"
                >
                  <div class="flex flex-row gap-2 w-full justify-center items-center my-1 text-orange-800">
                    <p class="font-semibold font-mono">INFORMACIÓN</p>
                    <Info class="w-6 h-6" />
                  </div>
                  <!-- Categorias -->
                  <div class="flex flex-col gap-2 text-gray-500 sm:hidden text-sm px-2 pt-2">
                    <div class="flex justify-between items-center gap-2">
                      <b>Objetivo:</b>
                      <span
                        class="text-sm font-semibold px-2 py-1 bg-tertiary-500/20 text-tertiary-500 rounded-full border-2 border-orange-400 flex gap-1"
                      >
                        <Dumbbell v-if="plan.objetivo == 'hipertrofia'" />
                        <HandIcon v-if="plan.objetivo == 'fuerza'" />
                        <PaintbrushVertical v-if="plan.objetivo == 'personalizado'" />
                        {{ capitalizar(plan.objetivo) || "No definido" }}</span
                      >
                    </div>
                    <div class="flex justify-between items-center gap-2">
                      <b>Nivel:</b>
                      <span
                        class="text-sm font-semibold px-2 py-1 bg-tertiary-500/20 text-tertiary-500 rounded-full border-2 border-orange-400 flex gap-1"
                      >
                        <Gauge />{{ capitalizar(plan.nivel) || "Nivel no especificado" }}</span
                      >
                    </div>
                  </div>
                  <!-- Fechas -->
                  <div class="flex-col gap-2 text-gray-500 text-sm lg:hidden flex p-2">
                    <div class="flex gap-1 justify-between items-center">
                      <b>Desde:</b>
                      <span
                        class="text-sm font-semibold px-3 py-1 bg-tertiary-500/20 text-tertiary-500 rounded-full border-2 border-orange-400"
                        >{{ new Date(plan.fechaInicio).toISOString().split("T")[0] }}</span
                      >
                    </div>
                    <div class="flex gap-1 justify-between items-center">
                      <b>Hasta:</b>
                      <span
                        class="text-sm font-semibold px-3 py-1 bg-tertiary-500/20 text-tertiary-500 rounded-full border-2 border-orange-400"
                        >{{ new Date(plan.fechaFin).toISOString().split("T")[0] }}</span
                      >
                    </div>
                  </div>
                </div>
                <button
                  @click="exportarPDF"
                  class="bg-tertiary-500 hover:bg-tertiary-600 flex lg:hidden gap-1 justify-center text-white font-semibold items-center px-3 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-300"
                  title="Descargar Plan"
                >
                  Exportar PDF <FileDown />
                </button>
                <router-link
                  v-if="auth.getRole() === 'admin' || auth.getRole() === 'entrenador'"
                  :to="{ name: 'ExercisesTrainEdit', params: { id: plan.id, userId: plan.usuarioId } }"
                  class="bg-tertiary-500 hover:bg-tertiary-600 flex gap-1 justify-center text-white font-semibold items-center px-3 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-300"
                  title="Editar plan"
                >
                  Editar Plan <SquarePen />
                </router-link>

                <button
                  class="bg-red-500 text-white font-semibold p-2 flex gap-1 justify-center rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:bg-red-700 active:text-tertiary-200 hover:bg-red-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-200"
                  type="button"
                  @click="eliminarRutina(rutina.id)"
                >
                  Eliminar Plan <Trash />
                </button>
              </div>
            </Transition>
          </div>
        </div>
        <!-- <div class="flex flex-col md:flex-row justify-between min-h-20"> -->
        <!-- <p class="text-gray-700"><b>Descripcion: </b>{{ plan.descripcion || "Sin descripción" }}</p> -->
        <!-- </div> -->
      </div>

      <!-- Navegación paginada de días PC -->
      <div class="hidden items-center gap-2 lg:flex">
        <button
          @click="irPagina(0)"
          :disabled="semanaIndex === 0 || plan.dias.length === 0"
          class="bg-tertiary-500 hover:bg-tertiary-600 flex gap-1 text-white font-semibold items-center px-3 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-300 h-full"
          title="Primera página"
        >
          <ChevronFirst />
        </button>
        <button
          @click="anteriorPagina"
          :disabled="semanaIndex === 0 || plan.dias.length === 0"
          class="bg-tertiary-500 hover:bg-tertiary-600 flex gap-1 text-white font-semibold items-center px-3 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-300 h-full"
          title="Página anterior"
        >
          <ChevronLeft />
        </button>
        <div class="w-full gap-2 flex flex-col items-center">
          <div class="w-full bg-gray-400 text-xs font-semibold p-1 rounded-lg text-white text-center">
            Semana {{ semanaIndex + 1 }} de {{ totalsemanas }}
          </div>
          <div class="flex flex-row gap-2 w-full items-center">
            <button
              v-if="semanaActual && semanaActual.length > 0"
              v-for="(dia, index) in semanaActual"
              :disabled="
                new Date(dia.fecha).setHours(0, 0, 0, 0) < new Date(plan.fechaInicio).setHours(24, 0, 0, 0) ||
                new Date(dia.fecha).setHours(0, 0, 0, 0) > new Date(plan.fechaFin).setHours(24, 0, 0, 0)
              "
              @click="seleccionarDia(index)"
              :key="dia.id"
              :class="[
                'w-full p-3 font-semibold whitespace-nowrap cursor-pointer px-3 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-sm',
                diaSeleccionado && diaSeleccionado.id === dia.id
                  ? 'bg-tertiary-500 hover:bg-orange-600 text-white flex flex-col items-center justify-center inset-shadow-sm inset-shadow-orange-950'
                  : 'bg-gray-200 hover:bg-gray-300 flex flex-col items-center justify-center active:inset-shadow-sm active:inset-shadow-gray-600'
              ]"
            >
              <p>
                {{ capitalizar(abreviarDia(obtenerFechaDelDia(dia.fecha))) + " " + formatFecha(dia.fecha) }}
              </p>
              <span
                class="text-xs"
                :class="diaSeleccionado && diaSeleccionado.id === dia.id ? 'text-black' : 'text-orange-700'"
                >{{ capitalizar(dia.grupoMuscular) || "Descanso" }}</span
              >
            </button>
            <p v-else class="text-center bg-gray-200 w-full text-black text-lg mx-auto py-3.5 rounded-2xl">No hay ningún dia en el plan</p>
          </div>
        </div>
        <button
          @click="siguientePagina"
          :disabled="semanaIndex === totalsemanas - 1 || plan.dias.length === 0"
          class="bg-tertiary-500 hover:bg-tertiary-600 flex gap-1 text-white font-semibold items-center px-3 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-300 h-full"
          title="Página siguiente"
        >
          <ChevronRight />
        </button>
        <button
          @click="irPagina(totalsemanas - 1)"
          :disabled="semanaIndex === totalsemanas - 1 || plan.dias.length === 0"
          class="bg-tertiary-500 hover:bg-tertiary-600 flex gap-1 text-white font-semibold items-center px-3 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-300 h-full"
          title="Última página"
        >
          <ChevronLast />
        </button>
      </div>

      <!-- Navegación paginada de dias MOBILE -->
      <div class="flex items-center gap-2 lg:hidden">
        <div class="flex h-full flex-col sm:flex-row gap-2">
          <button
            @click="anteriorDia()"
            :disabled="diaSeleccionado?.diaNumero === 1 || plan.dias.length === 0"
            class="bg-tertiary-500 hover:bg-tertiary-600 flex gap-1 text-white font-semibold items-center px-3 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-300 h-full"
            title="Día Anterior"
          >
            <ChevronLeft />
          </button>
          <button
            @click="primerDia()"
            :disabled="diaSeleccionado?.diaNumero === 1 || plan.dias.length === 0"
            class="bg-tertiary-500 hover:bg-tertiary-600 flex gap-1 text-white font-semibold items-center px-3 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-300 h-full"
            title="Primer Día"
          >
            <ChevronFirst />
          </button>
        </div>
        <div class="w-full gap-2 flex flex-col items-center" v-if="diaSeleccionado">
          <div class="w-full bg-gray-400 text-xs font-semibold p-1 rounded-lg text-white text-center">
            Dia {{ diaSeleccionado.diaNumero }} de {{ plan.dias.length }}
          </div>
          <div class="flex flex-row gap-2 w-full items-center">
            <div
              :class="[
                'w-full relative p-3 font-semibold whitespace-nowrap bg-gray-100 border-1 border-gray-300 flex items-center flex-col px-3 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-sm'
              ]"
              @click="mostrarDias = !mostrarDias"
              ref="mostrarDiasButton"
            >
              <p>
                {{
                  capitalizar(abreviarDia(obtenerFechaDelDia(diaSeleccionado.fecha))) +
                  " " +
                  formatFecha(diaSeleccionado.fecha)
                }}
              </p>
              <span class="text-xs">{{ capitalizar(diaSeleccionado.grupoMuscular) || "Descanso" }}</span>
              <button
                class="absolute right-2 top-2.5 bg-tertiary-500 hover:bg-tertiary-600 flex gap-1 text-white font-semibold items-center p-1.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-300"
                ref="mostrarDiasButton"
                title="Ver más días"
                >
                <ChevronUp v-if="mostrarDias" />
                <ChevronDown v-else />
              </button>

              <!-- Mostrar dias -->

              <div
                v-if="mostrarDias"
                ref="mostrarDiasMenu"
                class="absolute top-16 border-1 flex flex-col border-gray-300 rounded-2xl w-[280px] h-[400px] z-10 bg-gray-200 p-2 shadow-lg shadow-black/50"
              >
                <div class="overflow-y-scroll">
                  <div class="flex flex-col gap-2 mr-2">
                    <button
                      v-for="dia in plan.dias"
                      :key="dia.id"
                      @click="diaSeleccionado = dia"
                      class="w-full p-3 font-semibold whitespace-nowrap cursor-pointer px-3 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      :class="
                        diaSeleccionado && diaSeleccionado.id === dia.id
                          ? 'bg-tertiary-500 inset-shadow-sm inset-shadow-gray-800'
                          : 'bg-white'
                      "
                    >
                      <p>
                        {{ capitalizar(abreviarDia(obtenerFechaDelDia(dia.fecha))) + " " + formatFecha(dia.fecha) }}
                      </p>
                      <span class="text-xs">{{ capitalizar(dia.grupoMuscular) || "Descanso" }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p v-else class="w-full bg-gray-200 text-black text-md p-2 mx-auto py-5 rounded-2xl items-center text-center align-middle">No hay ningún día en el plan</p>

        <div class="flex h-full flex-col sm:flex-row gap-2">
          <button
            @click="siguienteDia()"
            :disabled="diaSeleccionado?.diaNumero === plan.dias.length || plan.dias.length === 0"
            class="bg-tertiary-500 hover:bg-tertiary-600 flex gap-1 text-white font-semibold items-center px-3 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-300 h-full"
            title="Día Siguiente"
          >
            <ChevronRight />
          </button>
          <button
            @click="ultimoDia()"
            :disabled="diaSeleccionado?.diaNumero === plan.dias.length || plan.dias.length === 0"
            class="bg-tertiary-500 hover:bg-tertiary-600 flex gap-1 text-white font-semibold items-center px-3 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-300 h-full"
            title="Último Día"
          >
            <ChevronLast />
          </button>
        </div>
      </div>

      <div
        class="bg-gray-100 p-4 rounded-xl inset-shadow-sm inset-shadow-gray-400 flex flex-col overflow-y-auto max-h-full gap-2 h-full"
      >
        <!-- Ejercicios del dia seleccionado -->
        <template v-if="diaSeleccionado && diaSeleccionado.ejercicios.length > 0">
          <div class="font-semibold px-2 flex w-full justify-between items-center">
            <p class="md:text-md text-sm">
              {{ capitalizar(obtenerFechaDelDia(diaSeleccionado.diaNumero)) }}
            </p>
            <p>
              <span class="hidden md:inline text-sm">Grupo Muscular: </span>
              <span class="text-md font-semibold text-orange-700">{{
                capitalizar(diaSeleccionado.grupoMuscular) || "No asignado"
              }}</span>
            </p>
          </div>

          <div class="grid lg:grid-cols-2 gap-2">
            <div
              v-for="ej in diaSeleccionado.ejercicios"
              :key="ej.id"
              class="bg-white rounded-2xl p-3 px-4 flex justify-between items-center shadow-lg"
            >
              <div class="flex flex-row gap-3 items-center">
                <div
                  class="bg-gray-200 rounded-xl w-8 h-8 flex items-center justify-center font-mono inset-shadow-sm inset-shadow-black/50"
                >
                  {{ ej.orden }}
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ ej.ejercicio.nombre }}</p>
                  <div class="hidden md:inline text-black text-sm">
                    <span class="font-semibold text-orange-700">Series:</span>
                    <span class="px-1"> {{ ej.series }} </span>
                    <span class="font-semibold text-orange-700">Repeticiones:</span>
                    <span class="px-1"> {{ ej.repeticiones }} </span>
                    <span class="font-semibold text-orange-700">Descanso:</span>
                    <span class="px-1"> {{ ej.descanso }} seg</span>
                  </div>
                  <p class="md:hidden text-gray-600 text-sm flex flex-col gap-0.5">
                    <span>Series: {{ ej.series }}</span>
                    <span>Repeticiones: {{ ej.repeticiones }}</span>
                    <span>Descanso: {{ ej.descanso }} sg</span>
                  </p>
                </div>
              </div>
              <div v-if="ej.peso > 0" class="text-tertiary-500 font-semibold">{{ ej.peso }} kg</div>
              <div v-else class="text-tertiary-500 font-semibold">Sin peso</div>
            </div>
          </div>
        </template>

        <!-- Si el dia seleccionado no tiene grupo muscular -->
        <template
          v-else-if="diaSeleccionado && diaSeleccionado.ejercicios.length === 0 && !diaSeleccionado.grupoMuscular"
        >
          <p class="text-center text-gray-500 text-lg my-auto">Este día puedes descansar 😌</p>
        </template>

        <!-- Si el dia seleccionado no tiene ejercicios -->
        <template v-else-if="diaSeleccionado && diaSeleccionado.ejercicios.length === 0">
          <div class="my-auto gap-1">
            <p class="text-center text-gray-500 text-lg mb-1">Este dia no tiene ningún ejercicio asignado</p>
            <p class="text-center text-gray-400 text-sm italic">
              Puedes añadir ejercicios editando el dia desde el panel de edición
            </p>
          </div>
        </template>

        <template v-else>
          <div class="my-auto">
            <p class="text-center text-gray-600 text-lg font-semibold">No hay un dia seleccionado</p>
            <p class="text-center text-gray-500 italic text-md">
              Selecciona un dia de entrenamiento para poder consultar los ejericicios de ese dia
            </p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import axios from "axios";
import { useAuthStore } from "@/utils/Auth";
import { useLayoutStore } from "@/stores/layoutStore";
import { useRouter, useRoute } from "vue-router";
import {
  ArrowBigDown,
  ChevronDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Dumbbell,
  Ellipsis,
  FileDown,
  Gauge,
  HandHelping,
  HandIcon,
  Info,
  PaintbrushVertical,
  SquarePen,
  Trash
} from "lucide-vue-next";
import jsPDF from "jspdf";

const emit = defineEmits(["loading-start", "loading-end"]);

const route = useRoute();

const layoutStore = useLayoutStore();
const auth = useAuthStore();

const plan = ref(null);
const planId = route.params.id;
const loading = ref(true);
const error = ref("");

const semanaIndex = ref(0);
const semanaActual = ref([]);
const semanas = ref([]);

const diaSeleccionado = ref(null);

const mostrarOpciones = ref(false);
const mostrarOpcionesButton = ref(null);
const mostrarOpcionesMenu = ref(null);

const mostrarDias = ref(false);
const mostrarDiasButton = ref(null);
const mostrarDiasMenu = ref(null);

const totalsemanas = ref(0);

function handleClickOutside(event) {

  const hola = !mostrarOpcionesMenu.value?.con
  const clickedOutsideOpciones = !mostrarOpcionesMenu.value?.contains(event.target) && !mostrarOpcionesButton.value?.contains(event.target);
  const clickedOutsideDias = !mostrarDiasMenu.value?.contains(event.target) && !mostrarDiasButton.value?.contains(event.target);

  if (clickedOutsideOpciones) {
    mostrarOpciones.value = false;
  }

  if (clickedOutsideDias) {
    mostrarDias.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});


const eliminarRutina = async (rutinaId) => {
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/trains/delete/${rutinaId}`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` }
    });

    rutinas.value = rutinas.value.filter((r) => r.id !== rutinaId);

    toast.success("Rutina eliminada con éxito");
  } catch (error) {
    console.error("Error al eliminar la rutina:", error);
  }
};

function seleccionarDia(index) {
  diaSeleccionado.value = semanaActual.value[index];
}

function cargarSemanas(dias) {
  const diasOrdenados = [...dias].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  const semanas = [];

  if (diasOrdenados.length === 0) return semanas;

  // Obtener el primer día de la semana (domingo) del primer entrenamiento
  const primerFecha = new Date(diasOrdenados[0].fecha);
  const primerDiaSemana = new Date(primerFecha);

  primerDiaSemana.setDate(primerFecha.getDate() - primerFecha.getDay()); // Ir al domingo

  let fechaCursor = new Date(primerDiaSemana);
  let indexDia = 0;

  while (indexDia < diasOrdenados.length) {
    const semanaActual = [];

    for (let i = 0; i < 7; i++) {
      const fechaDiaSemana = new Date(fechaCursor);
      fechaDiaSemana.setDate(fechaCursor.getDate() + i + 1);

      semanaActual.push({
        id: Math.random().toString(36).substring(2, 9),
        diaNumero: 0,
        grupoMuscular: "",
        ejercicios: [],
        fecha: new Date(fechaDiaSemana)
      });
    }

    // Reemplazar los días vacíos con días reales si coinciden por fecha
    for (let i = 0; i < 7 && indexDia < diasOrdenados.length; i++) {
      const fechaSemana = new Date(semanaActual[i].fecha).toISOString().split("T")[0];
      const fechaDiaReal = new Date(diasOrdenados[indexDia].fecha).toISOString().split("T")[0];

      if (fechaSemana === fechaDiaReal) {
        semanaActual[i] = diasOrdenados[indexDia];
        indexDia++;

        diaSeleccionado.value === null ? (diaSeleccionado.value = semanaActual[i]) : null;
      }
    }

    semanas.push(semanaActual);
    fechaCursor.setDate(fechaCursor.getDate() + 7);
  }

  return semanas;
}

function isSameWeek(date1, date2) {
  const startOfWeek = (d) => {
    const date = new Date(d);
    date.setDate(date.getDate() - date.getDay()); // ir al domingo
    date.setHours(0, 0, 0, 0);
    return date;
  };
  return startOfWeek(date1).getTime() === startOfWeek(date2).getTime();
}

function obtenerFechaDelDia(fecha) {
  if (!fecha) return "";

  const fechaDate = new Date(fecha);
  const opciones = { weekday: "long", day: "numeric", month: "long" };
  return fechaDate.toLocaleDateString("es-ES", opciones);
}

async function fetchPlan() {
  emit("loading-start");
  loading.value = true;
  error.value = "";

  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/trains/plan/${planId}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` }
      }
    );

    plan.value = res.data;
    plan.value.dias.forEach((dia) => {
      const fecha = new Date(dia.fecha);
      fecha.setHours(24, 0, 0, 0); // medianoche local
      dia.fecha = fecha; // guardamos como Date limpio
      dia.ejercicios.sort((a, b) => a.orden - b.orden);
    });

    semanas.value = cargarSemanas(plan.value.dias);

    semanaActual.value = semanas.value[semanaIndex.value];
    totalsemanas.value = semanas.value.length;

    layoutStore.setTitle("Mi rutina");
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

function irPagina(index) {
  semanaIndex.value = index;
  semanaActual.value = semanas.value[semanaIndex.value];
}

function siguientePagina() {
  if (semanaIndex.value < totalsemanas.value - 1) {
    irPagina(semanaIndex.value + 1);
  }
}

function anteriorPagina() {
  if (semanaIndex.value > 0) {
    irPagina(semanaIndex.value - 1);
  }
}

function siguienteDia() {
  const diaActual = diaSeleccionado.value.diaNumero;
  const siguienteDia = plan.value.dias.find((dia) => dia.diaNumero === diaActual + 1);

  if (siguienteDia) {
    diaSeleccionado.value = siguienteDia;
  }
}

function anteriorDia() {
  const diaActual = diaSeleccionado.value.diaNumero;
  const anteriorDia = plan.value.dias.find((dia) => dia.diaNumero === diaActual - 1);

  if (anteriorDia) {
    diaSeleccionado.value = anteriorDia;
  }
}

function ultimoDia() {
  const ultimoDia = plan.value.dias[plan.value.dias.length - 1];
  diaSeleccionado.value = ultimoDia;
}

function primerDia() {
  const primerDia = plan.value.dias[0];
  diaSeleccionado.value = primerDia;
}

function formatFecha(fecha) {
  if (!fecha) return "";
  const opciones = { day: "2-digit", month: "2-digit" };
  return new Intl.DateTimeFormat("es-ES", opciones).format(new Date(fecha));
}

function soloFecha(fecha) {
  return new Date(fecha).setHours(0, 0, 0, 0);
}

function abreviarDia(nombre) {
  if (!nombre || typeof nombre !== "string") return "";
  return nombre.slice(0, 3);
}

onMounted(() => {
  fetchPlan();
});

const exportarPDF = () => {
  const doc = new jsPDF();
  const margenIzquierdo = 15;
  const anchoPagina = doc.internal.pageSize.getWidth();
  const altoPagina = doc.internal.pageSize.getHeight();
  const totalPaginas = plan.value.dias.length > 0 ? Math.ceil(plan.value.dias.length / 20) : 1;

  let pagina = 1;
  let y = 48; // más abajo para dejar sitio a la cabecera

  const dibujarCabecera = () => {
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.addImage("/logov3.png", "PNG", 6, 6, 15, 15); // logo en esquina superior izquierda
    doc.text("Mi Plan de Entrenamiento", 22, 16);
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text(`Nombre: ${plan.value.nombre}`, 15, 29);
    doc.text(`Objetivo: ${capitalizar(plan.value.objetivo)}     Nivel: ${capitalizar(plan.value.nivel)}`, 15, 36);
  };

  const dibujarMarcaAgua = () => {
    doc.addImage("/logov1_transparente.png", "PNG", 30, 80, 150, 150);
  };

  const dibujarFooter = () => {
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Página ${pagina}`, anchoPagina - 30, altoPagina - 10);
  };

  dibujarCabecera();
  dibujarMarcaAgua();

  plan.value.dias.forEach((dia, i) => {
    if (y > altoPagina - 40) {
      dibujarFooter();
      doc.addPage();
      pagina++;
      y = 50;
      dibujarCabecera();
      dibujarMarcaAgua();
    }

    const fechaDia = obtenerFechaDelDia(dia.diaNumero);
    doc.setFont(undefined, "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(`${i + 1}. Día - ${capitalizar(fechaDia)}`, margenIzquierdo, y);
    y += 6;
    doc.setFont(undefined, "normal");

    if (!dia.ejercicios || dia.ejercicios.length === 0) {
      doc.text("  Día de descanso", margenIzquierdo + 5, y);
      y += 6;
    } else {
      dia.ejercicios.forEach((ejer) => {
        const texto = `  • ${ejer.ejercicio.nombre} - ${ejer.series}x${ejer.repeticiones} reps - ${ejer.peso}kg`;
        doc.text(texto, margenIzquierdo + 5, y);
        y += 6;
      });
    }

    y += 4;
  });

  dibujarFooter();
  doc.save(`${plan.value.nombre}.pdf`);
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
</style>
