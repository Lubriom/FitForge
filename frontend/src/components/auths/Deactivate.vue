<template>
  <div class="flex flex-col gap-5">
    <div>
      <p class="italic text-sm text-gray-600 mb-4">Esta accion es irreversible</p>
      <p class="text-center">Al eliminar tu cuenta, perderas todos tus datos incluyendo metricas y entrenamientos</p>
    </div>
    <div class="flex flex-row justify-around">
      <button
        @click="deleteUser"
        :disabled="loading"
        class="bg-red-500 hover:bg-red-700 active:bg-red-200 px-6 py-3 rounded-2xl text-gray-100 hover:text-white transition cursor-pointer"
      >
        Eliminar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/utils/Auth";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const toast = useToast();

const showModal = ref(false);
const loading = ref(false); // Estado para manejar la carga
const auth = useAuthStore();
const user = ref({});
const router = useRouter();

const deleteUser = async () => {
  loading.value = true; // Marca como cargando cuando comienza la solicitud

  const userId = auth.getId();
  const token = auth.getToken();

  try {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/users/delete/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    user.value = response.data;

    auth.logout(); // Método para borrar el estado del usuario desde tu tienda de autenticación

    // Redirige al usuario a la página de login o inicio
    router.push("/login");

    // Cierra el modal
    showModal.value = false;
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    toast.error("Hubo un error al eliminar la cuenta. Intenta nuevamente.");
  } finally {
    loading.value = false; // Termina la carga independientemente de si tuvo éxito o no
  }
};
</script>
