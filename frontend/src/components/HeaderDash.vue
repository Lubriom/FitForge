<template>
  <header
    :class="[
      'bg-white rounded-2xl p-3 shadow-[0px_10px_10px_-5px_rgba(0,0,0,0.3)] transition-all duration-100 ease-in-out',
      expanded ? 'md:w-64' : 'md:w-18'
    ]"
    class="h-fit md:h-full flex flex-row md:flex-col w-full items-center gap-4 md:gap-0 pl-5 md:pl-3"
  >
    <!-- Título y botón -->
    <router-link to="/" class="flex flex-row items-center justify-start w-12 h-12 md:w-full mb-2">
      <img src="/logov3.svg" alt="Logo FitForge" class="w-12 h-12" />
      <div v-if="expanded" class="flex flex-row items-center">
        <h1 class="text-black font-bold ml-1 text-2xl revamped">FitForge</h1>
      </div>
    </router-link>

    <hr class="w-full pb-1 mx-auto border-gray-500 md:flex hidden" />

    <!-- Navegación -->
    <nav class="h-full w-full pt-1">
      <ul class="flex flex-col md:justify-between justify-center md:items-center h-full text-black">
        <div class="flex flex-row md:flex-col items-center justify-evenly md:items-start w-full gap-2">
          <li class="w-full">
            <router-link
              :to="{ name: 'Dashboard' }"
              exact-active-class="active-link"
              class="hover:bg-gray-300 bg-gray-200 md:bg-transparent md:opacity-50 hover:opacity-100 w-full h-10 flex items-center justify-center md:justify-start gap-2 px-3 text-center rounded-xl"
            >
              <span><LayoutDashboard /></span>
              <transition name="fade-slide">
                <span v-if="expanded">Dashboard</span>
              </transition>
              <span class="hidden sm:inline md:hidden">Dashboard</span>
            </router-link>
          </li>
          <li class="w-full">
            <router-link
              :to="{ name: 'ExercisesTrain' }"
              exact-active-class="active-link"
              class="hover:bg-gray-300 bg-gray-200 md:bg-transparent md:opacity-50 hover:opacity-100 w-full h-10 flex items-center justify-center md:justify-start gap-2 px-3 text-center rounded-xl"
            >
              <span><Dumbbell /></span>

              <!-- Texto cuando está expandido (sidebar normal) -->
              <transition name="fade-slide">
                <span v-if="expanded">Rutinas</span>
              </transition>

              <!-- Texto solo en pantallas entre sm y md -->
              <span class="hidden sm:inline md:hidden">Rutinas</span>
            </router-link>
          </li>
          <li class="w-full">
            <router-link
              :to="{ name: 'Exercises' }"
              exact-active-class="active-link"
              class="hover:bg-gray-300 bg-gray-200 md:bg-transparent md:opacity-50 hover:opacity-100 w-full h-10 flex items-center justify-center md:justify-start gap-2 px-3 text-center rounded-xl"
            >
              <span><BicepsFlexed /></span>
              <transition name="fade-slide">
                <span v-if="expanded">Ejercicios</span>
              </transition>
              <span class="hidden sm:inline md:hidden">Ejercicios</span>
            </router-link>
          </li>
          <li class="w-full">
            <router-link
              :to="{ name: 'DashboardStats' }"
              exact-active-class="active-link"
              class="hover:bg-gray-300 bg-gray-200 md:bg-transparent md:opacity-50 hover:opacity-100 w-full h-10 flex items-center justify-center md:justify-start gap-2 px-3 text-center rounded-xl"
            >
              <span><ChartNoAxesCombined /></span>
              <transition name="fade-slide">
                <span v-if="expanded">Estadisticas</span>
              </transition>
              <span class="hidden sm:inline md:hidden">Estadisticas</span>
            </router-link>
          </li>
          <li class="md:w-full">
            <router-link
              v-if="auth.getRole() === 'admin' || auth.getRole() === 'entrenador'"
              :to="{ name: 'DashboardAdmin' }"
              exact-active-class="active-link"
              class="hover:bg-gray-300 opacity-50 hover:opacity-100 w-full h-10 hidden md:flex items-center space-x-2 px-3 rounded-xl"
            >
              <span><Shield /></span>
              <transition name="fade-slide">
                <span v-if="expanded">Administración</span>
              </transition>
            </router-link>
          </li>
        </div>
        <button
          @click="expanded = !expanded"
          :class="[
            'text-white bg-gray-200 hover:bg-gray-300 w-full h-10 rounded-xl hidden md:flex items-center cursor-pointer',
            expanded ? 'justify-end' : 'justify-center'
          ]"
          title="Expandir"
        >
          <span v-if="!expanded">
            <ChevronRight class="text-slate-900" />
          </span>
          <span v-else>
            <ChevronLeft class="text-slate-900" />
          </span>
        </button>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { ChevronLeft } from "lucide-vue-next";
import { ChevronRight } from "lucide-vue-next";
import { LayoutDashboard } from "lucide-vue-next";
import { Dumbbell } from "lucide-vue-next";
import { BicepsFlexed } from "lucide-vue-next";
import { Shield } from "lucide-vue-next";
import { useAuthStore } from "@/utils/Auth";
import { ChartNoAxesCombined } from "lucide-vue-next";
import logo from "/logov3.svg";

const auth = useAuthStore();

const expanded = ref(false);
const dropdownOpen = ref(false);

const imageURL = ref("");
imageURL.value = `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/pfp/${auth.getImage()}`;

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}
</script>

<style scoped>
.active-link {
  background-color: #f56e0f;
  opacity: 100%;
  color: white;
  @apply shadow-[0px_10px_10px_-5px_rgba(0,0,0,0.3)];
}

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
