<template>
  <div class="flex flex-col py-5 px-5">
    <h1 class="text-white text-2xl">Registrarse</h1>
    <br />
    <form @submit="register" class="flex flex-col text-white">
      <label for="name">Nombre:</label>
      <input type="text" id="name" v-model="user.nombre" class="border p-2 mb-2 bg-white rounded-2xl text-black" />
      <div class="flex flex-row justify-stretch space-x-3">
        <div class="flex flex-col w-full">
          <label for="apellido">Primer Apellido:</label>
          <input
            type="text"
            id="apellido"
            v-model="user.apellido"
            class="border p-2 mb-2 bg-white rounded-2xl text-black w-full"
          />
        </div>
        <div class="flex flex-col w-full">
          <label for="sapellido">Segundo Apellido:</label>
          <input
            type="text"
            id="sapellido"
            v-model="user.sapellido"
            class="border p-2 mb-2 bg-white rounded-2xl text-black w-full"
          />
        </div>
      </div>
      <label for="email">Correo:</label>
      <input type="email" id="email" v-model="user.correo" class="border p-2 mb-2 bg-white rounded-2xl text-black" />
      <div class="flex flex-row justify-stretch space-x-3">
        <div class="flex flex-col w-full">
          <label for="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            v-model="user.password"
            class="border p-2 mb-2 bg-white rounded-2xl text-black"
          />
        </div>
        <div class="flex flex-col w-full">
          <label for="confirmPassword">Confirmar Contraseña:</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="user.respassword"
            class="border p-2 mb-2 bg-white rounded-2xl text-black"
          />
        </div>
      </div>
      <button type="submit" class="bg-tertiary-500 text-white p-2 rounded-md">Registrarse</button>
    </form>
  </div>
</template>

<script setup>
import { z } from "zod";
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../utils/auth";

const router = useRouter();
const auth = useAuthStore();
const user = ref({});

const register = async (event) => {
  event.preventDefault();

  try {
    const registerSchema = z.object({
      nombre: z.string().min(1, { message: "El nombre es requerido" }),
      apellido: z.string().min(1, { message: "El primer apellido es requerido" }),
      sapellido: z.string().min(1, { message: "El segundo apellido es requerido" }),
      correo: z.string().email({ message: "Email no válido" }),
      password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
      respassword: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    });

    registerSchema.parse(user.value);

    if (user.value.password !== user.value.respassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const response = await axios.post("http://localhost:8081/register", user.value);

    if (response.data.token) {
      alert(response.data.message);
      auth.login(response.data.token);
      router.push("/start");
    }
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
