<template>
  <div
    class="flex flex-col sm:grid md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[200px_200px_1fr] xl:grid-cols-5 xl:grid-rows-5 gap-4 w-full overflow-y-auto xl:h-full h-fit"
  >
    <!-- Dias entrenados -->
    <div class="row-span-1 xl:row-span-2 col-span-1 col-start-1 row-start-1 w-full h-full">
      <div
        v-if="diasEntrenados && diasEntrenados.length > 0"
        class="bg-tertiary-500 p-6 rounded-2xl w-full h-full shadow-lg flex flex-col justify-between text-white"
      >
        <div class="flex flex-col gap-2">
          <h2 class="text-lg font-semibold flex items-center gap-2">
            <Calendar1 class="w-5 h-5 text-green-300" />
            Días entrenados
          </h2>
          <p class="text-4xl font-bold text-white">{{ diasEntrenados.length }}</p>
          <p v-if="mensajesMotivadores" class="text-lg text-gray-100">{{ mensajesMotivadores }}</p>
        </div>
      </div>

      <div
        v-else
        class="bg-gray-200/70 p-6 rounded-2xl w-full h-full shadow-inner flex items-center justify-center text-gray-700"
      >
        <p class="text-center text-sm">{{ mensajesMotivadores }}</p>
      </div>
    </div>

    <!-- Playlist -->
    <div
      class="row-span-1 xl:row-span-2 col-span-1 col-start-1 lg:col-start-2 xl:col-start-2 row-start-2 lg:row-start-1 xl:row-start-1 w-full h-full"
    >
      <div class="bg-white p-4.5 rounded-2xl w-full h-full shadow-md flex flex-col gap-3 justify-around">
        <h1 class="text-xl font-semibold flex items-center gap-2 text-green-400"><AudioLines /> Musica</h1>
        <h2 class="text-xl xl:text-2xl font-semibold text-center gap-2">¡Potencia de hoy!</h2>
        <iframe
          width="100%"
          height="80px"
          :src="todayPlaylist.url"
          frameborder="0"
          allowtransparency="true"
          allow="encrypted-media"
          loading="lazy"
          class="rounded-xl"
        ></iframe>
      </div>
    </div>

    <!-- Datos físicos -->
    <div
      class="row-span-1 xl:row-span-2 col-span-2 xl:col-span-2 col-start-1 row-start-3 lg:row-start-2 xl:row-start-3 w-full h-full"
    >
      <div class="bg-white p-6 rounded-2xl w-full h-full shadow-md flex flex-col gap-3">
        <h2 class="text-xl font-semibold text-gray-800 gap-2 flex items-center">
          <Info class="w-6 h-6 text-blue-500" />
          Datos físicos del usuario
        </h2>

        <div v-if="userInfo" class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-gray-700 h-full">
          <!-- ALTURA -->
          <div
            class="group bg-gray-50 p-4 rounded-xl shadow-sm flex flex-col justify-center h-full transition-all duration-300 hover:bg-indigo-100"
          >
            <div class="flex justify-center items-center gap-2 mb-1">
              <Ruler class="w-5 h-5 text-indigo-500 transition-transform duration-300 group-hover:scale-110" />
              <p class="font-semibold text-sm sm:text-base">Altura</p>
            </div>
            <p class="text-2xl xl:text-3xl text-center font-medium text-gray-900 group-hover:text-indigo-700">
              {{ userInfo.altura }} cm
            </p>
          </div>

          <!-- PESO -->
          <div
            class="group bg-gray-50 p-4 rounded-xl shadow-sm flex flex-col justify-center h-full transition-all duration-300 hover:bg-green-100"
          >
            <div class="flex justify-center items-center gap-2 mb-1">
              <Weight class="w-5 h-5 text-green-500 transition-transform duration-300 group-hover:scale-110" />
              <p class="font-semibold text-sm sm:text-base">Peso</p>
            </div>
            <p class="text-2xl xl:text-3xl text-center font-medium text-gray-900 group-hover:text-green-700">
              {{ userInfo.peso }} kg
            </p>
          </div>

          <!-- GÉNERO -->
          <div
            class="group bg-gray-50 p-4 rounded-xl shadow-sm flex flex-col justify-center h-full transition-all duration-300 hover:bg-pink-100"
          >
            <div class="flex justify-center items-center gap-2 mb-1">
              <Dna class="w-5 h-5 text-pink-400 transition-transform duration-300 group-hover:scale-110" />
              <p class="font-semibold text-sm sm:text-base">Género</p>
            </div>
            <p class="text-2xl xl:text-3xl text-center font-medium text-gray-900 capitalize group-hover:text-pink-600">
              {{ user.genero }}
            </p>
          </div>
        </div>

        <div v-else class="text-gray-500 italic">No se encontraron datos físicos.</div>
      </div>
    </div>

    <!-- Entrenamiento diario -->
    <div
      class="row-span-1 xl:col-span-2 col-span-2 lg:col-span-4 col-start-1 row-start-4 lg:row-start-3 xl:row-start-5 w-full h-full"
    >
      <div
        v-if="rutinaActual && rutinaActual.diaActual"
        class="bg-primary-500 p-6 rounded-2xl w-full h-full shadow-lg flex flex-col justify-between text-white"
      >
        <!-- Si ya finalizó -->
        <div v-if="rutinaActual.diaActual.finalizado === true" class="flex items-center justify-center h-full">
          <p class="text-2xl font-semibold flex gap-3">
            <CheckCircle class="w-8 h-8 text-green-400" /> Rutina finalizada hoy
          </p>
        </div>

        <div v-else-if="rutinaActual.diaActual.ejercicios.length === 0" class="flex items-center justify-center h-full">
          <p class="text-xl font-semibold flex gap-3 items-center">
            <CheckCircle class="w-8 h-8 text-orange-400" /> No hay ejercicios asignados este dia, descansa por hoy
          </p>
        </div>
        <!-- Si aún no entrenó -->
        <div v-else class="flex flex-row justify-between items-center w-full">
          <div class="flex flex-col gap-1">
            <h2 class="text-xl font-semibold flex items-center gap-2">
              <Clock class="w-6 h-6 text-white" />
              Aún no has entrenado hoy
            </h2>
            <div class="flex gap-2 text-gray-300">
              <p class="text-sm">
                <span class="font-semibold">Fecha:</span> {{ formatFecha(rutinaActual.diaActual.fecha) }}
              </p>
              <p class="text-sm">
                <span class="font-semibold">Grupo muscular:</span>
                {{ capitalizar(rutinaActual.diaActual.grupoMuscular) }}
              </p>
            </div>
          </div>

          <!-- Checkbox para marcar entrenamiento -->
          <div class="flex items-center">
            <label class="flex items-center gap-2 text-sm text-white cursor-pointer">
              <input
                type="checkbox"
                @change="marcarDiaComoCompletado"
                class="appearance-none h-5 w-5 bg-white checked:bg-green-500 checked:border-transparent border-2 border-white hover:border-tertiary-500 rounded-md transition-all duration-200"
              />
              Marcar como completado
            </label>
          </div>
        </div>
      </div>
      <div
        v-else
        class="bg-primary-500 p-6 rounded-2xl w-full h-full shadow-lg flex flex-col justify-center text-white"
      >
        No tienes nada que entrenar hoy
      </div>
    </div>

    <!-- IMC panel con SVG -->
    <div
      class="lg:col-span-2 xl:col-span-1 xl:row-span-4 row-span-2 col-start-2 lg:col-start-3 xl:col-start-5 row-start-1"
    >
      <div
        class="bg-quaternary-500 text-white p-4 sm:p-4 rounded-2xl w-full h-full flex flex-col relative gap-4 min-w-0 overflow-hidden"
        :class="userInfo && userInfo.imc ? 'grid-rows-[auto_1fr_auto]' : 'grid-rows-[1fr_auto]'"
      >
        <!-- Si hay IMC -->
        <div v-if="userInfo && userInfo.imc" class="flex flex-col justify-between h-full">
          <!-- Texto IMC y categoría -->
          <div>
            <h1 class="font-bold mb-2 break-words">
              Tu IMC: <span class="text-gray-200">{{ userInfo.imc }}</span>
            </h1>
            <p class="text-sm text-gray-200 mb-4 break-words">
              {{ getIMCCategory(userInfo.imc) }}
            </p>
          </div>

          <!-- SVG con color -->
          <div class="relative aspect-[6/7] w-[min(80vw,15rem)] max-w-full mx-auto flex justify-center">
            <div
              class="absolute inset-0 z-0"
              :style="{
                backgroundColor: '#000',
                WebkitMaskImage: `url(${svgImc})`,
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskSize: 'contain',
                WebkitMaskPosition: 'center',
                maskImage: `url(${svgImc})`,
                maskRepeat: 'no-repeat',
                maskSize: 'contain',
                maskPosition: 'center',
                filter: 'blur(2px)'
              }"
            ></div>
            <div
              class="absolute inset-0 z-10"
              :style="{
                backgroundColor: getIMCColor(userInfo.imc),
                WebkitMaskImage: `url(${svgImc})`,
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskSize: 'contain',
                WebkitMaskPosition: 'center',
                maskImage: `url(${svgImc})`,
                maskRepeat: 'no-repeat',
                maskSize: 'contain',
                maskPosition: 'center'
              }"
            ></div>
          </div>

          <!-- Barra de progreso -->
          <div class="flex flex-col">
            <div class="relative w-full h-4 bg-gray-300 rounded-full overflow-hidden max-w-full">
              <div
                class="top-0 left-0 h-full"
                :style="{
                  width: getIMCPercentage(userInfo.imc) + '%',
                  backgroundColor: getIMCColor(userInfo.imc)
                }"
              ></div>
              <div
                class="absolute top-0 left-[calc(var(--percent)*1%)] w-[2px] h-full bg-black"
                :style="{ '--percent': getIMCPercentage(userInfo.imc) }"
              ></div>
            </div>

            <div class="text-xs text-gray-200 mt-2 flex justify-between">
              <span>Bajo</span>
              <span>Normal</span>
              <span>Alto</span>
            </div>
          </div>
        </div>

        <!-- Estado cuando no hay IMC -->
        <div v-else class="flex flex-col justify-center items-center h-full">
          <div class="place-self-center min-w-0 max-w-full">
            <div class="relative w-40 aspect-[6/7] max-w-full">
              <div
                class="absolute inset-0 z-10 bg-gray-400/50"
                :style="{
                  WebkitMaskImage: `url(${svgImc})`,
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskSize: 'contain',
                  WebkitMaskPosition: 'center',
                  maskImage: `url(${svgImc})`,
                  maskRepeat: 'no-repeat',
                  maskSize: 'contain',
                  maskPosition: 'center'
                }"
              ></div>
            </div>
          </div>
          <div class="self-center text-center text-sm text-gray-200 break-words">
            <p class="mb-1">Aún no se ha registrado tu índice de masa corporal.</p>
            <p class="text-xs text-gray-300">Puedes actualizar tus datos físicos desde el panel de estadísticas.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Rutina Actual -->
    <div
      class="col-span-2 xl:col-span-2 xl:row-span-2 row-span-1 lg:row-start-4 xl:row-start-4 col-start-1 xl:col-start-3 w-full h-full"
    >
      <div
        v-if="rutinaActual"
        class="bg-tertiary-500 p-4 rounded-2xl w-full h-full flex flex-col gap-3 shadow-xl text-white"
      >
        <h2 class="text-2xl font-semibold flex items-center gap-3">
          <LandPlot class="w-6 h-6 text-white" />
          Rutina Actual
        </h2>

        <router-link
          :key="rutinaActual.id"
          :to="{ name: 'ExercisesTrainInfo', params: { id: rutinaActual.id ?? 1 } }"
          class="bg-white px-5 py-2 rounded-2xl w-full shadow-md hover:bg-gray-100 transition-all duration-300 text-black font-semibold flex flex-col justify-between h-full space-y-4"
        >
          <div class="flex flex-col gap-1">
            <p class="text-xl font-bold">{{ rutinaActual.nombre }}</p>
            <p class="text-sm text-gray-700">{{ rutinaActual.descripcion }}</p>
          </div>

          <div class="flex flex-row justify-between text-sm text-gray-800">
            <div>
              <p><span class="font-semibold">Nivel:</span> {{ capitalizar(rutinaActual.nivel) }}</p>
              <p><span class="font-semibold">Objetivo:</span> {{ capitalizar(rutinaActual.objetivo) }}</p>
            </div>
            <div v-if="rutinaActual.diaActual" class="text-right">
              <p><span class="font-semibold">Hoy:</span> {{ formatFecha(rutinaActual.diaActual.fecha) }}</p>
              <p><span class="font-semibold">Toca:</span> {{ capitalizar(rutinaActual.diaActual.grupoMuscular) }}</p>
            </div>
          </div>
        </router-link>
      </div>

      <button v-else class="w-full h-full cursor-pointer">
        <div class="bg-gray-300/80 p-6 rounded-2xl w-full h-full flex flex-col justify-center items-center text-center">
          <h2 class="text-lg text-black font-bold mb-2">Aún no tienes una rutina</h2>
          <p class="text-sm text-gray-700">¿Deseas crear una?</p>
        </div>
      </button>
    </div>

    <!-- Peso -->
    <div
      class="col-span-2 xl:col-span-2 row-span-2 xl:row-span-3 col-start-1 lg:col-start-3 xl:col-start-3 row-start-6 lg:row-start-4 xl:row-start-1 gap-2 flex bg-white rounded-2xl flex-col p-5 h-full"
    >
      <h1 class="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <Weight class="w-5 h-5 text-indigo-500" />

        Peso
      </h1>
      <div class="bg-gray-200 p-2 rounded-2xl w-full h-full flex items-center justify-center">
        <PesoChart
          :datosPeso="datosPeso"
          v-if="datosPeso.length > 0"
          class="w-full h-full items-center flex justify-center"
        />
        <p v-else class="text-center text-sm text-gray-700">No tienes ningún registro sobre tu peso</p>
      </div>
    </div>

    <!-- Ver rutinas -->
    <div
      class="col-start-1 col-span-2 hidden lg:flex xl:col-span-1 xl:col-start-5 xl:row-start-5 row-start-5 w-full h-full"
    >
      <div class="bg-white p-6 rounded-2xl shadow-md h-full w-full">
        <router-link
          :to="{ name: 'ExercisesTrain' }"
          class="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 transition-all duration-300 p-3 rounded-2xl h-full"
        >
          <h2 class="flex gap-2 font-semibold text-xl items-center"><Waypoints class="w-7 h-7" /> Ver rutinas</h2>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { useAuthStore } from "@/utils/Auth.js";
