<template>
  <div class="max-w-xl mx-auto p-5 text-white">
    <h2 class="text-2xl mb-5">Completa tu perfil</h2>

    <form @submit.prevent="handleSubmit" class="space-y-4 rounded-3xl bg-quaternary-500 p-6">
      <!-- Paso 1 -->
      <div v-if="step === 1" class="space-y-3">
        <label>
          Por favor ingrese su fecha de nacimiento
          <input type="date" v-model="form.fec_nac" class="w-full p-2 rounded text-black bg-white" required />
        </label>
        <label>
          Por favor seleccione su género:
          <select v-model="form.genero" class="w-full p-2 rounded text-black bg-white" required>
            <option value="">Seleccione...</option>
            <option value="Hombre">Hombre</option>
            <option value="Mujer">Mujer</option>
            <option value="Otro">Prefiero no especificar</option>
          </select>
        </label>
      </div>

      <!-- Paso 2 -->
      <div v-if="step === 2" class="space-y-3">
        <label>
          Indique su Peso (kg):
          <input type="text" v-model="form.peso" class="w-full p-2 rounded text-black bg-white" required />
        </label>
        <label>
          Indique su Altura (cm):
          <input type="text" v-model="form.altura" class="w-full p-2 rounded text-black bg-white" required />
        </label>
      </div>

      <!-- Paso 3 - Discapacidad reconocida -->
      <div v-if="step === 3" class="space-y-4">
        <h3 class="text-xl mb-2">¿Tienes una discapacidad reconocida?</h3>

        <div class="flex flex-col space-y-2">
          <label class="flex items-center space-x-2">
            <input type="radio" value="no" v-model="form.discapacidad" />
            <span>No tengo discapacidad reconocida</span>
          </label>

          <label class="flex items-center space-x-2">
            <input type="radio" value="0-32" v-model="form.discapacidad" />
            <span>Discapacidad reconocida inferior al 33%</span>
          </label>

          <label class="flex items-center space-x-2">
            <input type="radio" value="33-64" v-model="form.discapacidad" />
            <span>Discapacidad reconocida entre el 33% y el 64%</span>
          </label>

          <label class="flex items-center space-x-2">
            <input type="radio" value="65-100" v-model="form.discapacidad" />
            <span>Discapacidad reconocida superior o igual al 65%</span>
          </label>
        </div>
      </div>

      <!-- Paso 4 - Patologías -->
      <div v-if="step === 4" class="space-y-4">
        <h3 class="text-xl mb-2 text-white">Selecciona tus patologías (si tienes):</h3>

        <div v-for="(descripcion, categoria) in patologias" :key="categoria" class="bg-gray-800 p-3 rounded text-white">
          <div class="flex items-center space-x-2 mb-1">
            <input type="checkbox" :id="categoria" :value="categoria" v-model="form.patologiasSeleccionadas" />
            <label :for="categoria" class="font-bold">{{ categoria }}</label>
          </div>
          <p class="text-sm text-gray-300">{{ descripcion }}</p>
        </div>
      </div>

      <!-- Paso 5 - Revisión -->
      <div v-if="step === 5" class="space-y-3">
        <h3 class="text-xl">Revisión de Datos</h3>
        <h4 class="text-">¿Estos datos son correctos?</h4>
        <ul class="bg-gray-800 p-4 rounded">
          <li><strong>Fecha de Nacimiento:</strong> {{ form.fec_nac }}</li>
          <li><strong>Género:</strong> {{ form.genero }}</li>
          <li><strong>Peso:</strong> {{ form.peso }} kg</li>
          <li><strong>Altura:</strong> {{ form.altura }} cm</li>
          <li><strong>Discapacidad:</strong> {{ form.discapacidad }}</li>
          <li>
            <strong>Patologías:</strong>
            <span v-if="form.patologiasSeleccionadas.length">
              {{ form.patologiasSeleccionadas.join(", ") }}
            </span>
            <span v-else>Ninguna</span>
          </li>
        </ul>
      </div>

      <!-- Navegación -->
      <div class="flex justify-between pt-4">
        <button
          v-if="step > 1"
          type="button"
          @click="prevStep"
          :disabled="step === 1"
          class="bg-gray-600 px-4 py-2 rounded"
        >
          Anterior
        </button>

        <button v-if="step < 5" type="button" @click="nextStep" class="bg-blue-600 px-4 py-2 rounded">Siguiente</button>

        <button v-else type="submit" class="bg-green-600 px-4 py-2 rounded">Enviar</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { z } from "zod";
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const step = ref(1);

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

const handleSubmit = async (event) => {
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

      peso: z.string().refine((val) => /^\d{1,3}(\.\d{1,2})?$/.test(val), {
        message: "Peso debe ser un número válido (hasta 2 decimales)."
      }),

      altura: z.string().refine((val) => /^\d{2,3}(\.\d{1,2})?$/.test(val), {
        message: "Altura debe ser un número válido en centímetros (hasta 2 decimales)."
      }),

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
    // router.push("/dashboard");
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
