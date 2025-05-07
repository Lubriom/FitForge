<template>
  <div class="flex flex-col py-5 px-5">
    <h1 class="text-white text-2xl">Iniciar Sesión</h1><br>
    <form @submit="login" class="flex flex-col text-white">
      <label for="email">Correo:</label>
      <input type="email" id="email" v-model="user.correo" class="border p-2 mb-2 bg-white rounded-2xl text-black"/>
      <label for="password">Contraseña:</label>
      <input type="password" id="password" v-model="user.password" class="border p-2 mb-2 bg-white rounded-2xl text-black"/>
      <button type="submit" class="bg-tertiary-500 text-white p-2 rounded-md">Log in</button>
    </form>
  </div>
</template>

<script setup>
import { z } from "zod";
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../utils/auth";

const auth = useAuthStore();
const router = useRouter();
const user = ref({});

const login = async (event) => {
  event.preventDefault();
  try {
    const loginSchema = z.object({
      correo: z.string().email({ message: "Email no válido" }),
      password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    });

    loginSchema.parse(user.value);
    const response = await axios.post("http://localhost:8081/login", user.value);

    if(response.data.token) {
      auth.login(response.data.token);
      alert(response.data.message);
      router.push("/dashboard");
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      alert("Error de validación:" + error.errors[0].message);
    } else {
      console.error(error);
      alert("Ha ocurrido un error inesperado");
    }
  }
};
</script>
