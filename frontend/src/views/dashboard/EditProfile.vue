<template>
  <div class="flex flex-col h-full rounded-2xl gap-3">
    <div class="bg-gray-100 p-4 rounded-2xl max-h-min w-full px-4">
      <div class="flex justify-between">
        <h2 class="text-2xl font-semibold mb-3 pl-6">Datos Personales</h2>
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
      <form @submit.prevent="guardarCambios" class="w-full px-6">
        <div class="flex flex-row gap-24">
          <div class="flex flex-col w-full gap-3">
            <div>
              <label class="block text-sm font-medium">Nombre</label>
              <input type="text" v-model="form.nombre" class="input" />
              <span v-if="errors.nombre" class="text-red-500 text-xs mt-1">{{ errors.nombre }}</span>
            </div>
            <div class="flex flex-row gap-4">
              <div class="w-1/2">
                <label class="block text-sm font-medium">Apellido</label>
                <input type="text" v-model="form.apellido" class="input" />
                <span v-if="errors.apellido" class="text-red-500 text-xs mt-1">{{ errors.apellido }}</span>
              </div>
              <div class="w-1/2">
                <label class="block text-sm font-medium">Segundo apellido</label>
                <input type="text" v-model="form.sapellido" class="input" />
                <span v-if="errors.sapellido" class="text-red-500 text-xs mt-1">{{ errors.sapellido }}</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium">Correo electrónico</label>
              <input type="email" v-model="form.correo" class="input" />
              <span v-if="errors.correo" class="text-red-500 text-xs mt-1">{{ errors.correo }}</span>
            </div>
            <div class="flex flex-row gap-4">
              <div class="w-full">
                <label class="block text-sm font-medium">Género</label>
                <select v-model="form.genero" class="input">
                  <option value="">Selecciona una opción</option>
                  <option value="Hombre">Hombre</option>
                  <option value="Mujer">Mujer</option>
                  <option value="Otro">Otro</option>
                </select>
                <span v-if="errors.genero" class="text-red-500 text-xs mt-1">{{ errors.genero }}</span>
              </div>
              <div class="w-full">
                <label class="block text-sm font-medium">Fecha de nacimiento</label>
                <input type="date" v-model="form.fec_nac" class="input" />
                <span v-if="errors.fec_nac" class="text-red-500 text-xs mt-1">{{ errors.fec_nac }}</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium">Rol</label>
              <select v-model="form.role" class="input">
                <option value="">Selecciona una opcion</option>
                <option value="user">Usuario</option>
                <option value="entrenador">Entrenador</option>
                <option value="admin">Administrador</option>
              </select>
              <span v-if="errors.role" class="text-red-500 text-xs mt-1">{{ errors.role }}</span>
            </div>

            <button type="submit" class="bg-orange-600 hover:bg-tertiary-500 text-white px-4 py-2 w-full rounded-full">
              Guardar cambios
            </button>
          </div>
          <div class="flex flex-col w-1/2 justify-center items-center mr-20 relative">
            <div class="relative w-64 h-64 rounded-full overflow-hidden group cursor-pointer" @click="triggerFileInput">
              <img :src="previewUrl || imageURL" alt="Foto de perfil" class="w-full h-full object-cover" />
              <div
                class="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                Cambiar imagen
              </div>
              <input ref="fileInput" type="file" class="hidden" accept="image/*" @change="handleFileChange" />
            </div>
            <p class="mt-2 text-lg">Foto de perfil:</p>
          </div>
        </div>
      </form>
    </div>
    <div class="flex flex-row gap-3">
      <div class="bg-gray-100 p-4 rounded-2xl max-h-min w-full px-8">
        <div class="flex flex-col">
          <h2 class="text-2xl font-semibold mb-3">Seguridad</h2>

          <div class="flex flex-row justify-between">
            <form @submit.prevent="changePass" class="flex flex-col gap-4 w-full">
              <div class="flex flex-col justify-evenly gap-4 mx-1">
                <div class="w-full">
                  <label class="block text-sm font-medium">Contraseña</label>
                  <input type="text" v-model="userPass.password" class="input" />
                  <span v-if="errorsPass.password" class="text-red-500 text-xs mt-1">{{ errorsPass.password }}</span>
                </div>

                <div class="w-full">
                  <label class="block text-sm font-medium">Repetir contraseña</label>
                  <input type="text" v-model="userPass.respassword" class="input" />
                  <span v-if="errorsPass.respassword" class="text-red-500 text-xs mt-1">{{
                    errorsPass.respassword
                  }}</span>
                </div>
              </div>
              <button type="submit" class="bg-orange-600 hover:bg-tertiary-500 text-white px-4 py-2 rounded-full">
                Cambiar Contraseña
              </button>
            </form>
          </div>
        </div>
      </div>
      <div class="bg-gray-100 p-4 rounded-2xl max-h-min w-full px-8">
        <h2 class="text-2xl font-semibold mb-3">Rutinas</h2>
        <div class="flex flex-col gap-4">
          <div v-if="rutinas.value">
            <p>hola</p>
          </div>
          <div v-else>
            <p>Este usuario aun no posee ninguna rutina</p>
          </div>
          <router-link
            to="/dashboard/crear-rutina"
            class="bg-orange-600 hover:bg-tertiary-500 text-white px-4 py-2 rounded-full"
            >Crear Rutina</router-link
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
import { Trash } from "lucide-vue-next";
import router from "../../routes/Router";

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
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/users/get/${route.params.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

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
  } catch (error) {
    console.error("Error al cargar los datos del usuario:", error);
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

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{7,}$/;

    const userUpdateSchema = z
      .object({
        nombre: z.string().min(3, "El nombre es requerido").optional(),
        apellido: z.string().min(3, { message: "El primer apellido es requerido" }).optional(),
        sapellido: z.string().min(3, { message: "El segundo apellido es requerido" }).optional(),
        correo: z.string().email("Email no válido").optional(),
        password: z
          .string()
          .refine((val) => passwordRegex.test(val), {
            message: "La contraseña debe tener mínimo 7 caracteres, una letra, un número y un carácter especial"
          })
          .optional(),
        respassword: z
          .string()
          .refine((val) => passwordRegex.test(val), {
            message: "La contraseña debe tener mínimo 7 caracteres, una letra, un número y un carácter especial"
          })
          .optional(),
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
    const response = await axios.patch(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/users/update/${route.params.id}`, form.value, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (auth.getId() == route.params.id) auth.login(response.data.token); // si es estrictamente necesario

    layoutStore.setTitle(`Datos de ${form.value.nombre} ${form.value.apellido} ${form.value.sapellido}`);

    alert("Cambios guardados correctamente.");
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
  } finally {
    emit("loading-end");
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

    const passSchema = z.object({
      password: z
        .string()
        .refine((val) => passwordRegex.test(val), {
          message: "La contraseña debe tener mínimo 7 caracteres, una letra, un número y un carácter especial"
        }),
      respassword: z
        .string()
        .refine((val) => passwordRegex.test(val), {
          message: "La contraseña debe tener mínimo 7 caracteres, una letra, un número y un carácter especial"
        })
    });

    Object.keys(errorsPass.value).forEach((key) => (errorsPass.value[key] = ""));

    passSchema.parse(userPass.value);

    if (userPass.value.password !== userPass.value.respassword) {
      errorsPass.value.respassword = "Las contraseñas no coinciden";
      return;
    }
    const response = await axios.patch(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/users/update/${route.params.id}`, userPass.value, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert("Contraseña cambiada con éxito");

    if (response.data.message) alert(response.data.message);
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
    alert("Por favor, selecciona una imagen.");
    return;
  }

  const formData = new FormData();
  formData.append("profile_img", file);

  try {
    const token = auth.getToken();

    const response = await axios.patch(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/users/update/${route.params.id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });

    if (auth.getId() == route.params.id) auth.login(response.data.token);

    layoutStore.setTitle(`Datos de ${form.value.nombre} ${form.value.apellido} ${form.value.sapellido}`);

    alert("Imagen subida correctamente");
    window.location.reload();
  } catch (error) {
    alert("Error al subir la imagen");
  }
}

// Consultar rutinas

const rutinas = ref([]);

onMounted(async () => {
  const token = auth.getToken();
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/trains/user/${route.params.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    rutinas.value = response.data;
  } catch (error) {
    console.error("Error al cargar las rutinas del usuario:", error);
  }
});
</script>

<style scoped>
.input {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  padding: 0.5rem;
}
</style>
