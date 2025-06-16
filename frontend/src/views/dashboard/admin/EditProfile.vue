<template>
  <div class="flex flex-col h-full rounded-2xl gap-3">
    <div class="bg-gray-100 p-4 rounded-2xl max-h-min w-full px-4">
      <div class="flex justify-between">
        <h2 class="text-2xl font-semibold mb-4 pl-6">Datos Personales</h2>
        <button
          v-if="user?.activo == 1"
          @click="openModal"
          class="text-white cursor-pointer bg-red-500 hover:bg-red-800 px-6 py-3 rounded-full w-fit"
        >
          <Trash />
        </button>

        <BaseModal
          :visible="showModal"
          :component="modalComponent"
          :props="{}"
          @close="showModal = false"
          class="absolute"
        />
      </div>
      <form @submit.prevent="guardarCambios" class="w-full px-4">
        <div class="flex flex-col-reverse md:flex-row gap-6 md:gap-12 lg:gap-24">
          <div class="flex flex-col w-full gap-3 bg-gray-200 p-4 rounded-2xl">
            <div class="space-y-2">
              <label class="block text-sm font-medium">Nombre</label>
              <input
                type="text"
                v-model="form.nombre"
                class="rounded-xl px-4 py-2 w-full bg-white text-black border border-gray-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all"
              />
              <span v-if="errors.nombre" class="text-red-500 text-xs mt-1">{{ errors.nombre }}</span>
            </div>
            <div class="flex flex-col lg:flex-row gap-4">
              <div class="w-full lg:w-1/2 space-y-2">
                <label class="block text-sm font-medium">Apellido</label>
                <input
                  type="text"
                  v-model="form.apellido"
                  class="rounded-xl px-4 py-2 w-full bg-white text-black border border-gray-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all"
                />
                <span v-if="errors.apellido" class="text-red-500 text-xs mt-1">{{ errors.apellido }}</span>
              </div>
              <div class="w-full lg:w-1/2 space-y-2">
                <label class="block text-sm font-medium">Segundo apellido</label>
                <input
                  type="text"
                  v-model="form.sapellido"
                  class="rounded-xl px-4 py-2 w-full bg-white text-black border border-gray-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all"
                />
                <span v-if="errors.sapellido" class="text-red-500 text-xs mt-1">{{ errors.sapellido }}</span>
              </div>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium">Correo electrónico</label>
              <input
                type="email"
                v-model="form.correo"
                class="rounded-xl px-4 py-2 w-full bg-white text-black border border-gray-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all"
              />
              <span v-if="errors.correo" class="text-red-500 text-xs mt-1">{{ errors.correo }}</span>
            </div>
            <div class="flex flex-col lg:flex-row gap-4">
              <div class="w-full space-y-2">
                <label class="block text-sm font-medium">Género</label>
                <select
                  v-model="form.genero"
                  class="rounded-xl px-4 py-2 w-full bg-white text-black border border-gray-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="Hombre">Hombre</option>
                  <option value="Mujer">Mujer</option>
                  <option value="Otro">Otro</option>
                </select>
                <span v-if="errors.genero" class="text-red-500 text-xs mt-1">{{ errors.genero }}</span>
              </div>
              <div class="w-full space-y-2">
                <label class="block text-sm font-medium">Fecha de nacimiento</label>
                <input
                  type="date"
                  v-model="form.fec_nac"
                  class="rounded-xl px-4 py-2 w-full bg-white text-black border border-gray-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all"
                />
                <span v-if="errors.fec_nac" class="text-red-500 text-xs mt-1">{{ errors.fec_nac }}</span>
              </div>
            </div>

            <button
              type="submit"
              class="bg-tertiary-500 hover:bg-orange-700 text-white px-4 py-2 w-full rounded-full cursor-pointer transition"
            >
              Guardar cambios
            </button>
          </div>
          <div class="flex flex-col w-full justify-center items-center md:mr-10 lg:mr-20 relative">
            <div class="p-2 rounded-full bg-tertiary-500">
              <div
                class="relative w-64 h-64 rounded-full overflow-hidden group cursor-pointer"
                @click="triggerFileInput"
              >
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
    </div>
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="bg-primary-500 text-white p-4 rounded-2xl max-h-min w-full px-8">
        <div class="flex flex-col">
          <h2 class="text-xl font-semibold mb-6">Cambiar contraseña</h2>

          <div class="flex flex-row justify-between">
            <form @submit.prevent="changePass" class="flex flex-col gap-4 w-full">
              <div class="flex flex-col lg:flex-row justify-evenly gap-4 mx-1">
                <div class="w-full">
                  <label class="block text-sm font-medium mb-2">Contraseña</label>
                  <div class="relative">
                    <input
                      :type="isPasswordVisible0 ? 'text' : 'password'"
                      id="password"
                      v-model="userPass.password"
                      placeholder="********"
                      class="rounded-xl px-4 py-2 w-full bg-quaternary-500 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-quaternary-500 transition-all"
                    />
                    <button
                      type="button"
                      @click="togglePasswordVisibility"
                      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
                    >
                      <span v-if="isPasswordVisible0"><Eye /></span>
                      <span v-else><EyeClosed /></span>
                    </button>
                  </div>
                  <span v-if="errorsPass.password" class="text-red-500 text-xs mt-1">{{ errorsPass.password }}</span>
                </div>

                <div class="w-full">
                  <label class="block text-sm font-medium mb-2">Repetir contraseña</label>
                  <div class="relative">
                    <input
                      :type="isPasswordVisible1 ? 'text' : 'password'"
                      id="confirmPassword"
                      v-model="userPass.respassword"
                      placeholder="********"
                      class="rounded-xl px-4 py-2 w-full bg-quaternary-500 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-quaternary-500 transition-all"
                    />
                    <button
                      type="button"
                      @click="togglePasswordVisibility1"
                      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
                    >
                      <span v-if="isPasswordVisible1"><Eye /></span>
                      <span v-else><EyeClosed /></span>
                    </button>
                  </div>
                  <span v-if="errorsPass.respassword" class="text-red-500 text-xs mt-1">{{ errorsPass.respassword }}</span>
                </div>
              </div>
              <button
                type="submit"
                class="bg-tertiary-500 hover:bg-orange-700 text-white px-4 py-2 rounded-full cursor-pointer transition"
              >
                Cambiar Contraseña
              </button>
            </form>
          </div>
        </div>
      </div>
      <div class="bg-gray-100 p-4 rounded-2xl max-h-min w-full h-fit px-8">
        <h2 class="text-2xl font-semibold mb-3">Rutina Actual</h2>
        <div class="flex flex-col gap-4">
          <div v-if="rutinas && rutinas.length > 0">
            <div class="w-full flex flex-col gap-4 h-48 overflow-y-auto pr-3">
              <router-link
                v-for="rutina in rutinas"
                :to="{ name: 'ExercisesTrainInfo', params: { id: rutina.id } }"
                class="bg-white px-5 py-2 rounded-2xl w-full shadow-md hover:bg-gray-100 transition-all duration-300 text-black font-semibold flex flex-col justify-between h-full space-y-4"
              >
                <div class="flex flex-row gap-2 items-start justify-between">
                  <div class="flex flex-col gap-1">
                    <p class="text-xl font-bold">Nombre: {{ rutina.nombre }}</p>
                    <p class="text-sm text-gray-700">{{ rutina.descripcion }}</p>
                  </div>
                  <div v-if="rutina.activo" class="flex rounded-2xl bg-green-500/50 p-2">Activo</div>
                </div>

                <div class="flex flex-row justify-between text-sm text-gray-800">
                  <div class="flex justify-between w-full">
                    <p><span class="font-semibold">Nivel:</span> {{ capitalizar(rutina.nivel) }}</p>
                    <p><span class="font-semibold">Objetivo:</span> {{ capitalizar(rutina.objetivo) }}</p>
                  </div>
                  <div v-if="rutina.diaActual" class="text-right">
                    <p><span class="font-semibold">Hoy:</span> {{ formatFecha2(rutina.diaActual.fecha) }}</p>
                    <p><span class="font-semibold">Toca:</span> {{ capitalizar(rutina.diaActual.grupoMuscular) }}</p>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
          <p v-else class="text-black/60 italic">Este usuario aún no tiene ninguna rutina registrada</p>
          <router-link
            :to="{ name: 'ExercisesTrainCreateMA', params: { id: route.params.id } }"
            class="bg-white hover:bg-gray-200 text-orange-400 font-medium px-4 py-2 rounded-xl shadow-md self-center w-fit"
            ><span class="flex items-center gap-1"><Plus /> Nuevo Plan </span></router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent, markRaw } from "vue";
