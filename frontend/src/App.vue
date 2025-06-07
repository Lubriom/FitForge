<script setup>
import { computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import DefaultLayout from "../src/components/layouts/mainLayout.vue";
import DashboardLayout from "../src/components/layouts/dashboardLayout.vue";
import AuthLayout from "../src/components/layouts/authLayout.vue";
import CleanLayout from "../src/components/layouts/cleanLayout.vue";
import { useAuthStore, decodedToken } from "@/utils/auth.js";

// Layout dinámico
const route = useRoute();
const layoutComponent = computed(() => {
  switch (route.meta.layout) {
    case "dashboard":
      return DashboardLayout;
    case "auth":
      return AuthLayout;
    case "clean":
      return CleanLayout;
    default:
      return DefaultLayout;
  }
});

// Intervalo para chequear token
const authStore = useAuthStore();
let intervalId = null;

onMounted(() => {
  intervalId = setInterval(() => {
    const token = authStore.getToken();
    if (!token) return;

    const decoded = decodedToken(token);
    if (!decoded || !decoded.exp) return;

    const now = Math.floor(Date.now() / 1000);
    authStore.checkTokenExpiry(decoded.exp, now);

    // Puedes añadir un console.log para debug:
    console.log(`Token expira en ${decoded.exp - now} segundos`);
  }, 60 * 1000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <component :is="layoutComponent">
    <router-view />
  </component>
</template>

