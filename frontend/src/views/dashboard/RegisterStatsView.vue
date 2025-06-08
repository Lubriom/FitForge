<template>
  <div class="w-full h-full flex items-center justify-center">
    <div class="w-fit h-fit bg-white p-3 shadow-amber-600/30 shadow-lg rounded-2xl">
      <div class="min-w-[600px] max-h-[500px] w-[800px] mx-auto p-3 space-y-6 overflow-y-auto">
        <!-- Paso 0: Introducción -->
        <div v-if="step === 0" class="text-center space-y-4 p-4">
          <h1 class="text-3xl font-bold">¡Registrar Información!</h1>
          <p class="text-lg text-left">
            Ayúdanos a seguir tu progreso actualizando solo los campos en los que hayas notado cambios físicos.
          </p>
          <p class="text-md text-gray-600 text-left">Este proceso es rápido y no te tomará más que unos segundos.</p>

          <div class="flex flex-row justify-center">
            <button
              @click="step++"
              class="bg-tertiary-500 hover:bg-orange-700 text-white px-6 py-2 rounded-xl hover:bg-tertiary-600 transition-all cursor-pointer"
            >
              Comenzar
            </button>
          </div>
        </div>

        <!-- Paso 1 -->
        <div v-if="step === 1" class="flex flex-col gap-4 px-6">
          <h1 class="text-2xl font-bold mb-2 text-center">Registrar Información física</h1>

          <div class="flex flex-col">
            <div class="flex flex-row gap-4 mb-4">
              <label class="w-full">
                Fuerza (RM):
                <input
                  type="text"
                  v-model="form.rm"
                  class="w-full rounded-xl px-4 py-2 mt-1 text-black bg-gray-200 outline-tertiary-500"
                  required
                />
              </label>

              <label class="w-full">
                Peso (kg):
                <input
                  type="text"
                  v-model.number="form.peso"
                  class="w-full rounded-xl px-4 py-2 mt-1 text-black bg-gray-200 outline-tertiary-500"
                  required
                />
              </label>
            </div>
            <div class="flex flex-row gap-4 mb-4">
              <label class="w-full">
                Altura (cm):
                <input
                  type="text"
                  v-model.number="form.altura"
                  class="w-full rounded-xl px-4 py-2 mt-1 text-black bg-gray-200 outline-tertiary-500"
                  required
                />
              </label>
              <label class="w-full">
                Discapacidad reconocida:
                <select
                  v-model="form.discapacidad"
                  class="w-full rounded-xl px-4 py-2 mt-1 text-black bg-gray-200 outline-tertiary-500"
                >
                  <option value="" disabled>Seleccione...</option>
                  <option value="no">No tengo discapacidad reconocida</option>
                  <option value="0-32">Discapacidad reconocida inferior al 33%</option>
                  <option value="33-64">Discapacidad reconocida entre el 33% y el 64%</option>
                  <option value="65-100">Discapacidad reconocida superior o igual al 65%</option>
                </select>
              </label>
            </div>
          </div>

          <!-- Patologías -->
          <div class="mt-4">
            <h2 class="text-xl font-bold mb-2 text-center">Patologías</h2>
            <div class="grid md:grid-cols-2 gap-4">
              <div
                v-for="(descripcion, categoria) in patologias"
                :key="categoria"
                class="bg-gray-300 p-4 rounded-2xl text-black flex items-center min-h-[100px]"
              >
                <label class="flex gap-3 items-center w-full">
                  <!-- Estilo custom para el checkbox -->
                  <input
                    type="checkbox"
                    :value="categoria"
                    v-model="form.patologiasSeleccionadas"
                    class="shrink-0 w-5 h-5 mt-1 rounded-md border-2 border-tertiary-500 text-tertiary-500 focus:ring-tertiary-500"
                  />
                  <!-- Texto alineado con checkbox -->
                  <div class="flex flex-col">
                    <span class="font-semibold">{{ categoria }}</span>
                    <p class="text-sm text-gray-800">( {{ descripcion }} )</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Paso 5 -->
        <div v-if="step === 2" class="flex flex-col gap-4">
          <h1 class="text-2xl font-bold mb-2 text-center">Revisión de datos</h1>
          <h1 class="text-md text-center">¿Estos datos son correctos? Comprueba 2 veces antes de enviar</h1>
          <ul class="bg-gray-300/50 p-4 rounded-xl text-black gap-2">
            <li><strong>Peso: </strong> {{ form.peso }} kg</li>
            <li><strong>Altura: </strong> {{ form.altura }} cm</li>
            <li><strong>Fuerza (RM): </strong> {{ form.rm }}</li>
            <li><strong>Discapacidad: </strong> {{ form.discapacidad }}</li>
            <li>
              <strong>Patologías:</strong>
              <span v-if="form.patologiasSeleccionadas.length">{{ form.patologiasSeleccionadas.join(", ") }}</span>
              <span v-else>Ninguna</span>
            </li>
          </ul>
        </div>

        <!-- Navegación -->
        <div v-if="step !== 0" class="flex justify-between">
          <button
            v-if="step > 1"
            type="button"
            @click="prevStep"
            class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 cursor-pointer"
          >
            Anterior
          </button>

          <div class="ml-auto">
            <button
              v-if="step < totalSteps"
              type="button"
              @click="nextStep"
              class="bg-tertiary-500 hover:bg-orange-700 text-white px-4 py-2 rounded-md hover:bg-tertiary-600 cursor-pointer"
            >
              Siguiente
            </button>

            <button
              v-else
              @click="enviarFormulario"
              class="bg-tertiary-500 hover:bg-orange-700 text-white px-4 py-2 rounded-md hover:bg-tertiary-600 cursor-pointer"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { z } from "zod";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "@/utils/Auth";
