<template>
  <header class="text-white px-4 py-2 fixed w-full z-50" :class="[isScrolled ? 'bg-black' : 'bg-black/10']">
    <nav class="flex flex-row justify-between p-4">
      <!-- Título y botón -->
      <router-link to="/" class="flex flex-row items-center justify-start mb-2">
        <img src="/logov3.svg" alt="Logo FitForge" class="w-12 h-12" />
        <div class="flex flex-row items-center">
          <h1 class="text-white ml-2 text-3xl revamped">FitForge</h1>
        </div>
      </router-link>
      <ul class="flex gap-4 justify-between items-center">
        <div class="flex gap-4">
          <router-link
            to="/"
            active-class="bg-tertiary-500 hover:bg-orange-700"
            class="bg-quaternary-500 text-white font-bold text-2xl p-3 px-6 hover:bg-gray-700 brochazo-horizontal transition-all duration-300 anton"
            >INICIO</router-link
          >
          <router-link
            to="/about"
            active-class="router-link-active"
            class="bg-quaternary-500 text-white font-bold text-2xl p-3 px-6 hover:bg-gray-700 brochazo-horizontal transition-all duration-300 anton"
            >Sobre Nosotros</router-link
          >
        </div>
        <div v-if="auth.isLoggedIn" class="flex gap-4">
          <router-link
            to="/dashboard"
            class="bg-quaternary-500 text-white font-bold text-2xl p-3 px-6 hover:bg-gray-700 brochazo-horizontal transition-all duration-300 anton"
            >Dashboard</router-link
          >
          <li>
            <button
              @click="logout"
              class="bg-tertiary-500 text-white font-bold text-2xl p-3 px-6 hover:bg-orange-700 brochazo-horizontal transition-all duration-300 anton"
            >
              Logout
            </button>
          </li>
        </div>
        <div v-else class="flex space-x-2">
          <li>
            <router-link
              to="/login"
              class="bg-tertiary-500 text-white font-bold text-2xl p-3 px-6 hover:bg-orange-700 brochazo-horizontal transition-all duration-300 anton"
            >
              LOG IN
            </router-link>
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

import { onMounted, onBeforeUnmount } from "vue";

const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 300;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style>
.diagonal-slade {
  clip-path: polygon(0% 0%, 100% 0, 100% 10%, 100% 90%, 0% 100%, 0 100%);
}

.brochazo-horizontal {
  clip-path: polygon(
    0% 10%,
    /* Arranca más arriba (menos 30% antes) */ 5% 5%,
    15% 8%,
    25% 0%,
    40% 10%,
    60% 5%,
    75% 15%,
    85% 10%,
    95% 13%,
    100% 10%,
    100% 90%,
    /* Baja más (antes 70%) */ 95% 95%,
    85% 92%,
    75% 98%,
    60% 90%,
    40% 95%,
    25% 85%,
    15% 90%,
    5% 88%,
    0% 90%
  );
}
</style>
