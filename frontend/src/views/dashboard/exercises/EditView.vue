<template>
  <div class="flex flex-col w-full h-full gap-3">
    <div class="flex flex-row justify-center items-center h-full gap-3">
      <div class="flex flex-col p-8 bg-white rounded-2xl shadow-md min-w-[360px] w-1/2 gap-6">
        <div class="flex flex-row justify-between">
          <h2 class="text-2xl font-semibold text-center text-tertiary-600">
            Editando: <span class="text-tertiary-600">{{ form.nombre }}</span>
          </h2>
          <button @click="eliminarEjercicio" class="bg-red-500 hover:bg-red-800 text-white p-2 rounded-lg">
            <Trash />
          </button>
        </div>
        <form @submit.prevent="editarEjercicio" class="flex flex-col gap-4 bg-white rounded-2xl">
          <div class="flex flex-col">
            <label for="nombre" class="font-medium">Nombre</label>
            <input
              id="nombre"
              v-model="form.nombre"
              type="text"
              placeholder="Nombre"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tertiary-500"
            />
            <span class="text-red-500 text-sm text-center">{{ errors.nombre }}</span>
          </div>

          <div class="flex flex-row gap-4">
            <div class="flex flex-col w-full">
              <label for="tipo" class="font-medium">Tipo</label>
              <select
                id="tipo"
                v-model="form.tipo"
                class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tertiary-500"
              >
                <option disabled value="">Selecciona un tipo</option>
                <option value="pull">Pull</option>
                <option value="press">Press</option>
                <option value="squat">Squat</option>
                <option value="lunges">Lunges</option>
                <option value="hit">Hit</option>
                <option value="core">Core</option>
              </select>
              <span class="text-red-500 text-sm text-center">{{ errors.tipo }}</span>
            </div>

            <div class="flex flex-col w-full">
              <label for="categoria" class="font-medium">Categoría</label>
              <select
                id="categoria"
                v-model="form.categoria"
                class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tertiary-500"
              >
                <option disabled value="">Selecciona una categoría</option>
                <option value="piernas">Pierna</option>
                <option value="pecho">Pecho</option>
                <option value="espalda">Espalda</option>
                <option value="hombro">Hombro</option>
                <option value="brazos">Brazos</option>
                <option value="abdomen">Abdomen</option>
                <option value="full body">Full Body</option>
              </select>
              <span class="text-red-500 text-sm text-center">{{ errors.categoria }}</span>
            </div>
          </div>

          <div class="flex flex-row gap-4">
            <div class="flex flex-col w-full">
              <label for="descanso" class="font-medium">Descanso (segundos)</label>
              <input
                id="descanso"
                v-model="form.descanso"
                type="text"
                placeholder="Descanso (segundos)"
                class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tertiary-500"
              />
              <span class="text-red-500 text-sm text-center">{{ errors.descanso }}</span>
            </div>

            <div class="flex flex-col w-full">
              <label for="series" class="font-medium">Series</label>
              <input
                id="series"
                v-model="form.series"
                type="text"
                placeholder="Series"
                class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tertiary-500"
              />
              <span class="text-red-500 text-sm text-center">{{ errors.series }}</span>
            </div>
          </div>

          <div class="flex flex-row gap-4">
            <div class="flex flex-col w-full">
              <label for="repeticiones" class="font-medium">Repeticiones</label>
              <input
                id="repeticiones"
                v-model="form.repeticiones"
                type="text"
                placeholder="Repeticiones"
                class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tertiary-500"
              />
              <span class="text-red-500 text-sm text-center">{{ errors.repeticiones }}</span>
            </div>

            <div class="flex flex-col w-full">
              <label for="peso" class="font-medium">Peso (kg)</label>
              <input
                id="peso"
                v-model="form.peso"
                type="text"
                placeholder="Peso (kg)"
                class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tertiary-500"
              />
              <span class="text-red-500 text-sm text-center">{{ errors.peso }}</span>
            </div>
          </div>

          <span class="text-red-500 text-center block">{{ errors.serverError }}</span>

          <button type="submit" class="bg-tertiary-500 hover:bg-tertiary-600 text-white py-2 px-4 rounded-lg w-full">
            Modificar Ejercicio
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { z } from "zod";
import { useAuthStore } from "@/utils/auth";
import { Trash } from "lucide-vue-next";

