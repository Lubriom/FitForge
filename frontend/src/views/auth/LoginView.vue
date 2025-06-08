<template>
  <div
    ref="formRef"
    class="flex flex-col py-5 px-5 w-sm bg-gray-200/20 rounded-2xl shadow-[0px_10px_10px_-5px_rgba(0,0,0,0.3)]"
  >
    <div class="flex flex-col py-5 px-4 max-w-lg">
      <h1 class="text-white self-center text-3xl font-bold mb-6">Iniciar Sesión</h1>

      <form @submit="login" class="flex flex-col text-white gap-4">
        <!-- Email -->
        <div class="flex flex-col">
          <label for="email" class="mb-1 font-semibold text-sm text-white">Correo electrónico</label>
          <input
            type="text"
            id="email"
            v-model="user.correo"
            placeholder="tucorreo@ejemplo.com"
            class="rounded-xl px-4 py-2 bg-quaternary-500 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-quaternary-500 transition-all"
          />
          <span v-if="errors.correo" class="text-red-500 text-xs mt-1">{{ errors.correo }}</span>
        </div>

        <!-- Password -->
        <div class="flex flex-col">
          <label for="password" class="mb-1 font-semibold text-sm text-white">Contraseña</label>
          <div class="relative">
            <input
              :type="isPasswordVisible ? 'text' : 'password'"
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
              <span v-if="isPasswordVisible"><Eye /></span>
              <span v-else><EyeClosed /></span>
            </button>
          </div>
          <span v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</span>
        </div>

        <!-- Botón -->
        <button
          type="submit"
          class="bg-tertiary-500 hover:bg-tertiary-600 transition-colors duration-200 text-white font-semibold py-2 px-4 rounded-xl mt-2"
        >
          Iniciar Sesión
        </button>
      </form>

      <!-- Error del servidor -->
      <span v-if="errors.serverError" class="text-red-500 text-sm mt-4 text-center">{{ errors.serverError }}</span>
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
import { ref, onMounted, computed } from "vue";
import anime from "animejs";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/utils/Auth";
import { Eye } from "lucide-vue-next";
import { EyeClosed } from "lucide-vue-next";
import { useToast } from "vue-toastification";

const toast = useToast();

const isPasswordVisible = ref(false);

function togglePasswordVisibility() {
  isPasswordVisible.value = !isPasswordVisible.value;
}

const emit = defineEmits();

function swapSides() {
  emit("trigger-animation");
}

const isLogin = computed(() => route.name === "Login");

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const user = ref({
  correo: "",
  password: ""
});

const formRef = ref(null);

const errors = ref({
  correo: "",
  password: "",
  serverError: ""
});

onMounted(() => {
  if (formRef.value) {
    anime({
      targets: formRef.value,
      opacity: [0, 1],
      translateY: [-20, 0],
      duration: 600,
      easing: "easeOutQuad"
    });
  }
});

const login = async (event) => {
  event.preventDefault();

  errors.value = { correo: "", password: "", serverError: "" };

  try {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{7,}$/;

    const loginSchema = z.object({
      correo: z.string().email({ message: "Email no válido" }),
      password: z.string().refine((val) => passwordRegex.test(val), {
        message: "La contraseña debe tener mínimo 7 caracteres, una letra, un número y un carácter especial (abc12*)."
      })
    });

    // Validación con Zod
    loginSchema.parse(user.value);

    // Llamada al backend
    const response = await axios.post(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/login`, user.value);

    if (response.data.token) {
      auth.login(response.data.token);

      toast.success("Sesión iniciada correctamente");

      // Esperar 5 segundos antes de redirigir
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      router.push("/dashboard");
    } else {
      errors.value.serverError = response.data.error;
    }
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
</script>
