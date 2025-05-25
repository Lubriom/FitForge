<template>
    <div class="max-w-xl mx-auto bg-white shadow-lg p-6 rounded-2xl">
      <!-- Paso 1 -->
      <div v-if="step === 1">
        <h2 class="text-xl font-bold mb-4">Selecciona el objetivo y el nivel</h2>
  
        <label class="block mb-2 font-semibold">Objetivo:</label>
        <select v-model="form.objetivo" class="w-full border border-gray-300 rounded-md px-3 py-2">
          <option value="">Selecciona un objetivo</option>
          <option value="hipertrofia">Hipertrofia</option>
          <option value="fuerza">Fuerza</option>
        </select>
        <p v-if="errors.objetivo" class="text-red-500 text-sm mt-1">{{ errors.objetivo }}</p>
  
        <label class="block mt-4 mb-2 font-semibold">Nivel:</label>
        <select v-model="form.nivel" class="w-full border border-gray-300 rounded-md px-3 py-2">
          <option value="">Selecciona un nivel</option>
          <option value="basico">Básico</option>
          <option value="avanzado">Avanzado</option>
        </select>
        <p v-if="errors.nivel" class="text-red-500 text-sm mt-1">{{ errors.nivel }}</p>
  
        <button @click="handleNext" class="bg-tertiary-500 text-white px-4 py-2 rounded-md hover:bg-tertiary-600 mt-4">Siguiente</button>
      </div>
  
      <!-- Paso 2: Solo si es avanzado y no tiene RM -->
      <div v-else-if="step === 2 && form.nivel === 'avanzado' && !usuarioTieneRM">
        <h2 class="text-xl font-bold mb-4">Ingresa tu RM (Repetición Máxima)</h2>
  
        <label class="block mb-2 font-semibold">RM (en kg):</label>
        <input type="number" v-model="form.rm" min="0" class="w-full border border-gray-300 rounded-md px-3 py-2" />
        <p v-if="errors.rm" class="text-red-500 text-sm mt-1">{{ errors.rm }}</p>
  
        <button @click="handleNext" class="bg-tertiary-500 text-white px-4 py-2 rounded-md hover:bg-tertiary-600 mt-4">Siguiente</button>
      </div>
  
      <!-- Paso 2 salta si no necesita RM -->
      <div v-else-if="step === 2 && (form.nivel !== 'avanzado' || usuarioTieneRM)">
        {{ handleNext() }}
      </div>
  
      <!-- Paso 3 -->
      <div v-else-if="step === 3">
        <h2 class="text-xl font-bold mb-4">Detalles del plan</h2>
  
        <label class="block mb-2 font-semibold">Nombre del plan:</label>
        <input v-model="form.nombre" class="w-full border border-gray-300 rounded-md px-3 py-2" type="text" />
        <p v-if="errors.nombre" class="text-red-500 text-sm mt-1">{{ errors.nombre }}</p>
  
        <label class="block mt-4 mb-2 font-semibold">Descripción:</label>
        <textarea v-model="form.descripcion" class="w-full border border-gray-300 rounded-md px-3 py-2"></textarea>
        <p v-if="errors.descripcion" class="text-red-500 text-sm mt-1">{{ errors.descripcion }}</p>
  
        <button @click="enviarFormulario" class="bg-tertiary-500 text-white px-4 py-2 rounded-md hover:bg-tertiary-600 mt-4">Crear plan</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import axios from "axios";
  import { useAuthStore } from "@/utils/auth";
  import { z } from "zod";
  
  const auth = useAuthStore();
  const step = ref(1);
  const usuarioTieneRM = ref(false);
  
  const form = ref({
    objetivo: "",
    nivel: "",
    rm: null,
    nombre: "",
    descripcion: ""
  });
  
  const errors = ref({});
  
  // Esquemas por paso
  const schemaPaso1 = z.object({
    objetivo: z.string().min(1, "Selecciona un objetivo"),
    nivel: z.string().min(1, "Selecciona un nivel")
  });
  
  const schemaPaso2 = z.object({
    rm: z
      .number({ invalid_type_error: "Ingresa un número válido" })
      .min(1, "El RM debe ser mayor que 0")
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
        result.error.issues.forEach(issue => (errors.value[issue.path[0]] = issue.message));
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
        result.error.issues.forEach(issue => (errors.value[issue.path[0]] = issue.message));
        return;
      }
      step.value = 3;
    }
  };
  
  const enviarFormulario = async () => {
    errors.value = {};
    const result = schemaPaso3.safeParse(form.value);
    if (!result.success) {
      result.error.issues.forEach(issue => (errors.value[issue.path[0]] = issue.message));
      return;
    }
  
    try {
      const payload = {
        ...form.value,
        usuarioId: auth.getId()
      };
  
      await axios.post("http://localhost:8081/trains/create", payload, {
        headers: {
          Authorization: `Bearer ${auth.getToken()}`
        }
      });
  
      alert("Plan creado correctamente");
      // Redirige o limpia el formulario si lo deseas
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };
  </script>
  
  <style scoped>
  /* Puedes añadir estilos aquí si quieres */
  </style>
  