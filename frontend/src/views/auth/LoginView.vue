<template>
  <div ref="formRef" class="flex flex-col py-5 px-5">
    <h1 class="text-white self-center text-2xl">Iniciar Sesión</h1>
    <br />
    <form @submit="login" class="flex flex-col text-white gap-2">
      <label for="email">Correo:</label>
      <input type="text" id="email" v-model="user.correo" class="border p-2 mb-1 bg-white rounded-2xl text-black" />
      <span v-if="errors.correo" class="text-red-500 text-sm mb-2">{{ errors.correo }}</span>

      <label for="password">Contraseña:</label>
      <input
        type="password"
        id="password"
        v-model="user.password"
        class="border p-2 mb-1 bg-white rounded-2xl text-black"
      />
      <span v-if="errors.password" class="text-red-500 text-sm mb-2">{{ errors.password }}</span>

      <button type="submit" class="bg-tertiary-500 text-white p-2 rounded-2xl">Iniciar Sesión</button>
    </form>

    <!-- Mostrar errores del backend -->
    <span v-if="errors.serverError" class="text-red-500 text-sm mt-2">{{ errors.serverError }}</span>
  </div>
</template>

<script setup>
import { z } from "zod";
import axios from "axios";
import { ref, onMounted } from "vue";
import anime from "animejs";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/utils/auth";

const auth = useAuthStore();
const router = useRouter();
const user = ref({});

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
    const loginSchema = z.object({
      correo: z.string().email({ message: "Email no válido" }).nonempty("El correo es obligatorio"),
      password: z
        .string()
        .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
        .nonempty("La contraseña es obligatoria")
    });

    // Validación con Zod
    loginSchema.parse(user.value);

    // Llamada al backend
    const response = await axios.post("http://localhost:8081/login", user.value);

    if (response.data.token) {
      auth.login(response.data.token);
      alert(response.data.message);
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
