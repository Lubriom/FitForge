<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "@/utils/auth";
import { useLayoutStore } from "@/stores/layoutStore";
import { useRouter, useRoute } from "vue-router";
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, FileDown, SquarePen } from "lucide-vue-next";

const router = useRouter();
const route = useRoute();

const layoutStore = useLayoutStore();
const auth = useAuthStore();

const plan = ref(null);
const planId = route.params.id;
const loading = ref(true);
const error = ref("");

const semanaActual = ref(0);
const diaSeleccionadoIndex = ref(0);

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const diasSemanaActual = ref([]);
const diaSeleccionado = ref(null);

const DIAS_POR_SEMANA = 7; // lunes a sábado

function obtenerLunes(fecha) {
  const dia = fecha.getDay(); // 0=domingo, 1=lunes, ...
  const diasASustraer = dia === 0 ? 6 : dia - 1; // si domingo, restar 6 días para lunes previo
  const lunes = new Date(fecha);
  lunes.setDate(fecha.getDate() - diasASustraer);
  lunes.setHours(0, 0, 0, 0);
  return lunes;
}

function getDiasSemanaActual() {
  if (!plan.value) return [];

  const fechaInicio = new Date(plan.value.fechaInicio);
  const lunesBase = obtenerLunes(fechaInicio);
  const lunesSemanaActual = new Date(lunesBase);
  lunesSemanaActual.setDate(lunesBase.getDate() + semanaActual.value * DIAS_POR_SEMANA);

  const diasCompletos = [];

  for (let i = 0; i < DIAS_POR_SEMANA; i++) {
    const diaPlan = plan.value.dias[semanaActual.value * DIAS_POR_SEMANA + i] || {
      diaNumero: semanaActual.value * DIAS_POR_SEMANA + i,
      ejercicios: []
    };

    const fechaDelDia = new Date(lunesSemanaActual);
    fechaDelDia.setDate(lunesSemanaActual.getDate() + i);

    diasCompletos.push({
      ...diaPlan,
      fecha: fechaDelDia,
      diaNumero: semanaActual.value * DIAS_POR_SEMANA + i
    });
  }

  return diasCompletos;
}

function seleccionarDia(index) {
  diaSeleccionadoIndex.value = index;
  diaSeleccionado.value = diasSemanaActual.value[index];
}

function cambiarSemana(deltaOrCommand) {
  if (!plan.value) return;

  const totalSemanas = Math.ceil(plan.value.dias.length / DIAS_POR_SEMANA);

  if (deltaOrCommand === "first") {
    semanaActual.value = 0;
  } else if (deltaOrCommand === "last") {
    semanaActual.value = totalSemanas - 1;
  } else {
    const nuevaSemana = semanaActual.value + deltaOrCommand;
    if (nuevaSemana >= 0 && nuevaSemana < totalSemanas) {
      semanaActual.value = nuevaSemana;
    }
  }

  cargarSemana();
}

function cargarSemana() {
  diasSemanaActual.value = getDiasSemanaActual();
  seleccionarDia(0); // siempre seleccionamos el lunes (índice 0)
}

function diaEsAnteriorAlInicio(dia) {
  if (!plan.value) return true;

  const fechaInicio = new Date(plan.value.fechaInicio);
  let fechaDelDia;

  if (typeof dia === "object" && dia.fecha) {
    fechaDelDia = dia.fecha;
  } else if (typeof dia === "number") {
    fechaDelDia = new Date(fechaInicio);
    fechaDelDia.setDate(fechaInicio.getDate() + dia);
  } else {
    return true;
  }

  const inicioSinHora = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate());
  const diaSinHora = new Date(fechaDelDia.getFullYear(), fechaDelDia.getMonth(), fechaDelDia.getDate());

  return diaSinHora < inicioSinHora;
}

function obtenerFechaDelDia(diaNumero) {
  if (!plan.value) return "";

  const fechaInicio = new Date(plan.value.fechaInicio);
  const fechaDelDia = new Date(fechaInicio);
  fechaDelDia.setDate(fechaInicio.getDate() + diaNumero);

  const opciones = { weekday: "long", day: "numeric", month: "long" };
  return fechaDelDia.toLocaleDateString("es-ES", opciones);
}

function getFechaSemana() {
  if (!plan.value) return "";

  const fechaInicio = new Date(plan.value.fechaInicio);
  const inicio = new Date(fechaInicio);
  inicio.setDate(fechaInicio.getDate() + semanaActual.value * DIAS_POR_SEMANA);

  const fin = new Date(inicio);
  fin.setDate(inicio.getDate() + DIAS_POR_SEMANA - 1);

  const opciones = { day: "numeric", month: "long" };
  const formato = new Intl.DateTimeFormat("es-ES", opciones);

  return `del ${formato.format(inicio)} al ${formato.format(fin)}`;
}