import { onMounted, ref, defineAsyncComponent, markRaw, computed } from "vue";
import { useLayoutStore } from "@/stores/layoutStore";
import PesoChart from "@/components/basics/PesoChart.vue";
import maleSvg from "@/assets/svg/male.svg";
import femaleSvg from "@/assets/svg/female.svg";
import {
  AudioLines,
  Calendar1,
  CheckCircle,
  CircleUserRound,
  Clock,
  Dna,
  Info,
  LandPlot,
  Ruler,
  User,
  Waypoints,
  Weight
} from "lucide-vue-next";

const emit = defineEmits(["loading-start", "loading-end"]);

const auth = useAuthStore();
const layoutStore = useLayoutStore();
layoutStore.setTitle("Bienvenido, " + auth.getName() + " !");

const user = ref({});
const userInfo = ref({});
const userPato = ref([]);
const userRutinas = ref([]);
const rutinaActual = ref({});
const diasEntrenados = ref([]);
const datosPeso = ref([]);

const baseURL = "http://localhost:8081";
const svgImc = ref("");
const imageURL = ref("");

onMounted(async () => {
  emit("loading-start");
  const userId = auth.getId();
  const token = auth.getToken();

  imageURL.value = `http://localhost:8081/pfp/${auth.getImage()}`;

  try {
    const [response, responseInfo, responsePato, responseRutinas, responseDias, responseMetricas] = await Promise.all([
      axios.get(`http://localhost:8081/users/get/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`http://localhost:8081/users/get/${userId}/info/last`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`http://localhost:8081/users/get/${userId}/patologias`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`http://localhost:8081/trains/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`http://localhost:8081/trains/user/${userId}/days`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`http://localhost:8081/users/get/metrics/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]);

    user.value = response.data;
    userInfo.value = responseInfo.data;
    userPato.value = responsePato.data;
    userRutinas.value = responseRutinas.data;
    rutinaActual.value = userRutinas.value.find((rutina) => rutina.activo === true) || null;
    diasEntrenados.value = responseDias.data;
    responseMetricas.data.sort((a, b) => new Date(a.fechaRegistro) - new Date(b.fechaRegistro));
    datosPeso.value = responseMetricas.data.map((m) => ({
      fecha: new Date(m.fechaRegistro).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit"
      }),
      peso: m.peso
    }));

    let diaActual = null;

    if (rutinaActual.value?.dias) {
      const hoy = new Date().toISOString().split("T")[0]; // "2025-06-01"

      diaActual = rutinaActual.value.dias.find((dia) => {
        const fechaDia = new Date(dia.fecha).toISOString().split("T")[0]; // formatea también
        return fechaDia === hoy;
      });

      if (diaActual) {
        rutinaActual.value.diaActual = diaActual;
      }
    } else {
      console.warn("rutinaActual no tiene 'dias'");
    }

    svgImc.value = user.genero === "Hombre" ? maleSvg : femaleSvg;
  } catch (error) {
    console.error("Error al cargar los datos:", error);
  } finally {
    emit("loading-end");
  }
});

const marcarDiaComoCompletado = async () => {
  const token = auth.getToken();

  try {
    await axios.patch(
      `http://localhost:8081/trains/day/${rutinaActual.value.diaActual.id}/finalizar`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const responseDias = await axios.get(`http://localhost:8081/trains/user/${auth.getId()}/days`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    diasEntrenados.value = responseDias.data;

    // Actualizar el estado local
    rutinaActual.value.diaActual.finalizado = true;
  } catch (error) {
    console.error("Error al marcar como completado:", error);
  }
};

function getIMCColor(imc) {
  if (imc < 16) return "#9f1239"; // Delgadez severa
  if (imc < 17) return "#be123c"; // Delgadez moderada
  if (imc < 18.5) return "#f43f5e"; // Delgadez leve
  if (imc < 25) return "#22c55e"; // Normal
  if (imc < 30) return "#eab308"; // Sobrepeso
  if (imc < 35) return "#f97316"; // Obesidad clase 1
  if (imc < 40) return "#ea580c"; // Obesidad clase 2
  return "#991b1b"; // Obesidad clase 3
}

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

function getIMCPercentage(imc) {
  const min = 10; // valor arbitrario bajo
  const max = 45; // valor alto para obesidad clase 3
  const clamped = Math.min(Math.max(imc, min), max);
  return ((clamped - min) / (max - min)) * 100;
}

const playlists = {
  0: {
    name: "Domingo Chill",
    url: "https://open.spotify.com/embed/playlist/37i9dQZF1DX3PIPIT6lEg5"
  },
  1: {
    name: "Motivation Monday",
    url: "https://open.spotify.com/embed/playlist/37i9dQZF1DXdxcBWuJkbcy"
  },
  2: { name: "Power Tuesday", url: "https://open.spotify.com/embed/playlist/37i9dQZF1DWZjqjZMudx9T" },
  3: { name: "Hardcore Wednesday", url: "https://open.spotify.com/embed/playlist/37i9dQZF1DWUVpAXiEPK8P" },
  4: { name: "Throwback Thursday", url: "https://open.spotify.com/embed/playlist/37i9dQZF1DX4UtSsGT1Sbe" },
  5: { name: "Beast Mode Friday", url: "https://open.spotify.com/embed/playlist/37i9dQZF1DWUVpAXiEPK8P" },
  6: { name: "Super Pump Saturday", url: "https://open.spotify.com/embed/playlist/37i9dQZF1DX76Wlfdnj7AP" }
};
const day = new Date().getDay();
const todayPlaylist = playlists[day];

const mensajesMotivadores = computed(() => {
  const dias = diasEntrenados.value?.length || 0;

  if (dias === 0) return "Aún no hay días registrados como completados. ¡Vamos, comienza hoy!";

  if (dias < 10) return "¡Buen inicio! Sigue así y lograrás tus objetivos.";

  if (dias < 25) return "¡Excelente! Ya llevas un buen ritmo.";

  if (dias < 50) return "¡Impresionante! Tu constancia es admirable.";

  return "¡Eres un campeón! No pares ahora.";
});

const capitalizar = (texto) => {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

function formatFecha(fecha) {
  if (!fecha) return "";
  const opciones = { day: "2-digit", month: "2-digit" };
  return new Intl.DateTimeFormat("es-ES", opciones).format(new Date(fecha));
}
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
</style>
