<template>
  <div class="flex flex-col gap-6 h-full">
    <div class="bg-gray-100 p-4 rounded-2xl h-full w-full flex flex-row gap-4">
      <div class="flex flex-col gap-6 h-full w-1/3 justify-around">
        <!-- Imagen de perfil y nombre -->
        <div class="flex flex-col items-center gap-4">
          <div class="relative w-64 h-64 rounded-full border-4 border-tertiary-500 overflow-hidden bg-white shadow-md">
            <img :src="imageURL" alt="Foto de perfil" class="w-full h-full object-cover" />
          </div>
          <p class="font-bold text-xl text-center text-gray-800">
            {{ user.nombre }}
          </p>
        </div>

        <!-- Datos del usuario -->
        <div class="bg-white rounded-2xl shadow-lg w-full px-4 py-6">
          <ul class="flex flex-col gap-4 text-black text-md">
            <!-- Correo -->
            <li class="flex items-center gap-2">
              <span class="text-primary-600"><Mail /></span>
              <span>{{ user.correo }}</span>
            </li>

            <!-- Género -->
            <li v-if="user.genero === 'Hombre'" class="flex items-center gap-2">
              <span class="text-blue-500"><Mars /></span>
              <span>{{ user.genero }}</span>
            </li>
            <li v-else-if="user.genero === 'Mujer'" class="flex items-center gap-2">
              <span class="text-pink-500"><Venus /></span>
              <span>{{ user.genero }}</span>
            </li>

            <!-- Fecha de nacimiento -->
            <li class="flex items-center gap-2">
              <span class="text-purple-500"><Cake /></span>
              <span>
                {{
                  new Date(user.fec_nac).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })
                }}
              </span>
            </li>

            <li class="border-t border-gray-300 pt-4 flex items-center gap-2">
              <span class="font-semibold text-gray-600">Se unió el:</span>
              <span>
                {{
                  new Date(user.created_at).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })
                }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-1 border-gray-500/10" />

      <!-- Información del usuario -->
      <div class="grid grid-cols-3 grid-rows-5 gap-4 h-full w-full">
        <!-- Datos fisicos -->
        <div class="col-span-2 row-span-2">
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
                <p class="text-lg sm:text-3xl text-center font-medium text-gray-900 group-hover:text-indigo-700">
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
                <p class="text-lg sm:text-3xl text-center font-medium text-gray-900 group-hover:text-green-700">
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
                <p
                  class="text-lg sm:text-3xl text-center font-medium text-gray-900 capitalize group-hover:text-pink-600"
                >
                  {{ user.genero }}
                </p>
              </div>
            </div>

            <div v-else class="text-gray-500 italic">No se encontraron datos físicos.</div>
          </div>
        </div>

        <!-- IMC -->
        <div class="row-span-5 col-start-3">
          <!-- IMC panel con SVG -->

          <div
            class="bg-quaternary-500 text-white p-4 rounded-2xl w-full h-full flex-col flex relative justify-between"
          >
            <div v-if="userInfo && userInfo.imc">
              <!-- Texto IMC y categoría -->
              <div>
                <h1 class="font-bold mb-2">
                  Tu IMC: <span class="text-gray-200">{{ userInfo.imc }}</span>
                </h1>
                <p class="text-sm text-gray-200 mb-4">
                  {{ getIMCCategory(userInfo.imc) }}
                </p>
              </div>

              <!-- SVG con color -->
              <div class="relative w-full aspect-[6/7] mb-4">
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
              <div class="relative w-full h-4 bg-gray-300 rounded-full overflow-hidden">
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

            <!-- 📭 Estado cuando no hay IMC -->
            <div v-else class="flex flex-col items-center justify-center h-full text-center gap-4">
              <div class="relative w-40 aspect-[6/7]">
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
              <p class="text-sm text-gray-200">Aún no se ha registrado tu índice de masa corporal.</p>
              <p class="text-xs text-gray-300">Puedes actualizar tus datos físicos desde tu perfil.</p>
            </div>
          </div>
        </div>

        <!-- Dias entrenados -->
        <div class="col-span-2 row-start-3 w-full h-full">
          <div class="bg-white p-4 rounded-2xl h-full w-full px-8 flex flex-row gap-8 shadow-md"></div>
        </div>

        <!-- Rutinas -->
        <div class="col-span-2 row-span-2 row-start-4">
          <div class="bg-tertiary-500 py-6 pl-6 pr-3 rounded-2xl h-full w-full flex flex-col gap-3 shadow-md">
            <h1 class="flex gap-2 items-center text-xl"><LandPlot class="w-7 h-7" /> Rutinas del usuario</h1>
            <div
              v-if="userRutinas && userRutinas.length > 0"
              class="bg-tertiary-500 rounded-2xl h-full w-full flex flex-col gap-8 overflow-y-auto pr-2"
            >
              <router-link
                v-for="rutina in userRutinas"
                :to="{ name: 'ExercisesTrainInfo', params: { id: rutina.id } }"
                class="bg-white px-5 py-2 rounded-2xl w-full shadow-md hover:bg-gray-100 transition-all duration-300 text-black font-semibold flex flex-col justify-between h-full space-y-4"
              >
                <div class="flex flex-row gap-2 items-start justify-between">
                  <div class="flex flex-col gap-1">
                    <p class="text-xl font-bold">Nombre: {{ rutina.nombre }}</p>
                    <p class="text-sm text-gray-700">{{ rutina.descripcion }}</p>
                  </div>
                  <div v-if="rutina.activo" class="flex rounded-2xl bg-green-500/50 p-2">Activo</div>
                </div>

                <div class="flex flex-row justify-between text-sm text-gray-800">
                  <div>
                    <p><span class="font-semibold">Nivel:</span> {{ capitalizar(rutina.nivel) }}</p>
                    <p><span class="font-semibold">Objetivo:</span> {{ capitalizar(rutina.objetivo) }}</p>
                  </div>
                  <div v-if="rutina.diaActual" class="text-right">
                    <p><span class="font-semibold">Hoy:</span> {{ formatFecha(rutina.diaActual.fecha) }}</p>
                    <p><span class="font-semibold">Toca:</span> {{ capitalizar(rutina.diaActual.grupoMuscular) }}</p>
                  </div>
                </div>
              </router-link>
            </div>
            <p v-else class="text-black/60 italic">Este usuario aún no tiene ninguna rutina registrada</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/utils/auth";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
