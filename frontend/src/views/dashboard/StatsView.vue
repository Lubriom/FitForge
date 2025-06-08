<template>
  <div class="w-full h-full flex flex-col lg:grid grid-cols-5 grid-rows-auto gap-4">
    <!-- Peso -->
    <div class="col-span-3 col-start-1 row-span-2 row-start-1 w-full h-full">
      <div class="bg-white p-8 gap-4 flex rounded-2xl w-full h-full flex-col justify-between">
        <h1 class="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <Weight class="w-5 h-5 text-indigo-500" />
          Peso
        </h1>
        <div
          v-if="datosPeso.length > 0"
          class="bg-gray-200 p-2 rounded-2xl w-full h-full flex items-center justify-center"
        >
          <PesoChart :datosPeso="datosPeso" class="w-full items-center flex justify-center" />
        </div>
        <p v-else class="text-center text-sm text-gray-700">No tienes ningún registro sobre tu peso</p>
      </div>
    </div>

    <!-- Estadisticas 1 -->
    <div class="col-span-1 col-start-4 row-span-2 row-start-1 w-full h-full flex flex-col gap-4">
      <!-- DiasCompletados -->
      <div class="w-full h-full">
        <div class="text-white bg-primary-500 p-6 gap-2 flex rounded-2xl w-full h-full flex-col justify-center">
          <h1 class="text-2xl font-semibold flex items-center gap-2">
            <Calendar1 class="w-5 h-5 text-orange-500" />
            Has entrenado
          </h1>
          <div v-if="userEstadisticas" class="w-full items-center flex flex-col justify-center h-full group">
            <h2 class="text-2xl font-bold group-hover:text-3xl transition-all duration-300">
              {{ userEstadisticas.diasFinalizados }} dias
            </h2>
          </div>
          <p v-else class="text-center text-sm text-gray-200">No tienes ningun registro sobre tu IMC</p>
        </div>
      </div>

      <!-- Grupo Muscular mas entrenado -->
      <div class="w-full h-full">
        <div class="text-white bg-tertiary-500 p-6 gap-2 flex rounded-2xl w-full h-full flex-col justify-center">
          <h1 class="text-2xl font-semibold flex items-center gap-2">Grupo Muscular Favorito:</h1>
          <div v-if="userEstadisticas" class="w-full items-center flex flex-col justify-center h-full group">
            <h2 class="text-2xl font-bold group-hover:text-3xl group-hover:shadow-amber-50 transition-all duration-300">
              {{ userEstadisticas.grupoMuscularMasEntrenado ? capitalizar(userEstadisticas.grupoMuscularMasEntrenado) : "Sin registro" }}
            </h2>
          </div>
          <p v-else class="text-center text-sm text-gray-200">No tienes ningun registro sobre tus entrenamientos</p>
        </div>
      </div>

      <!-- Rutina mas entrenada -->
      <div class="w-full h-full">
        <div class="text-white bg-primary-500 p-6 gap-2 flex rounded-2xl w-full h-full flex-col justify-center">
          <h1 class="text-2xl font-semibold flex items-center gap-2">Rutina Favorita:</h1>
          <div v-if="userEstadisticas" class="w-full items-center flex flex-col justify-center h-full group">
            <h2 class="text-2xl font-bold group-hover:text-3xl transition-all duration-300">
              {{ userEstadisticas.rutinaMasCompletada ? capitalizar(userEstadisticas.rutinaMasCompletada) : "Sin registro" }}
            </h2>
          </div>
          <p v-else class="text-center text-sm text-gray-200">No tienes ningun registro sobre tus entrenamientos</p>
        </div>
      </div>
    </div>

    <!-- Datos -->
    <div class="col-start-5 row-span-2 w-full h-full">
      <div class="bg-white p-6 rounded-2xl w-full h-full shadow-md flex flex-col gap-3">
        <h2 class="text-xl font-semibold text-gray-800 gap-2 flex items-center">
          <Info class="w-6 h-6 text-blue-500" />
          Datos actuales
        </h2>

        <div class="flex flex-col gap-3 text-gray-700 h-full">
          <!-- RM -->
          <div
            class="group bg-gray-50 p-4 rounded-xl shadow-sm flex flex-col justify-center h-full transition-all duration-300 hover:bg-indigo-100"
          >
            <div class="flex justify-center items-center gap-2 mb-1">
              <BicepsFlexed class="w-5 h-5 text-indigo-500 transition-transform duration-300 group-hover:scale-110" />
              <p class="font-semibold text-sm sm:text-base">Fuerza (RM)</p>
            </div>
            <p class="text-lg sm:text-3xl text-center font-medium text-gray-900 group-hover:text-indigo-700">
              {{ datosRm.length > 0 && userInfo?.rm ? datosRm[datosRm.length - 1].rm : "N/A" }}
            </p>
          </div>

          <!-- Peso -->
          <div
            class="group bg-gray-50 p-4 rounded-xl shadow-sm flex flex-col justify-center h-full transition-all duration-300 hover:bg-green-100"
          >
            <div class="flex justify-center items-center gap-2 mb-1">
              <Weight class="w-5 h-5 text-green-500 transition-transform duration-300 group-hover:scale-110" />
              <p class="font-semibold text-sm sm:text-base">Peso</p>
            </div>
            <p class="text-lg sm:text-3xl text-center font-medium text-gray-900 group-hover:text-green-700">
              {{ datosPeso.length > 0 ? datosPeso[datosPeso.length - 1].peso + "kg" : "N/A" }}
            </p>
          </div>

          <!-- IMC -->
          <div
            class="group bg-gray-50 p-4 rounded-xl shadow-sm flex flex-col justify-center h-full transition-all duration-300 hover:bg-yellow-100"
          >
            <div class="flex justify-center items-center gap-2 mb-1">
              <Bone class="w-5 h-5 text-yellow-500 transition-transform duration-300 group-hover:scale-110" />
              <p class="font-semibold text-sm sm:text-base">IMC</p>
            </div>
            <p class="text-lg sm:text-3xl text-center font-medium text-gray-900 group-hover:text-yellow-700">
              {{ datosImc.length > 0 ? datosImc[datosImc.length - 1].imc : "N/A" }}
            </p>
            <p v-if="datosImc.length > 0" class="text-sm text-center text-gray-800">
              {{ getIMCCategory(datosImc[datosImc.length - 1].imc) }}
            </p>
          </div>

          <!-- Altura -->
          <div
            class="group bg-gray-50 p-4 rounded-xl shadow-sm flex flex-col justify-center h-full transition-all duration-300 hover:bg-purple-100"
          >
            <div class="flex justify-center items-center gap-2 mb-1">
              <Ruler class="w-5 h-5 text-purple-500 transition-transform duration-300 group-hover:scale-110" />
              <p class="font-semibold text-sm sm:text-base">Altura</p>
            </div>
            <p class="text-lg sm:text-3xl text-center font-medium text-gray-900 group-hover:text-purple-700">
              {{ userInfo?.altura ? userInfo.altura + "m" : "N/A" }}
            </p>
          </div>
        </div>

        <div
          v-if="!datosPeso.length && !datosRm.length && !datosImc.length && !userInfo?.altura"
          class="text-gray-500 italic text-center"
        >
          No se encontraron métricas registradas.
        </div>
      </div>
    </div>

    <!-- Dias entrenados -->
    <div class="col-span-3 col-start-1 row-start-3 w-full h-full">
      <div class="flex flex-col gap-4 w-full h-full justify-center bg-white rounded-2xl shadow-md p-4">
        <div class="flex flex-col gap-3">
          <h1 class="flex items-center font-semibold text-xl gap-2 px-3"><Calendar1 /> Últimos 7 días entrenados</h1>
          <div class="flex flex-row gap-2">
            <div
              v-for="dia in diasEntrenados7dias"
              :key="dia.fecha"
              :title="dia.fecha"
              class="flex-1 h-16 rounded-xl flex flex-col items-center justify-center text-white font-semibold cursor-default select-none"
              :class="dia.entrenado ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'"
            >
              <span>{{ formatFecha(dia.fecha, "EEE") }}</span>
              <small class="text-xs opacity-75">{{ formatFecha(dia.fecha, "dd/MM") }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- RM -->
    <div class="col-span-2 col-start-4 row-span-3 row-start-3 w-full h-full">
      <div class="bg-white p-8 gap-4 flex rounded-2xl w-full h-full flex-col justify-between">
        <h1 class="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <Weight class="w-5 h-5 text-indigo-500" />
          Fuerza (RM)
        </h1>
        <div
          v-if="datosRm.length > 0"
          class="bg-gray-200 p-2 rounded-2xl w-full h-full flex items-center justify-center"
        >
          <RmChart :datosRm="datosRm" class="w-full items-center flex justify-center" />
        </div>
        <p v-else class="text-center text-sm text-gray-700">No tienes ningún registro sobre tu RM</p>
      </div>
    </div>

    <div class="col-span-3 col-start-1 row-span-2 row-start-4 w-full h-full">
      <div class="bg-white p-8 gap-4 flex rounded-2xl w-full h-full flex-col justify-center">
        <router-link
          :to="{ name: 'DashboardRegStats' }"
          class="flex items-center gap-2 p-4 bg-tertiary-500 rounded-2xl hover:bg-orange-600 hover:scale-102 transition-all"
        >
          <p class="text-2xl font-semibold text-white">Registrar Información</p>
        </router-link>
        <p class="text-md text-gray-700">
          Registrar tu información nos permite darte un seguimiento más preciso de tus estadísticas. Solo necesitas
          actualizar tus progresos cada semana, y nosotros nos encargamos del resto.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "@/utils/Auth";
import axios from "axios";
import { useLayoutStore } from "@/stores/layoutStore";
import PesoChart from "@/components/basics/PesoChart.vue";
import RmChart from "@/components/basics/RmChart.vue";
import { BicepsFlexed, Bone, Calendar1, Database, Info, Ruler, Weight } from "lucide-vue-next";
import ImcChart from "../../components/basics/ImcChart.vue";
import { parseISO, format } from "date-fns";
import { es } from "date-fns/locale";

const emit = defineEmits(["loading-start", "loading-end"]);

const layoutStore = useLayoutStore();

const auth = useAuthStore();
const datosPeso = ref([]);
const datosImc = ref([]);
const datosRm = ref([]);
const userInfo = ref({});
const diasEntrenados7dias = ref([]);
const userEstadisticas = ref({});

onMounted(async () => {
  emit("loading-start");
  const token = auth.getToken();
  const id = auth.getId();

  try {
    const [responseMetricas, responseUserInfo, response7dias, responseEstadisticas] = await Promise.all([
      axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/users/get/metrics/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/users/get/${id}/info/last`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/trains/user/${id}/finish/days`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/users/get/${id}/estadisticas`, { headers: { Authorization: `Bearer ${token}` } })
    ]);

    responseMetricas.data.sort((a, b) => new Date(a.fechaRegistro) - new Date(b.fechaRegistro));
    datosPeso.value = responseMetricas.data.map((m) => ({
      fecha: new Date(m.fechaRegistro).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit"
      }),
      peso: m.peso
    }));
    datosImc.value = responseMetricas.data.map((m) => ({
      fecha: new Date(m.fechaRegistro).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }),
      imc: m.imc
    }));
    datosRm.value = responseMetricas.data.map((m) => ({
      fecha: new Date(m.fechaRegistro).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }),
      rm: m.rm ?? 0
    }));

    userInfo.value = responseUserInfo.data;
    diasEntrenados7dias.value = response7dias.data;
    userEstadisticas.value = responseEstadisticas.data;

    layoutStore.setTitle("Mis estadisticas");
  } catch (error) {
    console.error("Error al cargar los datos del usuario:", error);
  } finally {
    emit("loading-end");
  }
});

function getIMCCategory(imc) {
  if (imc < 16) return "Delgadez severa";
  if (imc < 17) return "Delgadez moderada";
  if (imc < 18.5) return "Delgadez leve";
  if (imc < 25) return "Composición normal";
  if (imc < 30) return "Sobrepeso";
  if (imc < 35) return "Obesidad clase 1";
  if (imc < 40) return "Obesidad clase 2";
  return "Obesidad clase 3";
}

const capitalizar = (texto) => {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

function formatFecha2(fecha) {
  if (!fecha) return "";
  const opciones = { day: "2-digit", month: "2-digit" };
  return new Intl.DateTimeFormat("es-ES", opciones).format(new Date(fecha));
}

function formatFecha(fechaStr, formato) {
  const date = parseISO(fechaStr);
  return format(date, formato, { locale: es });
}
</script>
