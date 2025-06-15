<template>
  <div class="w-full max-w-[800px] mx-auto bg-white/90 shadow-lg p-6 rounded-2xl space-y-6 shadow-amber-600">
    <!-- Paso 0: Introducción -->
    <div v-if="step === 0" class="text-center space-y-4 p-4">
      <h1 class="text-3xl font-bold">¡Completar Perfil!</h1>
      <p class="text-lg text-left">Ha llegado la hora de comenzar tu aventura en FitForge completemos tu perfil.</p>
      <p class="text-md text-gray-600 text-left">¡Este proceso tomará solo unos minutos de tu tiempo!</p>
      <div class="flex flex-row justify-end">
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
    <div v-if="step === 1" class="flex flex-col gap-4 w-fit">
      <h1 class="text-2xl font-bold mb-2 text-center">Datos personales</h1>
      <div class="flex flex-col md:flex-row gap-8 justify-center items-center p-0 md:px-4 w-fit">
        <div class="flex flex-col w-full md:w-1/2 gap-3">
          <label class="flex flex-col mb-2 font-semibold">
            <span> Fecha de nacimiento: </span>
            <input
              type="date"
              v-model="form.fec_nac"
              class="w-full rounded-xl px-4 py-2 mt-1 text-black bg-white outline-tertiary-500"
              required
            />
          </label>
          <label class="block mb-2 font-semibold">
            <span>Género:</span>
            <select
              v-model="form.genero"
              class="w-full rounded-xl px-4 py-2 mt-1 text-black bg-white outline-tertiary-500"
              required
            >
              <option value="">Seleccione...</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
              <option value="Otro">Prefiero no especificar</option>
            </select>
          </label>
        </div>
        <div class="flex flex-col w-fit md:w-1/2">
          <h1 class="font-semibold text-lg">¿Por qué necesitamos estos datos?</h1>
          <p class="text-sm text-gray-500">
            En FitForge, nos preocupamos por la seguridad y la privacidad de tus datos personales. Estos datos son
            imprescindibles para brindarte un servicio personalizado y ayudarte a alcanzar tus objetivos de salud y
            bienestar.
          </p>
        </div>
      </div>
    </div>

    <!-- Paso 2 -->
    <div v-if="step === 2" class="space-y-4">
      <h1 class="text-2xl font-bold mb-2 text-center">Medidas físicas</h1>
      <div class="flex flex-col md:flex-row gap-8 justify-center items-center p-0 md:px-4 w-fit">
        <div class="flex flex-col w-full md:w-1/2 gap-3">
          <label class="block mb-2 font-semibold">
            Peso (kg):
            <input
              type="text"
              v-model.number="form.peso"
              class="w-full rounded-xl px-4 py-2 mt-1 text-black bg-white outline-tertiary-500"
              required
            />
          </label>
          <label class="block mb-2 font-semibold">
            Altura (cm):
            <input
              type="text"
              v-model.number="form.altura"
              class="w-full rounded-xl px-4 py-2 mt-1 text-black bg-white outline-tertiary-500"
              required
            />
          </label>
        </div>
        <div class="flex flex-col w-fit md:w-1/2">
          <h1 class="font-semibold text-lg">¿Por qué necesitamos estas medidas?</h1>
          <p class="text-sm text-gray-500">
            Estas medidas las utilizamos para calcular tu IMC (Índice de Masa Corporal) y determinar tu nivel de peso.
          </p>
        </div>
      </div>
    </div>

    <!-- Paso 3 -->
    <div v-if="step === 3" class="space-y-4">
      <h1 class="text-2xl font-bold mb-4 text-center">Discapacidad reconocida</h1>
      <div class="flex flex-col md:flex-row gap-8 justify-center items-center p-0 md:px-4 w-fit">
        <div class="flex flex-col w-full md:w-1/2 gap-3">
          <div class="flex flex-col space-y-3">
            <h1 class="font-semibold text-lg text-center">¿Tienes alguna discapacidad reconocida?</h1>
            <label class="flex items-center space-x-3">
              <input type="radio" value="no" v-model="form.discapacidad" />
              <span class="text-sm">No tengo discapacidad reconocida</span>
            </label>
            <label class="flex items-center space-x-3">
              <input type="radio" value="0-32" v-model="form.discapacidad" />
              <span class="text-sm">Discapacidad reconocida inferior al 33%</span>
            </label>
            <label class="flex items-center space-x-3">
              <input type="radio" value="33-64" v-model="form.discapacidad" />
              <span class="text-sm">Discapacidad reconocida entre el 33% y el 64%</span>
            </label>
            <label class="flex items-center space-x-3">
              <input type="radio" value="65-100" v-model="form.discapacidad" />
              <span class="text-sm">Discapacidad reconocida superior o igual al 65%</span>
            </label>
          </div>
        </div>
        <div class="flex flex-col w-fit md:w-1/2">
          <h1 class="font-semibold text-lg">¿La utilidad de estos datos?</h1>
          <p class="text-sm text-gray-500">
            Recopilar cada uno de estos datos les permite a FitForge y a sus entrenadores ajustar planes según el perfil
            de cada usuario.
          </p>
        </div>
      </div>
    </div>

    <!-- Paso 4 -->
    <div v-if="step === 4" class="space-y-4 h-[500px] overflow-y-auto p-2 md:h-fit">
      <h1 class="text-2xl font-bold mb-4 text-center">Patologías</h1>
      <div class="flex flex-col md:flex-row gap-8 justify-center items-center p-0 md:px-4 w-fit">
        <div class="flex flex-col w-full md:w-1/2 h-[400px]">
          <div class="flex flex-col gap-2 overflow-y-auto pr-3">
            <h1 class="font-semibold text-lg text-center">¿Tienes alguna patología?</h1>
            <div
              v-for="(descripcion, categoria) in patologias"
              :key="categoria"
              class="bg-gray-300 px-4 rounded-2xl text-black flex items-center min-h-[100px]"
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
        <div class="flex flex-col w-fit md:w-1/2">
          <h1 class="font-semibold text-lg">¿Por qué preguntamos por tus patologías?</h1>
          <p class="text-sm text-gray-500">
            Conocer si padeces alguna condición médica o patología es clave para personalizar tus entrenamientos de
            forma segura y efectiva. Esta información nos ayuda a evitar ejercicios contraindicados y a ofrecerte planes
            adaptados a tus necesidades reales, respetando siempre tu salud y bienestar.
          </p>
        </div>
      </div>
    </div>

    <!-- Paso 5 -->
    <div v-if="step === 5" class="w-full flex justify-center items-center flex-col">
      <h1 class="text-2xl font-bold mb-2 text-center">Revisión de datos</h1>
      <h1 class="text-lg text-gray-600 mb-4 text-center">¿Estos datos son correctos? Verifica 2 veces antes de enviar</h1>
      <ul class="bg-gray-800 p-4 rounded text-white space-y-1 w-full">
        <li><strong>Fecha de Nacimiento:</strong> {{ form.fec_nac || "N/A" }}</li>
        <li><strong>Género:</strong> {{ form.genero || "N/A" }}</li>
        <li><strong>Peso:</strong> {{ form.peso !== "" && form.peso !== undefined ? form.peso + " kg" : "N/A" }}</li>
        <li>
          <strong>Altura:</strong> {{ form.altura !== "" && form.altura !== undefined ? form.altura + " cm" : "N/A" }}
        </li>
        <li><strong>Discapacidad:</strong> {{ form.discapacidad || "N/A" }}</li>
        <li>
          <strong>Patologías:</strong>
          <span v-if="form.patologiasSeleccionadas.length">{{ form.patologiasSeleccionadas.join(", ") }}</span>
          <span v-else> Ninguna</span>
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
          id="enviarFormulario"
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
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import { useToast } from "vue-toastification";

const toast = useToast();

const router = useRouter();
const route = useRoute();

const step = ref(0);
const totalSteps = 5;

const rutasPermitidas = () => {
  const rutasOcultas = ["/start"];
  return rutasOcultas.includes(route.path);
};

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
  document.getElementById("enviarFormulario").disabled = true;
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

    toast.success("Formulario enviado correctamente");

    // Esperar 5 segundos antes de redirigir
    await new Promise((resolve) => setTimeout(resolve, 3000));

    axios.post(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/users/start`, form.value, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("log_token")}`
      }
    });
    router.push("/dashboard");
  } catch (error) {
    if (error instanceof z.ZodError) {
      toast.error(error.issues[0].message);
    } else {
      console.error(error);
      toast.error("Ha ocurrido un error inesperado")
    }
  } finally {
    document.getElementById("enviarFormulario").disabled = false;
  }
};
</script>
