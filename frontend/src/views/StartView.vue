<template>
  <div class="min-w-[600px] w-[700px] mx-auto bg-white/90 shadow-lg p-6 rounded-2xl space-y-6 shadow-amber-600">
    <!-- Paso 0: Introducción -->
    <div v-if="step === 0" class="text-center space-y-4 p-4">
      <h1 class="text-3xl font-bold">¡Completar Perfil!</h1>
      <p class="text-lg text-left">Ha llegado la hora de comenzar tu aventura en FitForge completemos tu perfil.</p>
      <p class="text-md text-gray-600 text-left">¡Este proceso tomará solo unos minutos de tu tiempo!</p>
      <div class="flex flex-row justify-between">
        <router-link
          :to="{ name: 'Dashboard' }"
          class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 cursor-pointer"
          >Omitir</router-link
        >
        <button
          @click="step++"
          class="bg-tertiary-500 hover:bg-orange-700 text-white px-6 py-2 rounded-xl hover:bg-tertiary-600 transition-all cursor-pointer"
        >
          Comenzar
        </button>
      </div>
    </div>

    <!-- Formulario multipasos -->
    <!-- Paso 1 -->
    <div v-if="step === 1" class="space-y-4">
      <h1 class="text-2xl font-bold mb-2 text-center">Datos personales</h1>
      <label class="block mb-2 font-semibold">
        Fecha de nacimiento:
        <input
          type="date"
          v-model="form.fec_nac"
          class="w-full rounded-xl px-4 py-2 mt-1 text-black bg-white"
          required
        />
      </label>
      <label class="block mb-2 font-semibold">
        Género:
        <select v-model="form.genero" class="w-full rounded-xl px-4 py-2 mt-1 text-black bg-white" required>
          <option value="">Seleccione...</option>
          <option value="Hombre">Hombre</option>
          <option value="Mujer">Mujer</option>
          <option value="Otro">Prefiero no especificar</option>
        </select>
      </label>
    </div>

    <!-- Paso 2 -->
    <div v-if="step === 2" class="space-y-4">
      <h1 class="text-2xl font-bold mb-2 text-center">Medidas físicas</h1>
      <label class="block mb-2 font-semibold">
        Peso (kg):
        <input type="text" v-model.number="form.peso" class="w-full rounded-xl px-4 py-2 mt-1 text-black bg-white" required />
      </label>
      <label class="block mb-2 font-semibold">
        Altura (cm):
        <input
          type="text"
          v-model.number="form.altura"
          class="w-full rounded-xl px-4 py-2 mt-1 text-black bg-white"
          required
        />
      </label>
    </div>

    <!-- Paso 3 -->
    <div v-if="step === 3" class="space-y-4">
      <h1 class="text-2xl font-bold mb-2 text-center">Discapacidad reconocida</h1>
      <div class="flex flex-col space-y-3">
        <label class="flex items-center space-x-3">
          <input type="radio" value="no" v-model="form.discapacidad" />
          <span>No tengo discapacidad reconocida</span>
        </label>
        <label class="flex items-center space-x-3">
          <input type="radio" value="0-32" v-model="form.discapacidad" />
          <span>Discapacidad reconocida inferior al 33%</span>
        </label>
        <label class="flex items-center space-x-3">
          <input type="radio" value="33-64" v-model="form.discapacidad" />
          <span>Discapacidad reconocida entre el 33% y el 64%</span>
        </label>
        <label class="flex items-center space-x-3">
          <input type="radio" value="65-100" v-model="form.discapacidad" />
          <span>Discapacidad reconocida superior o igual al 65%</span>
        </label>
      </div>
    </div>

    <!-- Paso 4 -->
    <div v-if="step === 4" class="space-y-4">
      <h1 class="text-2xl font-bold mb-2 text-center">Patologías</h1>
      <div
        v-for="(descripcion, categoria) in patologias"
        :key="categoria"
        class="bg-gray-300 p-3 rounded-2xl text-black mb-3 flex gap-2 items-center"
      >
        <label class="flex items-center space-x-2 mb-1">
          <input
            type="checkbox"
            :value="categoria"
            v-model="form.patologiasSeleccionadas"
            class="w-4 h-4 rounded-2xl"
          />
          <span class="font-semibold">{{ categoria }}</span>
        </label>
        <p class="text-sm text-gray-800">( {{ descripcion }} )</p>
      </div>
    </div>

    <!-- Paso 5 -->
    <div v-if="step === 5" class="space-y-4">
      <h1 class="text-2xl font-bold mb-2 text-center">Revisión de datos</h1>
      <ul class="bg-gray-800 p-4 rounded text-white space-y-1">
        <li><strong>Fecha de Nacimiento:</strong> {{ form.fec_nac }}</li>
        <li><strong>Género:</strong> {{ form.genero }}</li>
        <li><strong>Peso:</strong> {{ form.peso }} kg</li>
        <li><strong>Altura:</strong> {{ form.altura }} cm</li>
        <li><strong>Discapacidad:</strong> {{ form.discapacidad }}</li>
        <li>
          <strong>Patologías:</strong>
          <span v-if="form.patologiasSeleccionadas.length">{{ form.patologiasSeleccionadas.join(", ") }}</span>
          <span v-else>Ninguna</span>
        </li>
      </ul>
    </div>

    <!-- Navegación -->
    <div v-if="step !== 0" class="flex justify-between pt-4">
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
</template>

<script setup>
import { z } from "zod";
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const step = ref(0);
const totalSteps = 5;

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
  fec_nac: "",
  genero: "",
  peso: "",
  altura: "",
  discapacidad: null,
  patologiasSeleccionadas: []
});

const nextStep = () => {
  if (step.value < 5) step.value++;
};

const prevStep = () => {
  if (step.value > 1) step.value--;
};

const enviarFormulario = async (event) => {
  event.preventDefault();

  try {
    const validarFechaNac = (fechaStr) => {
      const fecha = new Date(fechaStr);
      const hoy = new Date();
      const hace120Anios = new Date(hoy.getFullYear() - 120, hoy.getMonth(), hoy.getDate());

      return !isNaN(fecha.getTime()) && fecha <= hoy && fecha >= hace120Anios;
    };

    const infoSchema = z.object({
      fec_nac: z.string().refine(validarFechaNac, {
        message: "Introduce una fecha válida y realista"
      }),

      genero: z.enum(["Hombre", "Mujer", "Otro"], {
        errorMap: () => ({ message: "Selecciona un género válido." })
      }),

      peso: z
        .number({ invalid_type_error: "Peso debe ser un número" })
        .min(1, "Peso debe ser mayor que 0")
        .max(500, "Peso demasiado alto"),

      altura: z
        .number({ invalid_type_error: "Altura debe ser un número" })
        .min(30, "Altura demasiado baja")
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

    axios.post("http://localhost:8081/users/start", form.value, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("log_token")}`
      }
    });
    router.push("/dashboard");
  } catch (error) {
    if (error instanceof z.ZodError) {
      alert("Error de validación front:" + error.errors[0].message);
    } else {
      console.error(error);
      alert("Ha ocurrido un error inesperado");
    }
  }
};
</script>
