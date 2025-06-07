<template>
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

          <div class="w-full">
            <label class="block text-sm font-medium mb-2">Repetir contraseña</label>
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
        <button type="submit" class="bg-tertiary-500 hover:bg-orange-700 text-white px-4 py-2 rounded-full cursor-pointer transition">
          Cambiar Contraseña
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/utils/auth";
import axios from "axios";
import { useRouter } from "vue-router";
import { z } from "zod";
import { Eye, EyeClosed } from "lucide-vue-next";

const auth = useAuthStore();
const router = useRouter();

const isPasswordVisible0 = ref(false);
const isPasswordVisible1 = ref(false);

function togglePasswordVisibility() {
  isPasswordVisible0.value = !isPasswordVisible0.value;
}

function togglePasswordVisibility1() {
  isPasswordVisible1.value = !isPasswordVisible1.value;
}

const user = ref({
  password: "",
  respassword: ""
});

const errors = ref({
  password: "",
  respassword: "",
  serverError: ""
});

const changePass = async (event) => {
  const userId = auth.getId();
  const token = auth.getToken();

  try {
    const passSchema = z.object({
      password: z
        .string()
        .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
        .nonempty("La contraseña es obligatoria"),
      respassword: z
        .string()
        .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
        .nonempty("La confirmación de la contraseña es obligatoria")
    });

    Object.keys(errors.value).forEach((key) => (errors.value[key] = ""));

    passSchema.parse(user.value);

    if (user.value.password !== user.value.respassword) {
      errors.value.respassword = "Las contraseñas no coinciden";
      return;
    }
    const response = await axios.patch(`http://localhost:8081/users/update/${userId}`, user.value, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert("Contraseña cambiada con éxito");

    if (response.data.message) alert(response.data.message);
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

<style scoped>
.input {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  padding: 0.5rem;
}
</style>
