<template>
  <header class="text-white p-5 fixed w-full z-50 transition-all duration-300 ease-in-out" :class="headerBgClass">
    <nav class="flex flex-wrap justify-between items-center">
      <!-- Logo -->
      <router-link to="/" class="flex items-center space-x-2">
        <img src="/logov3.svg" alt="Logo FitForge" class="w-10 h-10" />
        <h1 class="text-white text-2xl lg:text-3xl revamped">FitForge</h1>
      </router-link>

      <!-- Botón hamburguesa animado -->
      <button
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="lg:hidden focus:outline-none relative w-10 h-10 flex justify-center items-center"
      >
        <span
          class="block absolute h-0.5 w-8 bg-white transform transition duration-500 ease-in-out"
          :class="{
            'rotate-45 translate-y-0': isMobileMenuOpen,
            '-translate-y-2': !isMobileMenuOpen
          }"
        ></span>
        <span
          class="block absolute h-0.5 w-8 bg-white transform transition duration-500 ease-in-out"
          :class="{
            'opacity-0': isMobileMenuOpen,
            'translate-y-0': true
          }"
        ></span>
        <span
          class="block absolute h-0.5 w-8 bg-white transform transition duration-500 ease-in-out"
          :class="{
            '-rotate-45 -translate-y-0': isMobileMenuOpen,
            'translate-y-2': !isMobileMenuOpen
          }"
        ></span>
      </button>

      <!-- Menú completo con transición -->
      <Transition
        enter-active-class="transition-all duration-800 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-800 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <ul
          v-show="isMobileMenuOpen || !isMobile"
          class="w-full lg:w-auto lg:flex items-center justify-end gap-4 mt-4 lg:mt-0"
          :class="{
            block: isMobileMenuOpen,
            hidden: !isMobileMenuOpen && isMobile,
            'lg:flex': true
          }"
        >
          <li>
            <router-link
              to="/"
              active-class="bg-tertiary-500 hover:bg-orange-700"
              class="block lg:inline bg-gray-600 text-white font-bold text-xl lg:text-2xl p-3 px-6 hover:bg-gray-700 brochazo-horizontal transition-all duration-300 anton"
              >INICIO</router-link
            >
          </li>
          <li>
            <router-link
              to="/about"
              active-class="router-link-active"
              class="block lg:inline bg-gray-600 text-white font-bold text-xl lg:text-2xl p-3 px-6 hover:bg-gray-700 brochazo-horizontal transition-all duration-300 anton"
              >Sobre Nosotros</router-link
            >
          </li>
          <template v-if="auth.isLoggedIn">
            <li>
              <router-link
                to="/dashboard"
                class="block lg:inline bg-gray-600 text-white font-bold text-xl lg:text-2xl p-3 px-6 hover:bg-gray-700 brochazo-horizontal transition-all duration-300 anton"
                >Dashboard</router-link
              >
            </li>
            <li>
              <button
                @click="logout"
                class="block lg:inline bg-tertiary-500 text-white font-bold text-xl lg:text-2xl p-3 px-6 hover:bg-orange-700 brochazo-horizontal transition-all duration-300 anton cursor-pointer"
              >
                Logout
              </button>
            </li>
          </template>
          <template v-else>
            <li>
              <router-link
                to="/login"
                class="block lg:inline bg-tertiary-500 text-white font-bold text-xl lg:text-2xl p-3 px-6 hover:bg-orange-700 brochazo-horizontal transition-all duration-300 anton"
                >LOG IN</router-link
              >
            </li>
          </template>
        </ul>
      </Transition>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/utils/Auth.js";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const logout = () => {
  auth.logout();
  router.push("/");
};

const isMobileMenuOpen = ref(false);
const isMobile = ref(window.innerWidth <= 1024); // lg:1024px
const isScrolled = ref(false);

const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 1024;
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 300 && !isMobileMenuOpen.value;
};

onMounted(() => {
  window.addEventListener("resize", updateIsMobile);
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateIsMobile);
  window.removeEventListener("scroll", handleScroll);
});

// Computed que detecta si la ruta actual es home
const isHomeRoute = computed(() => route.path === "/");

// Computed para clases del fondo del header
const headerBgClass = computed(() => {
  if (!isHomeRoute.value) {
    // Si NO es home, siempre fondo negro
    return "bg-black";
  } else {
    // Si es home, comportamiento original
    if (isMobile.value) return "bg-black";
    if (isScrolled.value) return "bg-black";
    return "bg-black/10";
  }
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
