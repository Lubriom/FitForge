<template>
  <h2 class="text-2xl font-semibold mb-6">Editar perfil</h2>
  <form @submit.prevent="guardarCambios" class="w-full">
    <div class="flex flex-col-reverse md:flex-row gap-6 md:gap-12 lg:gap-24 ">
      <div class="flex flex-col w-full gap-3 bg-gray-200 p-4 rounded-2xl">
        <div class="space-y-2">
          <label class="block text-sm font-medium">Nombre</label>
          <input type="text" v-model="form.nombre" class="rounded-xl px-4 py-2 w-full bg-white text-black border border-gray-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all" />
          <span v-if="errors.nombre" class="text-red-500 text-xs mt-1">{{ errors.nombre }}</span>
        </div>
        <div class="flex flex-col lg:flex-row gap-4 ">
          <div class="w-full lg:w-1/2 space-y-2">
            <label class="block text-sm font-medium">Apellido</label>
            <input type="text" v-model="form.apellido" class="rounded-xl px-4 py-2 w-full bg-white text-black border border-gray-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all" />
            <span v-if="errors.apellido" class="text-red-500 text-xs mt-1">{{ errors.apellido }}</span>
          </div>
          <div class="w-full lg:w-1/2 space-y-2">
            <label class="block text-sm font-medium">Segundo apellido</label>
            <input type="text" v-model="form.sapellido" class="rounded-xl px-4 py-2 w-full bg-white text-black border border-gray-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all" />
            <span v-if="errors.sapellido" class="text-red-500 text-xs mt-1">{{ errors.sapellido }}</span>
          </div>
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium">Correo electrónico</label>
          <input type="email" v-model="form.correo" class="rounded-xl px-4 py-2 w-full bg-white text-black border border-gray-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all" />
          <span v-if="errors.correo" class="text-red-500 text-xs mt-1">{{ errors.correo }}</span>
        </div>
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="w-full space-y-2">
            <label class="block text-sm font-medium">Género</label>
            <select v-model="form.genero" class="rounded-xl px-4 py-2 w-full bg-white text-black border border-gray-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all">
              <option value="">Selecciona una opción</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
              <option value="Otro">Otro</option>
            </select>
            <span v-if="errors.genero" class="text-red-500 text-xs mt-1">{{ errors.genero }}</span>
          </div>
          <div class="w-full space-y-2">
            <label class="block text-sm font-medium">Fecha de nacimiento</label>
            <input type="date" v-model="form.fec_nac" class="rounded-xl px-4 py-2 w-full bg-white text-black border border-gray-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all" />
            <span v-if="errors.fec_nac" class="text-red-500 text-xs mt-1">{{ errors.fec_nac }}</span>
          </div>
        </div>

        <button type="submit" class="bg-tertiary-500 hover:bg-orange-700 text-white px-4 py-2 w-full rounded-full cursor-pointer transition">
          Guardar cambios
        </button>
      </div>
      <div class="flex flex-col w-full justify-center items-center md:mr-10 lg:mr-20 relative">
        <div class="p-2 rounded-full bg-tertiary-500">
          <div class="relative w-64 h-64 rounded-full overflow-hidden group cursor-pointer" @click="triggerFileInput">
            <img :src="previewUrl || imageURL" alt="Foto de perfil" class="w-full h-full object-cover" />
            <div
              class="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              Cambiar imagen
            </div>
            <input ref="fileInput" type="file" class="hidden" accept="image/*" @change="handleFileChange" />
          </div>
        </div>
        <p class="mt-2 text-lg">Foto de perfil:</p>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/utils/auth";
import { useRouter } from "vue-router";
import axios from "axios";
import z from "zod";

const router = useRouter();

const auth = useAuthStore();
const form = ref({
  nombre: "",
  apellido: "",
  sapellido: "",
  correo: "",
  genero: "",
  fec_nac: ""
});

const errors = ref({
  nombre: "",
  apellido: "",
  sapellido: "",
  correo: "",
  genero: "",
  fec_nac: ""
});

onMounted(async () => {
  const userId = auth.getId();
  const token = auth.getToken();

  try {
    const { data } = await axios.get(`http://localhost:8081/users/get/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    imageURL.value = `http://localhost:8081/pfp/${data.profile_img}`;

    form.value = {
      nombre: data.nombre || "",
      apellido: data.apellido || "",
      sapellido: data.sapellido || "",
      correo: data.correo || "",
      genero: data.genero || "",
      fec_nac: data.fec_nac ? data.fec_nac.slice(0, 10) : ""
    };
  } catch (error) {
    console.error("Error al cargar los datos del usuario:", error);
  }
});

const guardarCambios = async () => {
  const userId = auth.getId();
  const token = auth.getToken();

  try {
    const validarFechaNac = (fechaStr) => {
      const fecha = new Date(fechaStr);
      const hoy = new Date();
      const hace120Anios = new Date(hoy.getFullYear() - 120, hoy.getMonth(), hoy.getDate());

      return (
        !isNaN(fecha.getTime()) && // válida
        fecha <= hoy && // no futura
        fecha >= hace120Anios // no excesivamente antigua
      );
    };

    const userUpdateSchema = z
      .object({
        nombre: z.string().min(1, "El nombre es requerido").optional(),
        apellido: z.string().min(1, { message: "El primer apellido es requerido" }).optional(),
        sapellido: z.string().min(1, { message: "El segundo apellido es requerido" }).optional(),
        correo: z.string().email("Email no válido").optional(),
        password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }).optional(),
        respassword: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }).optional(),
        fec_nac: z
          .string()
          .refine(validarFechaNac, {
            message: "Introduce una fecha válida y realista (hasta 120 años atrás)."
          })
          .optional(),
        genero: z
          .enum(["Hombre", "Mujer", "Otro"], {
            errorMap: () => ({ message: "Selecciona un género válido." })
          })
          .optional()
      })
      .partial();

    Object.keys(errors.value).forEach((key) => (errors.value[key] = ""));

    // Validación con Zod
    userUpdateSchema.parse(form.value);

    // Llamada al backend
    const response = await axios.patch(`http://localhost:8081/users/update/${userId}`, form.value, {
      headers: { Authorization: `Bearer ${token}` }
    });

    auth.login(response.data.token);

    alert("Cambios guardados correctamente.");

    window.location.reload();
  } catch (error) {
    // Si el error proviene de la validación de Zod
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        if (err.path[0] in errors.value) {
          errors.value[err.path[0]] = err.message;
        }
      });
    } else {
      errors.value.serverError = error.response?.data?.error || "Ha ocurrido un error inesperado.";
    }
  }
};

// Imagen de perfil

const imageURL = ref("");
const fileInput = ref(null);
const previewUrl = ref("");

function triggerFileInput() {
  fileInput.value.click();
}

function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    previewUrl.value = URL.createObjectURL(file);
  }

  uploadImage();
}

async function uploadImage() {
  const file = fileInput.value?.files[0];
  if (!file) {
    alert("Por favor, selecciona una imagen.");
    return;
  }

  const formData = new FormData();
  formData.append("profile_img", file);

  try {
    const userId = auth.getId();
    const token = auth.getToken();

    const response = await axios.patch(`http://localhost:8081/users/update/${userId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });

    auth.login(response.data.token);
    alert("Imagen subida correctamente");
    window.location.reload();
  } catch (error) {
    alert("Error al subir la imagen");
  }
}
</script>