import { useAuthStore } from "@/utils/Auth";
import { useRoute } from "vue-router";
import axios from "axios";
import z from "zod";
import { useLayoutStore } from "@/stores/layoutStore";
import BaseModal from "@/components/basics/Modal.vue";
import { Eye, EyeClosed, Plus, Trash } from "lucide-vue-next";
import router from "@/routes/Router";
import { useToast } from "vue-toastification";

const toast = useToast();

const isPasswordVisible0 = ref(false);
const isPasswordVisible1 = ref(false);

function togglePasswordVisibility() {
  isPasswordVisible0.value = !isPasswordVisible0.value;
}

function togglePasswordVisibility1() {
  isPasswordVisible1.value = !isPasswordVisible1.value;
}

const emit = defineEmits(["loading-start", "loading-end"]);
const showModal = ref(false);
const modalComponent = ref(null);

const openModal = () => {
  const asyncComponent = defineAsyncComponent(() => import("@/components/auths/DeactivateOther.vue"));
  modalComponent.value = markRaw(asyncComponent); // <- asegúrate que lo marcas antes de pasarlo a un ref
  showModal.value = true;
};

// Stores
const layoutStore = useLayoutStore();
const route = useRoute();
const auth = useAuthStore();

const user = ref({});
const form = ref({
  nombre: "",
  apellido: "",
  sapellido: "",
  correo: "",
  genero: "",
  fec_nac: "",
  role: ""
});
const rutinas = ref([]);