async function fetchPlan() {
  loading.value = true;
  error.value = "";

  try {
    const res = await axios.get(`http://localhost:8081/trains/plan/${planId}`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` }
    });

    plan.value = res.data;

    // Eliminada la lógica para seleccionar el día actual según la fecha de hoy
    semanaActual.value = 0; // Siempre iniciamos en la semana 0
    cargarSemana();
    console.log(plan.value);
    layoutStore.setTitle("Rutina: " + plan.value.nombre);
  } catch (err) {
    error.value = "Error cargando el plan";
    console.error(err);
  } finally {
    loading.value = false;
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

onMounted(() => {
  fetchPlan();
});
</script>

<template>
  <div class="w-full h-full">
    <div v-if="loading" class="text-center text-gray-500">Cargando plan...</div>
    <div v-if="error" class="text-center text-red-600">{{ error }}</div>

    <div v-if="plan" class="flex flex-col bg-white shadow rounded-lg p-5 gap-3 h-full">
      <!-- Info general -->
      <div class="gap-2 flex flex-col">
        <div class="flex flex-row w-full justify-between items-center">
          <h2 class="text-xl font-semibold">
            <b>{{ plan.nombre }}</b>
          </h2>
          <div class="flex flex-row gap-2">
            <button
              class="text-md text-white bg-tertiary-500 hover:bg-orange-700 rounded-md p-2 cursor-pointer flex gap-1 items-center"
            >
              Exportar PDF <FileDown />
            </button>
            <router-link
              :to="{ name: 'Dashboard' }"
              class="text-md text-white bg-tertiary-500 hover:bg-orange-700 rounded-md p-2 cursor-pointer flex gap-1 items-center"
              >Editar <SquarePen
            /></router-link>
          </div>
        </div>
        <div class="flex flex-row justify-between">
          <p class="text-gray-700"><b>Descripcion: </b>{{ plan.descripcion }}</p>
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

      <!-- Navegación entre semanas -->
      <div class="flex justify-between items-center">
        <div class="flex flex-row gap-2">
          <button
            @click="cambiarSemana('first')"
            class="flex gap-1 px-3 py-1 rounded-lg bg-tertiary-500 hover:bg-orange-600 text-sm text-white cursor-pointer"
            :disabled="semanaActual === 0"
          >
            <ChevronFirst />
          </button>
          <button
            @click="cambiarSemana(-1)"
            class="flex gap-1 px-3 py-1 rounded-lg items-center bg-tertiary-500 hover:bg-orange-600 text-sm text-white cursor-pointer"
            :disabled="semanaActual === 0"
          >
            <ChevronLeft /> Semana anterior
          </button>
        </div>
        <span class="text-md font-medium text-black"> Semana {{ semanaActual + 1 }} {{ getFechaSemana() }} </span>
        <div class="flex flex-row gap-2">
          <button
            @click="cambiarSemana(1)"
            class="flex gap-1 px-3 py-1 rounded-lg items-center justify-center bg-tertiary-500 hover:bg-orange-600 text-sm text-white cursor-pointer"
            :disabled="(semanaActual + 1) * 7 >= plan.dias.length"
          >
            Semana siguiente <ChevronRight />
          </button>
          <button
            @click="cambiarSemana('last')"
            class="flex gap-1 px-3 py-1 rounded-lg bg-tertiary-500 hover:bg-orange-600 text-sm text-white cursor-pointer"
            :disabled="(semanaActual + 1) * 7 >= plan.dias.length"
          >
            <ChevronLast />
          </button>
        </div>
      </div>

      <!-- Días de la semana -->
      <div class="flex overflow-x-auto w-full justify-stretch gap-2">
        <button
          v-for="(nombre, index) in diasSemana"
          :key="index"
          @click="!diaEsAnteriorAlInicio(diasSemanaActual[index]) && seleccionarDia(index)"
          :disabled="diaEsAnteriorAlInicio(diasSemanaActual[index])"
          :class="[
            'w-full px-4 py-2 rounded-md font-medium whitespace-nowrap',
            diaEsAnteriorAlInicio(diasSemanaActual[index])
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : diaSeleccionadoIndex === index
              ? 'flex bg-tertiary-500 hover:bg-orange-600 text-white justify-center items-center'
              : 'bg-gray-100 hover:bg-gray-200 flex justify-center items-center'
          ]"
        >
          <div class="flex flex-col items-center">
            <p>{{ nombre }}</p>
            <span class="text-xs text-gray-600">{{ formatFecha(diasSemanaActual[index]?.fecha) }}</span>
          </div>
        </button>
      </div>

      <!-- Contenido del día -->
      <div class="bg-gray-50 p-4 rounded-lg shadow-inner flex flex-col overflow-y-auto max-h-full gap-2">
        <template v-if="diaSeleccionado.ejercicios.length">
          <h3 class="text-lg font-semibold px-2">
            {{ obtenerFechaDelDia(diaSeleccionado.diaNumero) }} -
            {{ diaSeleccionado.grupoMuscular || "Sin grupo muscular" }}
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

        <template v-else-if="diaEsAnteriorAlInicio(diaSeleccionado.diaNumero)">
          <p class="text-center text-gray-500 text-lg">Tu plan aún no había comenzado este día 🕓</p>
        </template>
        <template v-else>
          <p class="text-center text-gray-600 text-lg">Este día puedes descansar 😌</p>
        </template>
      </div>
    </div>
  </div>
</template>

<style>
/* Tailwind incluido globalmente */
</style>
