<template>
  <header
    :class="[
      'bg-white rounded-2xl p-3 shadow-[0px_10px_10px_-5px_rgba(0,0,0,0.3)] transition-all duration-100 ease-in-out',
      expanded ? 'w-64' : 'w-18'
    ]"
    class="h-full flex flex-col items-center"
  >
    <!-- Título y botón -->
    <div class="flex flex-row items-center justify-between w-full">
      <transition name="fade-slide">
        <div v-if="expanded" class="items-center">
          <h1 class="text-black font-bold ml-2">FitForge</h1>
        </div>
      </transition>
      <button
        @click="expanded = !expanded"
        :class="['text-white w-full h-10 rounded-xl flex items-center', expanded ? 'justify-end' : 'justify-center']"
        title="Expandir"
      >
        <span v-if="!expanded">
          <ChevronLeft class="text-slate-900" />
        </span>
        <span v-else>
          <ChevronRight class="text-slate-900" />
        </span>
      </button>
    </div>

    <hr class="w-full pb-1 mx-auto border-gray-500" />

    <!-- Navegación -->
    <nav class="h-full w-full pt-1">
      <ul class="flex flex-col justify-between h-full text-black">
        <div class="flex flex-col gap-2">
          <li>
            <router-link
              to="/dashboard"
              exact-active-class="active-link"
              class="hover:bg-gray-300 opacity-50 hover:opacity-100 w-full h-10 flex items-center space-x-2 px-3 rounded-xl hover:shadow-[0px_10px_10px_-5px_rgba(0,0,0,0.3)]"
            >
              <span><LayoutDashboard /></span>
              <transition name="fade-slide">
                <span v-if="expanded">Dashboard</span>
              </transition>
            </router-link>
          </li>
          <li>
            <router-link
              to="/settings"
              exact-active-class="active-link"
              class="hover:bg-gray-300 opacity-50 hover:opacity-100 w-full h-10 flex items-center space-x-2 px-3 rounded-xl hover:shadow-[0px_10px_10px_-5px_rgba(0,0,0,0.3)]"
            >
              <span><ChartNoAxesCombined /></span>
              <transition name="fade-slide">
                <span v-if="expanded">Estadisticas</span>
              </transition>
            </router-link>
          </li>
          <li>
            <router-link
              to="/settings"
              exact-active-class="active-link"
              class="hover:bg-gray-300 opacity-50 hover:opacity-100 w-full h-10 flex items-center space-x-2 px-3 rounded-xl hover:shadow-[0px_10px_10px_-5px_rgba(0,0,0,0.3)]"
            >
              <span><Dumbbell /></span>
              <transition name="fade-slide">
                <span v-if="expanded">Ejercicios</span>
              </transition>
            </router-link>
          </li>
          <li>
            <router-link
              v-if="auth.isAdmin()"
              to="/settings"
              exact-active-class="active-link"
              class="hover:bg-gray-300 opacity-50 hover:opacity-100 w-full h-10 flex items-center space-x-2 px-3 rounded-xl hover:shadow-[0px_10px_10px_-5px_rgba(0,0,0,0.3)]"
            >
              <span><Shield /></span>
              <transition name="fade-slide">
                <span v-if="expanded">Administración</span>
              </transition>
            </router-link>
          </li>
        </div>

        <hr class="w-full pb-1 mx-auto border-gray-500" />
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ChevronLeft } from "lucide-vue-next";
import { ChevronRight } from "lucide-vue-next";
import { LayoutDashboard } from "lucide-vue-next";
import { Dumbbell } from "lucide-vue-next";
import { Shield } from "lucide-vue-next";
import { useAuthStore } from "@/utils/auth.js";
import { ChartNoAxesCombined } from "lucide-vue-next";
import DashboardLayout from "./layouts/dashboardLayout.vue";

const auth = useAuthStore();
const router = useRouter();

const expanded = ref(false);
</script>

<style scoped>
.active-link {
  background-color: #F56E0F;
  opacity: 100%;
  color: white;
}
</style>
