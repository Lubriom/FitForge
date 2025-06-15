<template>
  <div class="flex flex-col gap-3 h-full">
    <div class="flex flex-row justify-evenly items-center">
      <router-link
        v-if="auth.getRole() === 'admin' || auth.getRole() === 'entrenador'"
        :to="{ name: 'ExercisesTrainCreateMA', params: { id: auth.getId() } }"
        class="bg-tertiary-500 hover:bg-orange-700 text-white font-medium px-4 py-2 rounded-xl shadow-md ml-3"
        ><span class="flex items-center gap-1"><Plus /> Nuevo Plan Manualmente</span></router-link
      >
      <router-link
        :to="{ name: 'ExercisesTrainCreateAU' }"
        class="bg-tertiary-500 hover:bg-orange-700 text-white font-medium px-4 py-2 rounded-xl shadow-md ml-3"
        ><span class="flex items-center gap-1"><Plus /> Nuevo Plan Automatico</span></router-link
      >
    </div>

    <div v-if="rutinas.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-3 overflow-y-auto">
      <div  v-for="rutina in rutinas" :key="rutina.id">
        <div
          class="flex flex-col bg-white hover:bg-gray-200 shadow-md hover:shadow-lg transition-shadow rounded-2xl p-6 border border-gray-200 gap-2"
        >
          <div class="flex flex-col items-center justify-between gap-1">
            <div class="flex flex-row justify-between w-full items-center">
              <!-- SOLO el nombre es clicable para navegar -->
              <router-link :to="{ name: 'ExercisesTrainInfo', params: { id: rutina.id } }" class="w-full">
                <div class="text-xl font-semibold text-gray-800 w-full">Nombre: {{ rutina.nombre }}</div>
              </router-link>

              <div class="flex flex-row gap-2 items-center">
                <h1>Activo</h1>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer" :checked="rutina.activo" @change="toggleActivo(rutina)" />
                  <div
                    class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-tertiary-500 rounded-full peer peer-checked:bg-green-500 transition-colors"
                  ></div>
                  <div
                    class="absolute left-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full"
                  ></div>
                </label>
                <router-link
                v-if="auth.getRole() === 'admin' || auth.getRole() === 'entrenador'"
                  class="bg-tertiary-500 hover:bg-orange-700 text-white rounded-md p-2"
                  :to="{ name: 'ExercisesTrainEdit', params: { id: rutina.id, userId: auth.getId() } }"
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

    </div>
    <div v-else class="text-center text-gray-500 bg-gray-200 p-6 rounded-2xl">
      No hay rutinas creadas
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import { useAuthStore } from "@/utils/Auth";
import { useLayoutStore } from "@/stores/layoutStore";
import { Plus, SquarePen, Trash } from "lucide-vue-next";
import { useToast } from "vue-toastification";

const toast = useToast();

const emit = defineEmits(["loading-start", "loading-end"]);

const layoutStore = useLayoutStore();
const auth = useAuthStore();
layoutStore.setTitle("Rutinas de Entrenamiento");

const router = useRouter();
const route = useRoute();

const rutinas = ref([]);

onMounted(async () => {
  emit("loading-start");
  const auth = useAuthStore();
  const token = auth.getToken();

  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/trains/user/${auth.getId()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    rutinas.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    emit("loading-end");
  }
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

const toggleActivo = async (rutina) => {
  try {
    await axios.patch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/trains/user/${auth.getId()}/${rutina.id}/toggle`,
      {},
      {
        headers: {
          Authorization: `Bearer ${auth.getToken()}`
        }
      }
    );

    // Desactivar todas las rutinas en la vista
    rutinas.value.forEach((r) => {
      r.activo = false;
    });

    // Activar solo la rutina seleccionada
    rutina.activo = true;
  } catch (error) {
    toast.error("Error al cambiar el estado de la rutina");
  }
};

const capitalizar = (texto) => {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};
</script>