import { useLayoutStore } from "@/stores/layoutStore";

const layoutStore = useLayoutStore();
layoutStore.setTitle("Mi perfil");

const auth = useAuthStore();
const user = ref({});
const userInfo = ref({});
const userRutinas = ref({});
const imageURL = ref("");
const svgImc = ref("");
const diasEntrenados = ref([]);
const route = useRoute();

onMounted(async () => {
  const userId = route.params.id;
  const token = auth.getToken();

  try {
    const [response, responseInfo, responseRutinas, responseDias] = await Promise.all([
      axios.get(`http://localhost:8081/users/get/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`http://localhost:8081/users/get/${userId}/info/last`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`http://localhost:8081/trains/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`http://localhost:8081/trains/user/${userId}/days`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]);

    imageURL.value = `http://localhost:8081/pfp/${response.data.profile_img}`;

    user.value = response.data;
    userInfo.value = responseInfo.data;
    userRutinas.value = responseRutinas.data;
    diasEntrenados.value = responseDias.data;

    const hoy = new Date().toISOString().split("T")[0];

    userRutinas.value.forEach((rutina) => {
      if (rutina.dias && Array.isArray(rutina.dias)) {
        const diaHoy = rutina.dias.find((dia) => {
          const fechaDia = new Date(dia.fecha).toISOString().split("T")[0];
          return fechaDia === hoy;
        });
        rutina.diaActual = diaHoy || null;
      } else {
        rutina.diaActual = null;
      }
    });

    svgImc.value = user.genero == "Hombre" ? "/female.svg" : "/male.svg";
  } catch (error) {
    console.error("Error al cargar los datos del usuario:", error);
  }
});

// ICONS

import { Dna, Info, LandPlot, Ruler, User, Weight } from "lucide-vue-next";
import { Mail } from "lucide-vue-next";
import { Cake } from "lucide-vue-next";
import { Mars } from "lucide-vue-next";
import { Venus } from "lucide-vue-next";
import { ArrowBigLeftDash } from "lucide-vue-next";

const router = useRouter();

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

function getIMCCategory(imc = 0) {
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