const auth = useAuthStore();

const router = useRouter();

const form = ref({
  nombre: "",
  tipo: "",
  categoria: "",
  descanso: "",
  series: "",
  repeticiones: "",
  peso: ""
});

const errors = ref({
  nombre: "",
  tipo: "",
  categoria: "",
  descanso: "",
  series: "",
  repeticiones: "",
  peso: "",
  serverError: ""
});

const ejercicioSchema = z
  .object({
    nombre: z.string().nonempty("El nombre es obligatorio").optional(),

    tipo: z
      .enum(["pull", "press", "squat", "lunges", "hit", "core"], {
        errorMap: () => ({ message: "Selecciona un tipo válido" })
      })
      .optional(),

    categoria: z
      .enum(["piernas", "pecho", "hombros", "espalda", "brazos", "abdomen", "full body"], {
        errorMap: () => ({ message: "Selecciona una categoría válida" })
      })
      .optional(),

    descanso: z
      .string()
      .nonempty("El descanso es obligatorio")
      .refine((val) => /^\d+$/.test(val), {
        message: "El descanso debe ser un número válido y positivo."
      })
      .optional(),

    series: z
      .string()
      .nonempty("Las series son obligatorias")
      .refine((val) => /^\d+$/.test(val) && Number(val) >= 1, {
        message: "Debe haber al menos una serie."
      })
      .optional(),

    repeticiones: z
      .string()
      .nonempty("Las repeticiones son obligatorias")
      .refine((val) => /^\d+$/.test(val) && Number(val) >= 1, {
        message: "Debe haber al menos una repetición."
      })
      .optional(),

    peso: z
      .string()
      .nonempty("El peso es obligatorio")
      .refine((val) => /^\d{1,3}(\.\d{1,2})?$/.test(val), {
        message: "Peso debe ser un número válido (hasta 2 decimales)."
      })
      .optional()
  })
  .partial();

const editarEjercicio = async () => {
  Object.keys(errors.value).forEach((key) => (errors.value[key] = ""));

  try {
    const ejercicioId = router.currentRoute.value.params.id;
    const token = auth.getToken();
    ejercicioSchema.parse(form.value);

    await axios.patch(`http://localhost:8081/exercises/update/${ejercicioId}`, form.value, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert("Ejercicio modificado con exito");
    router.push({ name: "Exercises" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      err.errors.forEach((e) => {
        if (e.path[0] in errors.value) {
          errors.value[e.path[0]] = e.message;
        }
      });
    } else {
      errors.value.serverError = err.response?.data?.error || "Error inesperado al modificar el ejercicio.";
    }
  }
};

onMounted(async () => {
  try {
    const ejercicioId = router.currentRoute.value.params.id;
    const response = await axios.get(`http://localhost:8081/exercises/get/${ejercicioId}`);

    form.value = {
      nombre: response.data.nombre || "",
      tipo: response.data.tipo || "",
      categoria: response.data.categoria || "",
      descanso: response.data.descanso?.toString() || "",
      series: response.data.series?.toString() || "",
      repeticiones: response.data.repeticiones?.toString() || "",
      peso: response.data.peso?.toString() || ""
    };
  } catch (error) {
    console.error("Error al cargar el ejercicio:", error);
    errors.value.serverError = "No se pudo cargar el ejercicio.";
  }
});

const eliminarEjercicio = async () => {
  const ejercicioId = router.currentRoute.value.params.id;
  try {
    await axios.delete(`http://localhost:8081/exercises/delete/${ejercicioId}`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` }
    });
    alert("Ejercicio eliminado con exito");
    router.push({ name: "Exercises" });
  } catch (error) {
    console.error("Error al eliminar el ejercicio:", error);
    errors.value.serverError = "No se pudo eliminar el ejercicio.";
  }
};
</script>
