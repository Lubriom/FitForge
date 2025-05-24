<template>
  <div class="flex flex-col rounded-2xl h-full gap-3">
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-gray-100/50 p-4 rounded-2xl w-full shadow-[0px_10px_10px_-5px_rgba(0,0,0,0.3)]">
        <div v-if="user">
          <h1 class="text-black font-bold">Datos Personales:</h1>
          <p v-if="user.nombre">Nombre: {{ user.nombre }}</p>
          <p v-if="user.apellido && user.sapellido">Apellidos: {{ user.apellido }} {{ user.sapellido }}</p>
        </div>
      </div>
      <div class="bg-gray-100/50 p-4 rounded-2xl w-full shadow-[0px_10px_10px_-5px_rgba(0,0,0,0.3)]">
        <h1 class="text-black font-bold">Datos Fisicos:</h1>
        <div v-if="userInfo">
          <p v-if="userInfo.altura">Altura: {{ userInfo.altura }} cm</p>
          <p v-if="userInfo.peso">Peso: {{ userInfo.peso }} kg</p>
          <p v-if="user.genero">Género: {{ user.genero }}</p>
          <p v-if="userInfo.imc">IMC: {{ userInfo.imc }}</p>
          <p v-if="userInfo.discapacidad">Discapacidad: {{ userInfo.discapacidad }}</p>
          <p>
            Patologías:
            <span v-if="userPato && userPato.length > 0"> {{ userPato.map((p) => p.patologia).join(", ") }}</span
            ><span v-else>Ninguna</span>
          </p>
        </div>
        <div v-else>
          <p>No se encontraron datos fisicos</p>
        </div>
      </div>
    </div>
    <div v-if="userRutinas && userRutinas.length > 0" class="flex-row flex space-x-2">
      <div class="bg-gray-/50 p-4 rounded-2xl w-full">
        <div>
          <h1 class="text-black font-bold">Rutinas:</h1>
          <div v-for="rutina in userRutinas" :key="rutina.id"></div>
        </div>
      </div>
    </div>
    <button v-else class="flex-row flex space-x-2 cursor-pointer" @click="openModal">
      <div class="bg-gray-300/80 p-4 rounded-2xl w-full">
        <div class="flex justify-center rounded-3xl flex-col items-center">
          <h1 class="text-black font-bold">Aun no tienes una rutina</h1>
          <p>¿Deseas crear una?</p>
        </div>
      </div>
    </button>
  </div>
</template>

<script setup>
import axios from "axios";
import { useAuthStore } from "@/utils/Auth.js";
import { onMounted, ref, defineAsyncComponent, markRaw } from "vue";
import { useLayoutStore } from '@/stores/layoutStore'

const auth = useAuthStore();
const layoutStore = useLayoutStore()
layoutStore.setTitle("Bienvenido, " + auth.getName() + ' !')

const showModal = ref(false);
const modalComponent = ref(null);


const openModal = () => {
  modalComponent.value = markRaw(defineAsyncComponent(() => import("@/components/forms/FormPlan.vue")));
  showModal.value = true;
};

const user = ref({});
const userInfo = ref({});
const userPato = ref([]);
const userRutinas = ref([]);
const baseURL = "http://localhost:8081";
const imageURL = ref("");

onMounted(async () => {
  const userId = auth.getId();
  const token = auth.getToken();

  imageURL.value = `http://localhost:8081/pfp/${auth.getImage()}`;

  try {
    const [response, responseInfo, responsePato, responseRutinas] = await Promise.all([
      axios.get(`http://localhost:8081/users/get/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`http://localhost:8081/users/get/${userId}/info/last`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`http://localhost:8081/users/get/${userId}/patologias`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`http://localhost:8081/trains/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
    ]);

    user.value = response.data;
    userInfo.value = responseInfo.data;
    userPato.value = responsePato.data;
    userRutinas.value = responseRutinas.data;
    // console.log(userRutinas.value);
  } catch (error) {
    console.error("Error al cargar los datos:", error);
  }
});
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
