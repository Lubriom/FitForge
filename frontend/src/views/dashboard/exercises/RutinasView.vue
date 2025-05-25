<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-row justify-evenly items-center">
      <router-link
        :to="{ name: 'ExercisesTrainCreateMA' }"
        class="bg-tertiary-500 hover:bg-orange-700 text-white font-medium px-4 py-2 rounded-xl shadow-md ml-3"
        ><span class="flex items-center gap-1"><Plus /> Nuevo Plan Manualmente</span></router-link
      >
      <router-link
        :to="{ name: 'ExercisesTrainCreateAU' }"
        class="bg-tertiary-500 hover:bg-orange-700 text-white font-medium px-4 py-2 rounded-xl shadow-md ml-3"
        ><span class="flex items-center gap-1"><Plus /> Nuevo Plan Automatico</span></router-link
      >
    </div>
    <div v-if="rutinas.length > 0" v-for="rutina in rutinas" :key="rutina.id" class="mb-4">
      <div
        class="flex flex-col bg-white shadow-md hover:shadow-lg transition-shadow rounded-2xl p-6 border border-gray-200 gap-2"
      >
        <div class="flex flex-col items-center justify-between mb-2 gap-1">
          <div class="flex flex-row justify-between w-full items-center">
            <!-- SOLO el nombre es clicable para navegar -->
            <router-link
              :to="{ name: 'ExercisesTrainInfo', params: { id: rutina.id } }"
              class="text-xl font-semibold text-gray-800 hover:underline"
            >
              {{ rutina.nombre }}
            </router-link>

            <div class="flex flex-row gap-2">
              <router-link
                class="bg-tertiary-500 hover:bg-orange-700 text-white rounded-md p-2"
                :to="{ name: 'ExercisesTrainInfo', params: { id: rutina.id } }"
              >
                <SquarePen />
              </router-link>

              <button
                class="bg-red-500 hover:bg-red-800 text-white rounded-md p-2 cursor-pointer"
                type="button"
                @click="eliminarRutina(rutina.id)"
              >
                <Trash />
              </button>
            </div>
          </div>
          <hr class="w-full pb-2 mx-auto border-tertiary-500/20" />
        </div>

        <p class="text-gray-600 mb-2">{{ rutina.descripcion || "Sin descripción" }}</p>

        <div class="flex flex-row gap-2 text-sm text-gray-500 mb-1">
          <p class="flex items-center gap-2">
            <strong>Objetivo:</strong>
            <span class="text-sm px-3 py-1 bg-tertiary-500/20 text-tertiary-500 rounded-full">{{
              capitalizar(rutina.objetivo) || "No definido"
            }}</span>
          </p>
          <p class="flex items-center gap-2">
            <strong>Nivel:</strong>
            <span class="text-sm px-3 py-1 bg-tertiary-500/20 text-tertiary-500 rounded-full">{{
              capitalizar(rutina.nivel) || "Nivel no especificado"
            }}</span>
          </p>
        </div>

        <div class="text-sm text-gray-500">
          <strong>Desde:</strong> {{ new Date(rutina.fechaInicio).toLocaleDateString() }}
          <span v-if="rutina.fechaFin">
            | <strong>Hasta:</strong> {{ new Date(rutina.fechaFin).toLocaleDateString() }}
          </span>
        </div>
      </div>
    </div>
    <div v-else class="bg-white shadow-md hover:shadow-lg transition-shadow rounded-2xl text-2xl flex justify-center p-6 border border-gray-200"><p>Aún no tienes rutinas creadas ¿Por que no comienzas creando una?</p></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import { useAuthStore } from "@/utils/auth";
import { useLayoutStore } from "@/stores/layoutStore";
import { Plus, SquarePen, Trash } from "lucide-vue-next";

const layoutStore = useLayoutStore();
const auth = useAuthStore();
layoutStore.setTitle("Rutinas de Entrenamiento");

const router = useRouter();
const route = useRoute();

const rutinas = ref([]);

onMounted(async () => {
  const auth = useAuthStore();
  const token = auth.getToken();
  try {
    const response = await axios.get(`http://localhost:8081/trains/user/${auth.getId()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    rutinas.value = response.data;
    console.log(rutinas.value);
  } catch (error) {
    console.error(error);
  }
});

const eliminarRutina = async (rutinaId) => {
  try {
    await axios.delete(`http://localhost:8081/trains/delete/${rutinaId}`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` }
    });

    rutinas.value = rutinas.value.filter((r) => r.id !== rutinaId);

    alert("Rutina eliminada con éxito");
  } catch (error) {
    console.error("Error al eliminar la rutina:", error);
  }
};

const capitalizar = (texto) => {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};
</script>
