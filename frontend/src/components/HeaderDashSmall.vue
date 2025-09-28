<template>
  <header>
    <button
      @click="expanded = !expanded"
      class="flex flex-row items-center justify-start w-fit rounded-2xl p-2 bg-tertiary-500 inset-shadow-sm inset-shadow-orange-200 shadow-md shadow-black/20 active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-200 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer"
    >
      <MenuIcon class="h-9 w-9 text-white" />
    </button>
    <div v-if="expanded" class="w-full h-full bg-black/80 z-50 absolute top-0 left-0" data-aos="fade" data-aos-delay="300"></div>
    <transition :name="`fade-slide-${direction}`">
      <div
        class="sm:w-[calc(100%-80px)] w-[calc(100%-40px)] h-full bg-gray-300 flex flex-col gap-2 z-51 absolute top-0 left-0"
        v-if="expanded"
      >
        <div class="flex flex-row justify-between items-center p-2 px-3 bg-gray-100 shadow-md">
          <router-link :to="{ name: 'Home' }">
            <img :src="logo" alt="Logo" class="w-13 h-13" />
          </router-link>
          <h1 class="text-black font-bold text-2xl sm:text-3xl revamped">FitForge</h1>
          <button
            @click="expanded = !expanded"
            class="w-fit rounded-2xl p-2 bg-tertiary-500 inset-shadow-sm inset-shadow-orange-200 shadow-md shadow-black/20 active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-200 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer"
          >
            <X class="w-8 h-8 font-bold text-white" />
          </button>
        </div>
        <div class="flex flex-col justify-between items-center h-full w-full">
          <ul class="flex flex-col p-2 w-full h-full items-center text-black gap-2">
            <li class="w-full">
              <router-link
                :to="{ name: 'Dashboard' }"
                exact-active-class="selected-link"
                class="transition-all duration-200 hover:bg-gray-100 bg-transparent opacity-50 hover:opacity-100 w-full h-10 flex items-center justify-start gap-2 px-3 text-center rounded-xl"
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
                class="transition-all duration-200 hover:bg-gray-100 bg-transparent opacity-50 hover:opacity-100 w-full h-10 flex items-center justify-start gap-2 px-3 text-center rounded-xl"
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
                class="transition-all duration-200 hover:bg-gray-100 bg-transparent opacity-50 hover:opacity-100 w-full h-10 flex items-center justify-start gap-2 px-3 text-center rounded-xl"
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
                class="transition-all duration-200 hover:bg-gray-100 bg-transparent opacity-50 hover:opacity-100 w-full h-10 flex items-center justify-start gap-2 px-3 text-center rounded-xl"
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
                class="transition-all duration-200 hover:bg-gray-100 bg-transparent opacity-50 hover:opacity-100 w-full h-10 flex items-center justify-start gap-2 px-3 text-center rounded-xl"
              >
                <span><Shield /></span>
                <transition name="fade-slide">
                  <span v-if="expanded">Administración</span>
                </transition>
              </router-link>
            </li>
          </ul>
          <p class="text-gray-900 mb-1">Copyright © 2025 FitForge</p>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ChevronLeft, Menu, MenuIcon, X } from "lucide-vue-next";
import { ChevronRight } from "lucide-vue-next";
import { LayoutDashboard } from "lucide-vue-next";
import { Dumbbell } from "lucide-vue-next";
import { BicepsFlexed } from "lucide-vue-next";
import { Shield } from "lucide-vue-next";
import { useAuthStore } from "@/utils/Auth";
import { ChartNoAxesCombined } from "lucide-vue-next";
import logo from "/logov3.svg";

const auth = useAuthStore();
const route = useRoute();
const expanded = ref(false);

// Usada para la animación
const direction = ref("right");

watch(expanded, (newVal) => {
  direction.value = newVal ? "right" : "left";
});

watch(expanded, () => {
  console.log(expanded.value);
});

watch(route, () => {
  expanded.value = !expanded;
});

const imageURL = ref("");
imageURL.value = `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/pfp/${auth.getImage()}`;
</script>

<style scoped>
.selected-link {
  background-color: #f56e0f;
  opacity: 100%;
  color: white;
  box-shadow: inset 0 4px 6px 0px rgba(253, 186, 116, 1),
    /* ≈ inset-shadow-orange-300 */ 0 4px 6px -1px rgba(0, 0, 0, 0.3); /* ≈ shadow-md shadow-black/20 */
}

.fade-slide-right-enter-active,
.fade-slide-left-leave-active {
  transition: transform 0.8s ease-in-out;
}

.fade-slide-right-enter-from {
  transform: translateX(-774px); /* entra desde la izquierda */
}
.fade-slide-right-enter-to {
  transform: translateX(0);
}

.fade-slide-left-leave-from {
  transform: translateX(0);
}
.fade-slide-left-leave-to {
  transform: translateX(-774px); /* sale hacia la izquierda */
}
</style>
