<template>
  <div class="w-2/3 p-6 bg-white rounded-2xl shadow space-y-4 flex justify-center items-center">
    <div class="w-full px-5">
      <h2 class="text-2xl font-bold mb-4 text-center">Crear tu plan de Entrenamiento</h2>

      <form @submit.prevent="submitForm" class="gap-4 flex flex-col">
        <div class="flex flex-row gap-8">
          <div class="flex flex-col w-1/2 gap-4">
            <label class="block">
              Nombre:
              <input
                v-model="form.nombre"
                type="text"
                required
                class="w-full rounded border px-3 py-2 mt-1"
                placeholder="Ej: Plan para fuerza"
              />
            </label>

            <label class="block">
              Descripción:
              <textarea
                v-model="form.descripcion"
                rows="3"
                class="w-full rounded border px-3 py-2 mt-1"
                placeholder="Descripción breve"
              ></textarea>
            </label>
          </div>

          <div class="flex flex-col w-1/2 gap-4">
            <label class="block">
              Nivel:
              <select v-model="form.nivel" required class="w-full rounded border px-3 py-2 mt-1">
                <option value="" disabled>Selecciona nivel</option>
                <option value="basico">Basico</option>
                <option value="avanzado">Avanzado</option>
                <option value="personalizado">Personalizado</option>
              </select>
            </label>

            <label class="block">
              Objetivo:
              <select v-model="form.objetivo" required class="w-full rounded border px-3 py-2 mt-1">
                <option value="" disabled>Selecciona objetivo</option>
                <option value="hipertrofia">Hipertrofia</option>
                <option value="fuerza">Fuerza</option>
                <option value="personalizado">Personalizado</option>
              </select>
            </label>

            <label class="block">
              Fecha inicio:
              <input v-model="form.fechaInicio" type="date" required class="w-full rounded border px-3 py-2 mt-1" />
            </label>

            <label class="block">
              Fecha fin:
              <input v-model="form.fechaFin" type="date" required class="w-full rounded border px-3 py-2 mt-1" />
            </label>
          </div>
        </div>

        <button type="submit" class="bg-tertiary-500 text-white px-6 py-2 rounded-2xl hover:bg-orange-700 transition">
          Crear Plan
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/utils/auth";

const router = useRouter();
const auth = useAuthStore();

const usuarioId = 1; // Aquí deberías obtenerlo del estado global o contexto de usuario

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

const submitForm = async () => {
  try {
    
    // Validación sencilla: fechaFin > fechaInicio
    if (form.value.fechaFin <= form.value.fechaInicio) {
      alert("La fecha fin debe ser posterior a la fecha inicio");
      return;
    }

    // POST al backend (ajusta URL y datos según tu API)
    const response = await axios.post(
      "http://localhost:8081/trains/create",
      {
        nombre: form.value.nombre,
        descripcion: form.value.descripcion,
        nivel: form.value.nivel,
        objetivo: form.value.objetivo,
        fechaInicio: form.value.fechaInicio,
        fechaFin: form.value.fechaFin,
        usuarioId: auth.getId()
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("log_token")}`
        }
      }
    );

    alert("Plan creado correctamente");
    router.push("/dashboard"); // O donde quieras redirigir
  } catch (error) {
    console.error(error);
    alert("Error al crear el plan");
  }
};
</script>

<style scoped>
/* Tailwind ya aporta estilos, aquí puedes agregar personalización */
</style>
