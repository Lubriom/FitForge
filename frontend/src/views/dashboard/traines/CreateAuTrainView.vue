<template>
  <div class="min-w-[360px] w-fit md:w-1/2 mx-auto bg-white/90 h-fit shadow-lg p-2 rounded-2xl">
    <div class=" space-y-6 shadow-amber-600 max-h-[520px] h-fit overflow-y-auto p-4 pr-2">
      <!-- Paso 0: Introducción -->
      <div v-if="step === 0" class="text-center space-y-4 p-4">
        <h1 class="text-3xl font-bold">¡Bienvenido al panel de creación!</h1>
        <p class="text-lg text-left">
          Vamos a crear un plan de entrenamiento personalizado según tu nivel y objetivo. Para ello, necesitamos que
          llenes algunos datos extras.
        </p>
        <p class="text-md text-gray-600 text-left">¡Este proceso tomará solo unos minutos de tu tiempo!</p>
        <button
          @click="step++"
          class="bg-tertiary-500 hover:bg-orange-700 text-white px-6 py-2 rounded-xl hover:bg-tertiary-600 transition-all cursor-pointer"
        >
          Comenzar
        </button>
      </div>

      <!-- Paso 1 -->
      <div v-if="step === 1">
        <h1 class="text-2xl font-bold mb-2 text-center">Crea tu rutina</h1>
        <h2 class="text-xl font-bold mb-4 text-center">Selecciona el objetivo y el nivel</h2>

        <div class="flex flex-col md:flex-row gap-2">
          <div class="flex flex-col p-2 w-full">
            <label class="block mb-2 font-semibold">Objetivo:</label>
            <select
              v-model="form.objetivo"
              class="w-full rounded-xl px-4 py-2 bg-white text-black border border-gray-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all"
            >
              <option value="">Selecciona un objetivo</option>
              <option value="hipertrofia">Hipertrofia</option>
              <option value="fuerza">Fuerza</option>
            </select>
            <p v-if="errors.objetivo" class="text-red-500 text-sm mt-1">{{ errors.objetivo }}</p>

            <label class="block mt-4 mb-2 font-semibold">Nivel:</label>
            <select
              v-model="form.nivel"
              class="w-full rounded-xl px-4 py-2 bg-white text-black border border-gray-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all"
            >
              <option value="">Selecciona un nivel</option>
              <option value="basico">Básico</option>
              <option value="avanzado">Avanzado</option>
            </select>
            <p v-if="errors.nivel" class="text-red-500 text-sm mt-1">{{ errors.nivel }}</p>
          </div>
          <div class="flex flex-col p-4 w-full justify-center gap-4 bg-white rounded-2xl">
            <h1 class="text-lg font-semibold flex flex-row gap-2"><Info /> Información</h1>
            <div class="w-full flex gap-1 flex-col">
              <h1 class="text-lg font-semibold">Objetivo:</h1>
              <p class="text-sm">
                <b>Hipertrofia:</b> Enfocado en el aumento de masa muscular mediante entrenamientos con mayor volumen y
                carga progresiva.
              </p>
              <p class="text-sm">
                <b>Fuerza:</b> Orientado a mejorar la capacidad de generar potencia y resistencia mediante ejercicios
                específicos y mayor intensidad.
              </p>
            </div>
            <div class="w-full flex gap-1 flex-col">
              <h1 class="text-lg font-semibold">Nivel:</h1>
              <p class="text-sm">
                <b>Básico:</b> Distribución sencilla de ejercicios, series, repeticiones y descansos, ideal para quienes
                se inician en el entrenamiento.
              </p>
              <p class="text-sm">
                <b>Avanzado:</b> Plan más exigente y técnico, con estructuras complejas de entrenamiento para usuarios
                con experiencia previa.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Paso 2 -->
      <div v-if="step === 2 && form.nivel === 'avanzado' && !usuarioTieneRM">
        <h1 class="text-2xl font-bold mb-2 text-center">Crea tu rutina</h1>
        <h2 class="text-xl font-bold mb-4 text-center">Ingresa tu RM (Repetición Máxima)</h2>

        <div class="flex flex-col p-2">
          <label class="block mb-2 font-semibold">Fuerza (RM):</label>
          <input
            type="text"
            v-model="form.rm"
            min="0"
            class="w-full rounded-xl px-4 py-2 bg-white text-black border border-gray-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all"
          />
          <p v-if="errors.rm" class="text-red-500 text-sm mt-1">{{ errors.rm }}</p>
        </div>
      </div>

      <!-- Paso 3 -->
      <div v-if="step === 3">
        <h1 class="text-2xl font-bold mb-2 text-center">Crea tu rutina</h1>
        <h2 class="text-xl font-bold mb-4 text-center">Detalles del plan</h2>

        <div class="flex flex-col p-2">
          <label class="block mb-2 font-semibold">Nombre del plan:</label>
          <input
            v-model="form.nombre"
            class="w-full rounded-xl px-4 py-2 bg-white text-black border border-gray-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all"
          />
          <p v-if="errors.nombre" class="text-red-500 text-sm mt-1">{{ errors.nombre }}</p>

          <label class="block mt-4 mb-2 font-semibold">Descripción:</label>
          <textarea
            v-model="form.descripcion"
            class="w-full rounded-xl px-4 py-2 bg-white text-black border border-gray-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all"
          ></textarea>
          <p v-if="errors.descripcion" class="text-red-500 text-sm mt-1">{{ errors.descripcion }}</p>
        </div>
      </div>

      <!-- Navegación -->
      <div v-if="step !== 0" class="flex justify-between">
        <button
          v-if="step > 1"
          @click="volver"
          class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 cursor-pointer"
        >
          Volver
        </button>

        <div class="ml-auto">
          <button
            v-if="step < totalSteps"
            @click="handleNext"
            class="bg-tertiary-500 hover:bg-orange-700 text-white px-4 py-2 rounded-md hover:bg-tertiary-600 cursor-pointer"
          >
            Siguiente
          </button>

          <button
            v-else
            @click="enviarFormulario"
            id="enviarFormulario"
            class="bg-tertiary-500 hover:bg-orange-700 text-white px-4 py-2 rounded-md hover:bg-tertiary-600 cursor-pointer disabled:opacity-50"
          >
            Crear plan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { useAuthStore } from "@/utils/Auth";