const errors = ref({
  nombre: "",
  apellido: "",
  sapellido: "",
  correo: "",
  genero: "",
  fec_nac: "",
  role: ""
});

onMounted(async () => {
  emit("loading-start");
  const token = auth.getToken();

  try {
    // Carga usuario
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/users/get/${route.params.id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    user.value = data;
    imageURL.value = `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/pfp/${data.profile_img}`;
    form.value = {
      nombre: data.nombre || "",
      apellido: data.apellido || "",
      sapellido: data.sapellido || "",
      correo: data.correo || "",
      genero: data.genero || "",
      fec_nac: data.fec_nac ? data.fec_nac.slice(0, 10) : "",
      role: data.role
    };
    layoutStore.setTitle("Datos de " + data.nombre + " " + data.apellido + " " + data.sapellido);

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/trains/user/${route.params.id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    rutinas.value = response.data;
    // console.log(rutinaActual.value);
  } catch (error) {
    console.error("Error al cargar los datos o rutinas del usuario:", error);
  } finally {
    emit("loading-end");
  }
});

const guardarCambios = async () => {
  const token = auth.getToken();

  try {
    const validarFechaNac = (fechaStr) => {
      const fecha = new Date(fechaStr);
      const hoy = new Date();
      const hace120Anios = new Date(hoy.getFullYear() - 120, hoy.getMonth(), hoy.getDate());
      return !isNaN(fecha.getTime()) && fecha <= hoy && fecha >= hace120Anios;
    };

    const userUpdateSchema = z
      .object({
        nombre: z.string().min(3, "El nombre es requerido").optional(),
        apellido: z.string().min(3, { message: "El primer apellido es requerido" }).optional(),
        sapellido: z.string().min(3, { message: "El segundo apellido es requerido" }).optional(),
        correo: z.string().email("Email no válido").optional(),
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
          .optional(),
        role: z
          .enum(["admin", "entrenador", "user"], {
            errorMap: () => ({ message: "Selecciona un rol valido." })
          })
          .optional()
      })
      .partial();

    Object.keys(errors.value).forEach((key) => (errors.value[key] = ""));
    userUpdateSchema.parse(form.value);

    // Llamada PATCH
    const response = await axios.patch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/users/update/${route.params.id}`,
      form.value,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (auth.getId() == route.params.id) auth.login(response.data.token); // si es estrictamente necesario

    layoutStore.setTitle(`Datos de ${form.value.nombre} ${form.value.apellido} ${form.value.sapellido}`);

    toast.success("Datos actualizados correctamente.");
    window.location.reload();
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        const field = err.path[0];
        if (field && errors.value[field] !== undefined) {
          errors.value[field] = err.message;
        }
      });
    } else {
      console.error("Error al actualizar:", error);
    }
  }
};

// Cambiar contraseña

const userPass = ref({
  password: "",
  respassword: ""
});

const errorsPass = ref({
  password: "",
  respassword: "",
  serverError: ""
});

const changePass = async (event) => {
  const token = auth.getToken();

  try {
    if (userPass.value.password !== userPass.value.respassword) {
      errorsPass.value.respassword = "Las contraseñas no coinciden.";
      return;
    }
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{7,}$/;

    const passSchema = z.object({
      password: z.string().refine((val) => passwordRegex.test(val), {
        message: "La contraseña debe tener mínimo 7 caracteres, una letra, un número y un carácter especial"
      }),
      respassword: z.string().refine((val) => passwordRegex.test(val), {
        message: "La contraseña debe tener mínimo 7 caracteres, una letra, un número y un carácter especial"
      })
    });

    Object.keys(errorsPass.value).forEach((key) => (errorsPass.value[key] = ""));

    passSchema.parse(userPass.value);

    if (userPass.value.password !== userPass.value.respassword) {
      errorsPass.value.respassword = "Las contraseñas no coinciden";
      return;
    }
    const response = await axios.patch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/users/update/${route.params.id}`,
      userPass.value,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    toast.success("Contraseña actualizada correctamente.");

    if (response.data.message) toast.error(response.data.message);
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        if (err.path[0] in errorsPass.value) {
          errorsPass.value[err.path[0]] = err.message;
        }
      });
    } else {
      errorsPass.value.serverError = error.response?.data?.error || "Ha ocurrido un error inesperado.";
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
    toast.error("Por favor, selecciona una imagen.");
    return;
  }
  const formData = new FormData();
  formData.append("profile_img", file);

  try {
    const token = auth.getToken();

    const response = await axios.patch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/users/update/${route.params.id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      }
    );

    if (auth.getId() == route.params.id) auth.login(response.data.token);

    layoutStore.setTitle(`Datos de ${form.value.nombre} ${form.value.apellido} ${form.value.sapellido}`);

    toast.success("Imagen subida correctamente");
  } catch (error) {
    toast.error("Error al subir la imagen");
  } finally {
    window.location.reload();
  }
}

const capitalizar = (texto) => {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

function formatFecha2(fecha) {
  if (!fecha) return "";
  const opciones = { day: "2-digit", month: "2-digit" };
  return new Intl.DateTimeFormat("es-ES", opciones).format(new Date(fecha));
}

function formatFecha(fechaStr, formato) {
  const date = parseISO(fechaStr);
  return format(date, formato, { locale: es });
}
</script>

<style scoped>
.input {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  padding: 0.5rem;
}
</style>
