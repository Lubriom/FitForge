<template>
  <header class="bg-black/10 text-white px-4 py-2 fixed w-full z-50">
    <nav class="flex flex-row justify-between p-4">
      <!-- Título y botón -->
      <router-link to="/" class="flex flex-row items-center justify-start mb-2">
        <img src="/logov3.svg" alt="Logo FitForge" class="w-12 h-12" />
        <div class="flex flex-row items-center">
          <h1 class="text-white ml-2 text-3xl" style="font-family: var(--font-bangers)">FitForge</h1>
        </div>
      </router-link>
      <ul class="flex gap-4 justify-between items-center">
        <div class="flex gap-2">
          <router-link to="/" class="bg-tertiary-500 text-white rounded-3xl border-orange-700 hover:border-tertiary-500 hover:bg-orange-700 p-3 px-6 font-bold"
            >INICIO</router-link
          >
          <router-link to="/about" class="text-white bg-quaternary-500 hover:bg-quinary-500 py-2 px-5 rounded-full"
            >Sobre Nosotros</router-link
          >
        </div>
        <div v-if="auth.isLoggedIn" class="flex space-x-2">
          <router-link to="/dashboard" class="text-white bg-quaternary-500 hover:bg-quinary-500 py-2 px-5 rounded-full"
            >Dashboard</router-link
          >
          <li>
            <button
              @click="logout"
              class="bg-tertiary-500 text-white rounded-tl-2xl hover:bg-orange-700 p-3 px-6 font-bold"
            >
              Logout
            </button>
          </li>
        </div>
        <div v-else class="flex space-x-2">
          <li>
            <router-link
              to="/login"
              class="bg-tertiary-500 text-white rounded-tl-2xl hover:bg-orange-700 p-3 px-6 font-bold"
              >LOG IN</router-link
            >
          </li>
        </div>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/utils/auth.js";

const auth = useAuthStore();
const router = useRouter();

const logout = () => {
  auth.logout();
  router.push("/");
};
</script>