const emit = defineEmits(["loading-start", "loading-end"]);

const auth = useAuthStore();
const router = useRouter();

const step = ref(0);
const totalSteps = 2;

const patologias = {
  Cardíacas: "Como por ejemplo: hipertensión arterial, angina, infarto, etc.",
  Respiratorias: "Como por ejemplo: asma, bronquitis, etc.",
  Metabólicas: "Como por ejemplo: obesidad, diabetes, etc.",
  Musculoesqueléticas: "Como por ejemplo: artritis, osteoartritis, etc.",
  Neurológicas: "Como por ejemplo: epilepsia, Parkinson, etc.",
  Digestivas: "Como por ejemplo: enfermedad de Crohn, colitis ulcerosa, reflujo gástrico, etc.",
  Psicológicas: "Como por ejemplo: ansiedad, depresión, trastorno bipolar, etc."
};

const form = ref({
  rm: "0",
  peso: "",
  altura: "",
  discapacidad: null,
  patologiasSeleccionadas: []
});

const errors = ref({
  rm: "",
  peso: "",
  altura: "",
  discapacidad: "",
  patologiasSeleccionadas: ""
});

const nextStep = () => {
  if (step.value < 2) step.value++;
};

const prevStep = () => {
  if (step.value > 1) step.value--;
};

const enviarFormulario = async (event) => {
  event.preventDefault();

  try {
    const infoSchema = z.object({
      peso: z
        .number({ invalid_type_error: "Peso debe ser un número" })
        .min(1, "Peso debe ser mayor que 0")
        .max(500, "Peso demasiado alto"),
      rm: z
        .number({ invalid_type_error: "RM debe ser un número" })
        .min(0, "RM debe ser mayor o igual que 0")
        .max(500, "RM demasiado alto"),
      altura: z
        .number({ invalid_type_error: "Altura debe ser un número" })
        .min(30, "La altura debe ser mayor o igual que 0, y en cm")
        .max(300, "Altura demasiado alta"),

      discapacidad: z.enum(["no", "0-32", "33-64", "65-100"], {
        errorMap: () => ({ message: "Selecciona un grado de discapacidad válido." })
      }),

      patologiasSeleccionadas: z
        .array(
          z.enum([
            "Cardíacas",
            "Respiratorias",
            "Metabólicas",
            "Musculoesqueléticas",
            "Neurológicas",
            "Digestivas",
            "Psicológicas"
          ]),
          {
            errorMap: () => ({ message: "Selecciona al menos una patología válida." })
          }
        )
        .optional()
    });

    infoSchema.parse(form.value);
    alert("Formulario enviado correctamente");

    axios.post(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/users/stats/register`, form.value, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("log_token")}`
      }
    });
    router.push("/dashboard");
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.value = error.flatten().fieldErrors;
    } else {
      console.error(error);
      alert("Ha ocurrido un error inesperado");
    }
  }
};

onMounted(async () => {
  emit("loading-start");
  const id = auth.getId();
  const token = auth.getToken();

  try {
    const [responseUser, responseInfo, responsePato] = await Promise.all([
      axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/users/get/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/users/get/${id}/info/last`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/users/get/${id}/patologias`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]);

    form.value = {
      peso: responseInfo.data.peso,
      altura: responseInfo.data.altura * 100,
      rm: responseInfo.data.rm || 0,
      discapacidad: responseInfo.data.discapacidad,
      patologiasSeleccionadas: responsePato.data.map((patologia) => patologia.patologia)
    };
  } catch (error) {
    console.error("Error al cargar la info del usuario:", error);
  } finally {
    emit("loading-end");
  }
});
</script>
