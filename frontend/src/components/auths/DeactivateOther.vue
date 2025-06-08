<template>
  <div class="flex flex-col gap-5">
    <div>
      <h1>¿Estás seguro que deseas eliminar tu cuenta?</h1>
    </div>
    <div class="flex flex-row justify-around">
      <button
        @click="deleteUser"
        :disabled="loading"
        class="bg-red-500 hover:bg-red-600 active:bg-red-700 px-6 py-3 rounded-full text-gray-100 hover:text-white"
      >
        Eliminar
      </button>
      <button
        @click="showModal = false"
        :disabled="loading"
        class="bg-gray-500 hover:bg-gray-600 active:bg-gray-700 px-6 py-3 rounded-full"
      >
        Cancelar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/utils/Auth";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";

const showModal = ref(false);
const loading = ref(false); // Estado para manejar la carga
const auth = useAuthStore();
const user = ref({});
const route = useRoute();
const router = useRouter();

const deleteUser = async () => {
  loading.value = true; // Marca como cargando cuando comienza la solicitud

  const token = auth.getToken();

  try {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/users/delete/${route.params.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    user.value = response.data;

    // Redirige al usuario a la página de login o inicio
    router.back();

    // Cierra el modal
    showModal.value = false;
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    alert("Hubo un error al eliminar la cuenta. Intenta nuevamente.");
  } finally {
    loading.value = false; // Termina la carga independientemente de si tuvo éxito o no
  }
};
</script>