import { z } from "zod";
import { useRouter } from "vue-router";
import { Info } from "lucide-vue-next";
import { useToast } from "vue-toastification";

const toast = useToast();

const emit = defineEmits(["loading-start", "loading-end"]);

const router = useRouter();

const auth = useAuthStore();
const step = ref(0);
const totalSteps = 3;
const isLoading = ref(false);

const usuarioTieneRM = ref(false);

const form = ref({
  objetivo: "",
  nivel: "",
  rm: null,
  nombre: "",
  descripcion: ""
});

onMounted(async () => {
  emit("loading-start");

  const token = auth.getToken();
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/users/get/${auth.getId()}/info/last`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    form.rm = response.data.rm || null;
    usuarioTieneRM.value = form.rm !== null;
  } catch (error) {
    console.error(error);
  } finally {
    emit("loading-end");
  }
});

const errors = ref({});

// Esquemas de validación
const schemaPaso1 = z.object({
  objetivo: z.string().min(1, "Selecciona un objetivo"),
  nivel: z.string().min(1, "Selecciona un nivel")
});

const schemaPaso2 = z.object({
  rm: z.number({ invalid_type_error: "Ingresa un número válido" }).min(1, "El RM debe ser mayor que 0")
});

const schemaPaso3 = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  descripcion: z.string().min(1, "La descripción es obligatoria")
});

const handleNext = () => {
  errors.value = {};

  if (step.value === 1) {
    const result = schemaPaso1.safeParse(form.value);
    if (!result.success) {
      result.error.issues.forEach((issue) => (errors.value[issue.path[0]] = issue.message));
      return;
    }

    if (form.value.nivel === "avanzado" && !usuarioTieneRM.value) {
      step.value = 2;
    } else {
      step.value = 3;
    }
  } else if (step.value === 2) {
    const parsedRM = parseFloat(form.value.rm);
    const result = schemaPaso2.safeParse({ rm: parsedRM });
    if (!result.success) {
      result.error.issues.forEach((issue) => (errors.value[issue.path[0]] = issue.message));
      return;
    }
    step.value = 3;
  }
};

const enviarFormulario = async () => {
  document.getElementById("enviarFormulario").disabled = true;
  errors.value = {};
  const result = schemaPaso3.safeParse(form.value);
  if (!result.success) {
    result.error.issues.forEach((issue) => (errors.value[issue.path[0]] = issue.message));
    return;
  }

  isLoading.value = true; // comienza a cargar

  try {
    const payload = {
      ...form.value,
      usuarioId: auth.getId()
    };

    const response = await axios.post(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/trains/autocreate`, payload, {
      headers: {
        Authorization: `Bearer ${auth.getToken()}`
      }
    });

    toast.success("Plan creado correctamente");
    router.push("/dashboard/train/get/" + response.data.planId);
  } catch (error) {
    console.error("Error al enviar el formulario:", error);
    toast.error("Hubo un error al crear el plan. Intenta de nuevo.");
  } finally {
    document.getElementById("enviarFormulario").disabled = false;
    isLoading.value = false; // termina la carga
  }
};

const volver = () => {
  if (step.value === 3) {
    if (form.value.nivel === "avanzado" && !usuarioTieneRM.value) {
      step.value = 2;
    } else {
      step.value = 1;
    }
  } else {
    step.value = Math.max(step.value - 1, 0);
  }
};
</script>
