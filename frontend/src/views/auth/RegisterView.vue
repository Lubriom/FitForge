<template>
  <div class="flex flex-col pb-5 px-5">
    <h1 class="text-white self-center text-2xl">Registrarse</h1>
    <br />
    <form @submit="register" class="flex flex-col gap-2 text-white">
      <!-- Nombre -->
      <label for="name">Nombre:</label>
      <input type="text" id="name" v-model="user.nombre" class="border p-2 mb-1 bg-white rounded-2xl text-black" />
      <span v-if="errors.nombre" class="text-red-500 text-sm">{{ errors.nombre }}</span>

      <!-- Apellido -->
      <div class="flex flex-row justify-stretch gap-3">
        <div class="flex flex-col w-full gap-2">
          <label for="apellido">Primer Apellido:</label>
          <input
            type="text"
            id="apellido"
            v-model="user.apellido"
            class="border p-2 mb-1 bg-white rounded-2xl text-black w-full"
          />
          <span v-if="errors.apellido" class="text-red-500 text-sm">{{ errors.apellido }}</span>
        </div>
        <div class="flex flex-col w-full gap-2">
          <label for="sapellido">Segundo Apellido:</label>
          <input
            type="text"
            id="sapellido"
            v-model="user.sapellido"
            class="border p-2 mb-1 bg-white rounded-2xl text-black w-full"
          />
          <span v-if="errors.sapellido" class="text-red-500 text-sm">{{ errors.sapellido }}</span>
        </div>
      </div>

      <!-- Correo -->
      <label for="email">Correo:</label>
      <input type="email" id="email" v-model="user.correo" class="border p-2 mb-1 bg-white rounded-2xl text-black" />
      <span v-if="errors.correo" class="text-red-500 text-sm">{{ errors.correo }}</span>

      <!-- Contraseña -->
      <div class="flex flex-row justify-stretch gap-3">
        <div class="flex flex-col w-full gap-2">
          <label for="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            v-model="user.password"
            class="border p-2 mb-1 bg-white rounded-2xl text-black w-full"
          />
          <span v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</span>
        </div>

        <!-- Confirmar Contraseña -->
        <div class="flex flex-col w-full gap-2">
          <label for="confirmPassword">Confirmar Contraseña:</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="user.respassword"
            class="border p-2 mb-1 bg-white rounded-2xl text-black w-full"
          />
          <span v-if="errors.respassword" class="text-red-500 text-sm">{{ errors.respassword }}</span>
        </div>
      </div>

      <button type="submit" class="bg-tertiary-500 text-white p-2 rounded-2xl">Registrarse</button>
    </form>
  </div>
</template>

<script setup>
import { z } from "zod";
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/utils/auth";

const router = useRouter();
const auth = useAuthStore();
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