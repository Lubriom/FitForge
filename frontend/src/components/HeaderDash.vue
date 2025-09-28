<template>
  <header
    :class="[
      'bg-white rounded-2xl p-3 shadow-[0px_10px_10px_-5px_rgba(0,0,0,0.3)] transition-all duration-100 ease-in-out',
      expanded ? 'md:w-80' : 'md:w-18'
    ]"
    class="h-full flex flex-col w-full items-center gap-0 pl-3"
  >
    <!-- Título y botón -->
    <router-link to="/" class="flex flex-row items-center justify-start h-12 w-full mb-2">
      <img src="/logov3.svg" alt="Logo FitForge" class="w-12 h-12" />
      <div v-if="expanded" class="w-full flex flex-row items-center">
        <h1 class="text-black font-bold ml-1 text-2xl revamped">FitForge</h1>
      </div>
    </router-link>

    <hr class="w-full pb-1 mx-auto border-gray-500 flex" />

    <!-- Navegación -->
    <nav class="flex flex-col h-[calc(100%-60px)] w-full pt-1">
      <ul class="flex flex-col w-full h-fit justify-between items-center text-black gap-2">
        <li class="w-full">
          <router-link
            :to="{ name: 'Dashboard' }"
            exact-active-class="selected-link"
            class="transition-all duration-200 hover:bg-gray-300 bg-transparent opacity-50 hover:opacity-100 w-full h-10 flex items-center justify-start gap-2 px-3 text-center rounded-xl"
          >
            <span><LayoutDashboard /></span>
            <transition name="fade-slide">
              <span v-if="expanded">Dashboard</span>
            </transition>
          </router-link>
        </li>
        <li class="w-full">
          <router-link
            :to="{ name: 'ExercisesTrain' }"
            exact-active-class="selected-link"
            class="transition-all duration-200 hover:bg-gray-300 bg-transparent opacity-50 hover:opacity-100 w-full h-10 flex items-center justify-start gap-2 px-3 text-center rounded-xl"
          >
            <span><Dumbbell /></span>

            <!-- Texto cuando está expandido (sidebar normal) -->
            <transition name="fade-slide">
              <span v-if="expanded">Rutinas</span>
            </transition>
          </router-link>
        </li>
        <li class="w-full">
          <router-link
            :to="{ name: 'Exercises' }"
            exact-active-class="selected-link"
            class="transition-all duration-200 hover:bg-gray-300 bg-transparent opacity-50 hover:opacity-100 w-full h-10 flex items-center justify-start gap-2 px-3 text-center rounded-xl"
          >
            <span><BicepsFlexed /></span>
            <transition name="fade-slide">
              <span v-if="expanded">Ejercicios</span>
            </transition>
          </router-link>
        </li>
        <li class="w-full">
          <router-link
            :to="{ name: 'DashboardStats' }"
            exact-active-class="selected-link"
            class="transition-all duration-200 hover:bg-gray-300 bg-transparent opacity-50 hover:opacity-100 w-full h-10 flex items-center justify-start gap-2 px-3 text-center rounded-xl"
          >
            <span><ChartNoAxesCombined /></span>
            <transition name="fade-slide">
              <span v-if="expanded">Estadisticas</span>
            </transition>
          </router-link>
        </li>
        <li class="w-full">
          <router-link
            v-if="auth.getRole() === 'admin' || auth.getRole() === 'entrenador'"
            :to="{ name: 'DashboardAdmin' }"
            exact-active-class="selected-link"
            class="transition-all duration-200 hover:bg-gray-300 bg-transparent opacity-50 hover:opacity-100 w-full h-10 flex items-center justify-start gap-2 px-3 text-center rounded-xl"
          >
            <span><Shield /></span>
            <transition name="fade-slide">
              <span v-if="expanded">Administración</span>
            </transition>
          </router-link>
        </li>
      </ul>
      <button
        @click="expanded = !expanded"
        :class="[
          'text-white bg-gray-200 hover:bg-gray-300 w-full h-10 rounded-xl flex items-center cursor-pointer mt-auto shadow-md shadow-black/20 inset-shadow-sm inset-shadow-gray-100 active:bg-gray-300/50 active:inset-shadow-gray-400 transition-colores duration-200',
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

const imageURL = ref("");
imageURL.value = `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/pfp/${auth.getImage()}`;
</script>

<style scoped>
.selected-link {
  background-color: #f56e0f;
  opacity: 100%;
  color: white;
  box-shadow:
    inset 0 4px 6px 0px rgba(253, 186, 116, 1),   /* ≈ inset-shadow-orange-200 */
    0 4px 6px -1px rgba(0, 0, 0, 0.3);               /* ≈ shadow-md shadow-black/20 */
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-4px);
}
</style>
