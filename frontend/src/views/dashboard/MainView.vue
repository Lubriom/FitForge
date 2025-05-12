<template>
  <div>
    <div class="flex justify-between py-3 rounded-2xl">
      <h1 class="text-black text-2xl pl-2 items-center flex font-bold">
        Hola, <span>{{ '\xa0' }} </span><span>{{ auth.getName() }}!</span>
      </h1>
      <div class="relative">
        <button
          @click="toggleDropdown"
          class="bg-gray-300 w-12 h-12 flex items-center justify-center rounded-full px-3 space-x-2"
        ></button>

        <transition name="fade-slide">
          <ul
            v-if="dropdownOpen"
            class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
          >
            <li>
              <a href="/perfil" class="block px-4 py-2 hover:bg-gray-100 rounded-2xl">Perfil</a>
            </li>
            <li>
              <a href="/configuracion" class="block px-4 py-2 hover:bg-gray-100 rounded-2xl">Configuración</a>
            </li>
            <li>
              <button @click="logout" class="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-2xl">Cerrar sesión</button>
            </li>
          </ul>
        </transition>
      </div>
    </div>
    <div class="flex flex-col rounded-2xl gap-3">
      <div class="flex-row flex gap-3">
        <div class="bg-gray-300/80 p-4 rounded-2xl w-full">
          <div v-if="user">
            <h1 class="text-black font-bold">Datos Personales:</h1>
            <p v-if="user.nombre">Nombre: {{ user.nombre }}</p>
            <p v-if="user.apellido && user.sapellido">Apellidos: {{ user.apellido }} {{ user.sapellido }}</p>
          </div>
        </div>
        <div class="bg-gray-300/80 p-4 rounded-2xl w-full">
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
        <div class="bg-gray-300/80 p-4 rounded-2xl w-full shadow-custom">
          <div class="flex justify-center rounded-3xl flex-col items-center">
            <h1 class="text-black font-bold">Aun no tienes una rutina</h1>
            <p>¿Deseas crear una?</p>
          </div>
        </div>
      </button>

      <BaseModal
        :visible="showModal"
        :component="modalComponent"
        :props="{ nombre: 'Juan', edad: 30 }"
        @close="showModal = false"
      />
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { useAuthStore } from "@/utils/Auth.js";
import { onMounted, ref, defineAsyncComponent, markRaw } from "vue";
import BaseModal from "@/components/basics/Modal.vue";
import { useRouter } from "vue-router";

const showModal = ref(false);
const modalComponent = ref(null);
const router = useRouter();

const openModal = () => {
  modalComponent.value = markRaw(defineAsyncComponent(() => import("@/components/forms/FormPlan.vue")));
  showModal.value = true;
};

const auth = useAuthStore();
const user = ref({});
const userInfo = ref({});
const userPato = ref([]);
const userRutinas = ref([]);

onMounted(async () => {
  const userId = auth.getId();
  const token = auth.getToken();

  try {
    const [response, responseInfo, responsePato, responseRutinas] = await Promise.all([
      axios.get(`http://localhost:8081/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`http://localhost:8081/users/${userId}/info/last`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`http://localhost:8081/users/${userId}/patologias`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`http://localhost:8081/trains/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
    ]);

    user.value = response.data;
    userInfo.value = responseInfo.data;
    userPato.value = responsePato.data;
    userRutinas.value = responseRutinas.data;
    console.log(userRutinas.value);
  } catch (error) {
    console.error("Error al cargar los datos:", error);
  }
});

const dropdownOpen = ref(false);

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

const logout = () => {
  auth.logout();
  router.push("/");
};
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
