<template>
  <div class="min-w-[600px] w-[700px] mx-auto bg-white/90 shadow-lg p-6 rounded-2xl space-y-6 shadow-amber-600">
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

      <div class="flex flex-col p-2">
        <label class="block mb-2 font-semibold">Objetivo:</label>
        <select
          v-model="form.objetivo"
          class="w-full rounded-xl px-4 py-2 bg-white text-black border border-gray-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-quaternary-500 transition-all"
        >
          <option value="">Selecciona un objetivo</option>
          <option value="hipertrofia">Hipertrofia</option>
          <option value="fuerza">Fuerza</option>
        </select>
        <p v-if="errors.objetivo" class="text-red-500 text-sm mt-1">{{ errors.objetivo }}</p>

        <label class="block mt-4 mb-2 font-semibold">Nivel:</label>
        <select
          v-model="form.nivel"
          class="w-full rounded-xl px-4 py-2 bg-white text-black border border-gray-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-quaternary-500 transition-all"
        >
          <option value="">Selecciona un nivel</option>
          <option value="basico">Básico</option>
          <option value="avanzado">Avanzado</option>
        </select>
        <p v-if="errors.nivel" class="text-red-500 text-sm mt-1">{{ errors.nivel }}</p>
      </div>
    </div>

    <!-- Paso 2 -->
    <div v-if="step === 2 && form.nivel === 'avanzado' && !usuarioTieneRM">
      <h1 class="text-2xl font-bold mb-2 text-center">Crea tu rutina</h1>
      <h2 class="text-xl font-bold mb-4 text-center">Ingresa tu RM (Repetición Máxima)</h2>

      <div class="flex flex-col p-2">
        <label class="block mb-2 font-semibold">RM (en kg):</label>
        <input
          type="number"
          v-model="form.rm"
          min="0"
          class="w-full rounded-xl px-4 py-2 bg-white text-black border border-gray-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-quaternary-500 transition-all"
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
          class="w-full rounded-xl px-4 py-2 bg-white text-black border border-gray-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-quaternary-500 transition-all"
        />
        <p v-if="errors.nombre" class="text-red-500 text-sm mt-1">{{ errors.nombre }}</p>

        <label class="block mt-4 mb-2 font-semibold">Descripción:</label>
        <textarea
          v-model="form.descripcion"
          class="w-full rounded-xl px-4 py-2 bg-white text-black border border-gray-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-quaternary-500 transition-all"
        ></textarea>
        <p v-if="errors.descripcion" class="text-red-500 text-sm mt-1">{{ errors.descripcion }}</p>
      </div>
    </div>

    <!-- Navegación -->
    <div v-if="step !== 0" class="flex justify-between pt-4">
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
          class="bg-tertiary-500 hover:bg-orange-700 text-white px-4 py-2 rounded-md hover:bg-tertiary-600 cursor-pointer"
        >
          Crear plan
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useAuthStore } from "@/utils/auth";
import { z } from "zod";
import { useRouter } from "vue-router";

const router = useRouter();

const auth = useAuthStore();
const step = ref(0);
const totalSteps = 3;
const isLoading = ref(false);

const usuarioTieneRM = ref(false); // lógica real dependerá de tu backend o store

const form = ref({
  objetivo: "",
  nivel: "",
  rm: null,
  nombre: "",
  descripcion: ""
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

    const response = await axios.post("http://localhost:8081/trains/autocreate", payload, {
      headers: {
        Authorization: `Bearer ${auth.getToken()}`
      }
    });

    router.push("/dashboard/train/get/" + response.data.planId); // o `/entrenamientos/:id` si tienes el ID
  } catch (error) {
    console.error("Error al enviar el formulario:", error);
    alert("Hubo un error al crear el plan. Intenta de nuevo.");
  } finally {
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
