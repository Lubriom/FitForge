<template>
  <div class="flex flex-col gap-3 h-full">
    <div class="flex flex-row items-center gap-2">
      <router-link
        v-if="auth.getRole() === 'admin' || auth.getRole() === 'entrenador'"
        :to="{ name: 'ExercisesTrainCreateMA', params: { id: auth.getId() } }"
        class="flex justify-center w-full items-center gap-1 bg-tertiary-500 hover:bg-tertiary-600 text-white font-semibold py-2 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-200"
        ><Plus />Nuevo Plan Manualmente</router-link
      >
      <router-link
        :to="{ name: 'ExercisesTrainCreateAU' }"
        class="flex justify-center w-full items-center gap-1 bg-tertiary-500 hover:bg-tertiary-600 text-white font-semibold py-2 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-200"
        ><Plus />Nuevo Plan Automatico</router-link
      >
    </div>

    <div
      v-if="rutinas.length > 0"
      class="bg-white rounded-3xl p-3 h-full flex flex-col gap-3 overflow-y-auto"
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 grid-rows-[180px] gap-3 h-full overflow-y-auto mr-0.5 pr-3">
        <div
          v-for="rutina in rutinas"
          :key="rutina.id"
          class="flex flex-col bg-gray-200 rounded-2xl p-4 border border-gray-200 gap-2 transition-colors h-[180px] shadow-sm shadow-black/20 inset-shadow-sm inset-shadow-gray-100"
        >
          <div class="flex flex-col items-center justify-between gap-1 px-0">
            <div class="flex flex-row justify-between w-full items-center">
              <router-link :to="{ name: 'ExercisesTrainInfo', params: { id: rutina.id } }" class="w-full">
                <div class="text-xl font-semibold text-orange-700 w-full">{{ capitalizar(rutina.nombre) }}</div>
              </router-link>

              <div class="flex flex-row gap-2 items-center relative">
                <label class="text-gray-700 font-semibold" for="activo">Activo</label>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    class="sr-only peer"
                    :checked="rutina.activo"
                    @change="toggleActivo(rutina)"
                    id="activo"
                  />
                  <div
                    class="w-11 h-6 bg-white inset-shadow-sm inset-shadow-black/30 rounded-full peer peer-checked:bg-green-500 transition-colors"
                  ></div>
                  <div
                    class="absolute left-1.5 w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full bg-gray-400 inset-shadow-sm inset-shadow-gray-300 peer-checked:inset-shadow-white peer-checked:bg-gray-200"
                  ></div>
                </label>

                <button
                  class="flex gap-1 font-semibold items-center p-1.5 rounded-xl bg-gray-50 hover:bg-gray-200 active:bg-gray-500 roudned-3xl cursor-pointer text-orange-600 hover:text-orange-800 inset-shadow-sm inset-shadow-black/40 transition-colors"
                  :title="mostrarOpcionesId == rutina.id ? 'Ocultar opciones' : 'Mostrar opciones'"
                  @click="mostrarOpcionesFunc(rutina)"
                  ref="mostrarOpcionesButton"
                >
                  <Ellipsis v-if="mostrarOpcionesId !== rutina.id" class="pointer-events-none" />
                  <X v-else class="pointer-events-none" />
                </button>

                <!-- Dropdown de opciones  -->
                <Transition name="fade-slide">
                  <div
                    :style="{ top: posicionOpciones.top + 5 + 'px', left: posicionOpciones.left - 240 + 'px' }"
                    class="z-20 fixed bg-gray-200 p-3 rounded-2xl shadow-lg shadow-black/50 flex gap-2 flex-col w-[280px] border-1 border-gray-300"
                    v-show="mostrarOpcionesId == rutina.id"
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
                            <Dumbbell v-if="rutina.objetivo == 'hipertrofia'" />
                            <HandIcon v-if="rutina.objetivo == 'fuerza'" />
                            <PaintbrushVertical v-if="rutina.objetivo == 'personalizado'" />
                            {{ capitalizar(rutina.objetivo) || "No definido" }}</span
                          >
                        </div>
                        <div class="flex justify-between items-center gap-2">
                          <b>Nivel:</b>
                          <span
                            class="text-sm font-semibold px-2 py-1 bg-tertiary-500/20 text-tertiary-500 rounded-full border-2 border-orange-400 flex gap-1"
                          >
                            <Gauge />{{ capitalizar(rutina.nivel) || "Nivel no especificado" }}</span
                          >
                        </div>
                      </div>
                      <!-- Fechas -->
                      <div class="flex-col gap-2 text-gray-500 text-sm lg:hidden flex p-2">
                        <div class="flex gap-1 justify-between items-center">
                          <b>Desde:</b>
                          <span
                            class="text-sm font-semibold px-3 py-1 bg-tertiary-500/20 text-tertiary-500 rounded-full border-2 border-orange-400"
                            >{{ new Date(rutina.fechaInicio).toISOString().split("T")[0] }}</span
                          >
                        </div>
                        <div class="flex gap-1 justify-between items-center">
                          <b>Hasta:</b>
                          <span
                            class="text-sm font-semibold px-3 py-1 bg-tertiary-500/20 text-tertiary-500 rounded-full border-2 border-orange-400"
                            >{{ new Date(rutina.fechaFin).toISOString().split("T")[0] }}</span
                          >
                        </div>
                      </div>
                    </div>
                    <router-link
                      v-if="auth.getRole() === 'admin' || auth.getRole() === 'entrenador'"
                      :to="{ name: 'ExercisesTrainEdit', params: { id: rutina.id, userId: rutina.usuarioId } }"
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
          </div>

          <div class="bg-white rounded-2xl gap-3 py-3 px-4 flex flex-row inset-shadow-sm inset-shadow-black/20 h-full">
            <div class="text-gray-600 sm:w-2/3 md:w-1/2 text-sm">
              <p>
                {{ capitalizar(rutina.descripcion) || "Sin descripción" }}
              </p>
            </div>

            <div class="flex-col gap-2 text-sm text-gray-500 hidden sm:flex sm:w-1/3 md:w-1/2">
              <div class="flex flex-col md:flex-row gap-2 text-gray-500 text-xs">
                <div class="flex justify-between items-center gap-2 w-full">
                  <span
                    class="font-semibold items-center justify-center px-2 py-1 bg-tertiary-500/20 text-tertiary-500 rounded-full border-2 border-orange-400 flex gap-1.5 w-full"
                  >
                    <Dumbbell v-if="rutina.objetivo == 'hipertrofia'" />
                    <HandIcon v-if="rutina.objetivo == 'fuerza'" />
                    <PaintbrushVertical v-if="rutina.objetivo == 'personalizado'" />
                    {{ capitalizar(rutina.objetivo) || "No definido" }}</span
                  >
                </div>
                <div class="flex justify-between items-center gap-2 w-full">
                  <span
                    class="font-semibold items-center justify-center px-2 py-1 bg-tertiary-500/20 text-tertiary-500 rounded-full border-2 border-orange-400 flex gap-1.5 w-full"
                  >
                    <Gauge />{{ capitalizar(rutina.nivel) || "Nivel no especificado" }}</span
                  >
                </div>
              </div>
              <div class="flex-col hidden md:flex">
                <div class="flex justify-between items-center">
                  <div
                    class="text-xs items-center justify-center flex-row w-full flex font-semibold px-3 py-1 gap-2 bg-tertiary-500/20 text-tertiary-500 rounded-full border-2 border-orange-400"
                  >
                    <Calendar />
                    <p>
                      {{ new Date(rutina.fechaInicio).toISOString().split("T")[0].replace(/-/g, "/") }} -
                      {{ new Date(rutina.fechaFin).toISOString().split("T")[0].replace(/-/g, "/") }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-500 bg-gray-200 p-6 rounded-2xl">No hay rutinas creadas</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import { useAuthStore } from "@/utils/Auth";
import { useLayoutStore } from "@/stores/layoutStore";
import {
  Calendar,
  Dumbbell,
  Ellipsis,
  Gauge,
  HandIcon,
  Info,
  PaintbrushVertical,
  Plus,
  SquarePen,
  Trash,
  X
} from "lucide-vue-next";
import { useToast } from "vue-toastification";

const toast = useToast();

const emit = defineEmits(["loading-start", "loading-end"]);

const layoutStore = useLayoutStore();
const auth = useAuthStore();
layoutStore.setTitle("Rutinas");

const router = useRouter();
const route = useRoute();

const rutinas = ref([]);

const mostrarOpcionesId = ref(null);
const posicionOpciones = ref({ top: 0, left: 0 });
const rutinaOpcSeleccionada = ref(null);
const mostrarOpcionesButton = ref(null);
const mostrarOpcionesMenu = ref(null);

function mostrarOpcionesFunc(rutina) {
  mostrarOpcionesId.value = mostrarOpcionesId.value === rutina.id ? null : rutina.id;
  rutinaOpcSeleccionada.value = rutinas.value.indexOf(rutina);

  const rect = mostrarOpcionesButton.value[rutinaOpcSeleccionada.value].getBoundingClientRect();

  posicionOpciones.value = {
    top: rect.bottom + window.scrollY,
    left: rect.left + window.scrollX
  };
}

function handleClickOutside(event) {
  if (rutinaOpcSeleccionada.value == null) return;

  const clickedOutside =
    !mostrarOpcionesMenu.value[rutinaOpcSeleccionada.value]?.contains(event.target) &&
    !mostrarOpcionesButton.value[rutinaOpcSeleccionada.value]?.contains(event.target);

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

onMounted(async () => {
  emit("loading-start");
  const auth = useAuthStore();
  const token = auth.getToken();

  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/trains/user/${auth.getId()}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
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
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/trains/user/${auth.getId()}/${
        rutina.id
      }/toggle`,
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
    rutina.activo = !rutina.activo;

    toast.success("Rutina cambiada con éxito");
  } catch (error) {
    toast.error("Error al cambiar el estado de la rutina");
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
</style>
