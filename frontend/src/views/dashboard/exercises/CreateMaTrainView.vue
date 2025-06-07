<template>
  <div class="w-full h-full p-6 p-y-10 flex justify-center items-center">
    <div class="w-4/5 h-full p-3 bg-gray-100 rounded-2xl shadow">
      <div class="h-full lg:h-fit p-3 overflow-y-auto pr-2">
        <h2 class="text-2xl font-bold mb-4 text-center" v-if="idParam == auth.getId()">Crea tu entrenamiento</h2>
        <h2 class="text-2xl font-bold mb-4 text-center" v-else-if="user">
          Plan de Entrenamiento para: {{ user.nombre }} {{ user.apellido }} {{ user.sapellido }}
        </h2>

        <form @submit.prevent="submitForm" class="gap-4 flex flex-col h-fit">
          <div class="flex flex-col lg:flex-row gap-8 h-fit">
            <div class="flex flex-col w-full lg:w-1/2 gap-4">
              <label class="block">
                Nombre:
                <input
                  v-model="form.nombre"
                  type="text"
                  class="w-full rounded-xl px-4 py-2 bg-white hover:border-tertiary-500 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all"
                  placeholder="Ej: Plan para fuerza"
                />
                <p class="text-red-500 text-sm" v-if="errors.nombre">{{ errors.nombre[0] }}</p>
              </label>

              <label class="flex flex-col h-full">
                Descripción:
                <textarea
                  v-model="form.descripcion"
                  rows="3"
                  class="w-full h-full hover:border-tertiary-500 rounded-xl px-4 py-2 bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all resize-none"
                  placeholder="Descripción breve"
                ></textarea>
                <p class="text-red-500 text-sm" v-if="errors.descripcion">{{ errors.descripcion[0] }}</p>
              </label>
            </div>

            <div class="flex flex-col w-full lg:w-1/2 gap-4">
              <label class="block">
                Nivel:
                <select
                  v-model="form.nivel"
                  class="w-full hover:border-tertiary-500 rounded-xl px-4 py-2 bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all"
                >
                  <option value="" disabled>Selecciona nivel</option>
                  <option value="basico">Basico</option>
                  <option value="avanzado">Avanzado</option>
                  <option value="personalizado">Personalizado</option>
                </select>
                <p class="text-red-500 text-sm" v-if="errors.nivel">{{ errors.nivel[0] }}</p>
              </label>

              <label class="block">
                Objetivo:
                <select
                  v-model="form.objetivo"
                  class="w-full hover:border-tertiary-500 rounded-xl px-4 py-2 bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all"
                >
                  <option value="" disabled>Selecciona objetivo</option>
                  <option value="hipertrofia">Hipertrofia</option>
                  <option value="fuerza">Fuerza</option>
                  <option value="personalizado">Personalizado</option>
                </select>
                <p class="text-red-500 text-sm" v-if="errors.objetivo">{{ errors.objetivo[0] }}</p>
              </label>

              <label class="block">
                Fecha de inicio:
                <input
                  v-model="form.fechaInicio"
                  type="date"
                  class="w-full hover:border-tertiary-500 rounded-xl px-4 py-2 bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all"
                />
                <p class="text-red-500 text-sm" v-if="errors.fechaInicio">{{ errors.fechaInicio[0] }}</p>
              </label>

              <label class="block">
                Fecha de finalización:
                <input
                  v-model="form.fechaFin"
                  type="date"
                  class="w-full hover:border-tertiary-500 rounded-xl px-4 py-2 bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all"
                />
                <p class="text-red-500 text-sm" v-if="errors.fechaFin">{{ errors.fechaFin[0] }}</p>
              </label>
            </div>
          </div>

          <button
            type="submit"
            class="bg-tertiary-500 text-white px-6 py-2 rounded-2xl hover:bg-orange-700 transition cursor-pointer"
          >
            Crear Plan
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/utils/auth";
import { z } from "zod";

const emit = defineEmits(["loading-start", "loading-end"]);

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const idParam = route.params.id;

const usuarioId = 1; // Aquí deberías obtenerlo del estado global o contexto de usuario

const errors = ref({});
const form = ref({
  nombre: "",
  descripcion: "",
  nivel: "",
  objetivo: "",
  fechaInicio: "",
  fechaFin: "",
  activo: false,
  usuarioId
});
const user = ref({});

onMounted(async () => {
  emit("loading-start");

  try {
    const response = await axios.get(`http://localhost:8081/users/get/${idParam}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("log_token")}`
      }
    });

    user.value = response.data;
  } catch (error) {
    console.error("Error al consulta la información del usuario");
  } finally {
    emit("loading-end");
  }
});

const submitForm = async () => {
  try {
    const planSchema = z.object({
      nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
      descripcion: z.string().optional(),
      nivel: z.enum(["basico", "avanzado", "personalizado"], {
        errorMap: () => ({ message: "Selecciona un nivel válido" })
      }),
      objetivo: z.enum(["hipertrofia", "fuerza", "personalizado"], {
        errorMap: () => ({ message: "Selecciona un objetivo válido" })
      }),
      fechaInicio: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "La fecha de inicio no es válida"
      }),
      fechaFin: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "La fecha final no es válida"
      })
    });

    const validation = planSchema.safeParse(form.value);

    if (!validation.success) {
      errors.value = validation.error.flatten().fieldErrors;
      return;
    }

    // Validación extra: fechaFin > fechaInicio
    if (new Date(form.value.fechaFin) <= new Date(form.value.fechaInicio)) {
      errors.value.fechaFin = ["La fecha fin debe ser posterior a la fecha inicio"];
      return;
    }

    errors.value = {}; // limpiar errores previos si todo es válido

    const payload = {
      ...form.value,
      usuarioId: auth.getId() == idParam ? auth.getId() : idParam
    };
    // POST al backend (ajusta URL y datos según tu API)
    const response = await axios.post("http://localhost:8081/trains/create", payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("log_token")}`
      }
    });

    alert("Plan creado correctamente");
    router.push({ name: "ExercisesTrainEdit", params: { id: response.data.id, userId: response.data.usuarioId } });
  } catch (error) {
    console.error(error);
    alert("Error al crear el plan");
  }
};
</script>

<style scoped>
/* Tailwind ya aporta estilos, aquí puedes agregar personalización */
</style>
