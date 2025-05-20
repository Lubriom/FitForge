<template>
  <div
    ref="formRef"
    class="flex flex-col py-5 px-5 w-md bg-gray-200/20 rounded-2xl shadow-[0px_10px_10px_-5px_rgba(0,0,0,0.3)]"
  >
    <div class="flex flex-col pb-5 px-5 max-w-lg">
      <h1 class="text-white self-center text-3xl font-bold mb-6">Registrarse</h1>

      <form @submit="register" class="flex flex-col gap-4 text-white">
        <!-- Nombre -->
        <div class="flex flex-col">
          <label for="name" class="mb-1 font-semibold text-sm text-white">Nombre</label>
          <input
            type="text"
            id="name"
            v-model="user.nombre"
            placeholder="Tu nombre"
            class="rounded-xl px-4 py-2 bg-quaternary-500 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-quaternary-500 transition-all"
          />
          <span v-if="errors.nombre" class="text-red-500 text-xs mt-1">{{ errors.nombre }}</span>
        </div>

        <!-- Apellidos -->
        <div class="flex flex-row justify-stretch gap-3">
          <div class="flex flex-col gap-2">
            <label for="apellido" class="mb-1 font-semibold text-sm text-white">Primer Apellido</label>
            <input
              type="text"
              id="apellido"
              v-model="user.apellido"
              placeholder="Primer apellido"
              class="rounded-xl px-4 py-2 w-full bg-quaternary-500 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-quaternary-500 transition-all"
            />
            <span v-if="errors.apellido" class="text-red-500 text-xs mt-1">{{ errors.apellido }}</span>
          </div>
          <div class="flex flex-col gap-2">
            <label for="sapellido" class="mb-1 font-semibold text-sm text-white">Segundo Apellido</label>
            <input
              type="text"
              id="sapellido"
              v-model="user.sapellido"
              placeholder="Segundo apellido"
              class="rounded-xl px-4 py-2 w-full bg-quaternary-500 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-quaternary-500 transition-all"
            />
            <span v-if="errors.sapellido" class="text-red-500 text-xs mt-1">{{ errors.sapellido }}</span>
          </div>
        </div>

        <!-- Correo -->
        <div class="flex flex-col">
          <label for="email" class="mb-1 font-semibold text-sm text-white">Correo</label>
          <input
            type="text"
            id="email"
            v-model="user.correo"
            placeholder="tucorreo@ejemplo.com"
            class="rounded-xl px-4 py-2 bg-quaternary-500 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-quaternary-500 transition-all"
          />
          <span v-if="errors.correo" class="text-red-500 text-xs mt-1">{{ errors.correo }}</span>
        </div>

        <!-- Contraseña -->
        <div class="flex flex-row justify-stretch gap-3">
          <div class="flex flex-col w-full gap-2">
            <label for="password" class="mb-1 font-semibold text-sm text-white">Contraseña</label>
            <div class="relative">
              <input
                :type="isPasswordVisible0 ? 'text' : 'password'"
                id="password"
                v-model="user.password"
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
            <span v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</span>
          </div>

          <!-- Confirmar Contraseña -->
          <div class="flex flex-col w-full gap-2">
            <label for="confirmPassword" class="mb-1 font-semibold text-sm text-white">Confirmar Contraseña</label>
            <div class="relative">
            <input
              :type="isPasswordVisible1 ? 'text' : 'password'"
              id="confirmPassword"
              v-model="user.respassword"
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
            <span v-if="errors.respassword" class="text-red-500 text-xs mt-1">{{ errors.respassword }}</span>
          </div>
        </div>

        <!-- Botón -->
        <button
          type="submit"
          class="bg-tertiary-500 hover:bg-tertiary-600 transition-colores duration-200 text-white font-semibold py-2 px-4 rounded-xl mt-2"
        >
          Registrarse
        </button>
      </form>
    </div>

    <button @click="swapSides" class="cursor-pointer opacity-70 hover:opacity-100 text-white">
      <span v-if="isLogin">¿No tienes cuenta? Regístrate</span>
      <span v-else>¿Ya tienes cuenta? Inicia sesión</span>
    </button>
  </div>
</template>

<script setup>
import { z } from "zod";
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/utils/auth";
import { Eye } from "lucide-vue-next";
import { EyeClosed } from "lucide-vue-next";

const router = useRouter();
const auth = useAuthStore();

const emit = defineEmits();
function swapSides() {
  emit("trigger-animation");
}

const isPasswordVisible0 = ref(false);
const isPasswordVisible1 = ref(false);

function togglePasswordVisibility() {
  isPasswordVisible0.value = !isPasswordVisible0.value;
}

function togglePasswordVisibility1() {
  isPasswordVisible1.value = !isPasswordVisible1.value;
}

const user = ref({
  nombre: "",
  apellido: "",
  sapellido: "",
  correo: "",
  password: "",
  respassword: ""
});

const errors = ref({
  nombre: "",
  apellido: "",
  sapellido: "",
  correo: "",
  password: "",
  respassword: "",
  serverError: ""
});

const register = async (event) => {
  event.preventDefault();

  try {
    const registerSchema = z.object({
      nombre: z.string().min(1, { message: "El nombre es requerido" }).nonempty("El nombre es obligatorio"),
      apellido: z
        .string()
        .min(1, { message: "El primer apellido es requerido" })
        .nonempty("El primer apellido es obligatorio"),
      sapellido: z
        .string()
        .min(1, { message: "El segundo apellido es requerido" })
        .nonempty("El segundo apellido es obligatorio"),
      correo: z.string().email({ message: "Email no válido" }).nonempty("El correo es obligatorio"),
      password: z
        .string()
        .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
        .nonempty("La contraseña es obligatoria"),
      respassword: z
        .string()
        .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
        .nonempty("La confirmación de la contraseña es obligatoria")
    });

    // Reset errors
    errors.value = {
      nombre: "",
      apellido: "",
      sapellido: "",
      correo: "",
      password: "",
      respassword: "",
      serverError: ""
    };

    // Validación con Zod
    registerSchema.parse(user.value);

    // Comprobación de que las contraseñas coinciden
    if (user.value.password !== user.value.respassword) {
      errors.value.respassword = "Las contraseñas no coinciden";
      return;
    }

    // Hacer la solicitud al backend
    const response = await axios.post("http://localhost:8081/register", user.value);

    // Si la respuesta tiene un token, proceder con el login
    if (response.data.token) {
      auth.login(response.data.token);
      router.push("/start");
    }
  } catch (error) {
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
</script>
