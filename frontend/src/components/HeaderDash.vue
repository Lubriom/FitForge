<template>
  <header
    :class="[
      'bg-white rounded-2xl p-3 shadow-[0px_10px_10px_-5px_rgba(0,0,0,0.3)] transition-all duration-100 ease-in-out',
      expanded ? 'w-64' : 'w-18'
    ]"
    class="h-full flex flex-col items-center"
  >
    <!-- Título y botón -->
    <router-link to="/" class="flex flex-row items-center justify-start w-full mb-2">
      <img src="/logov3.svg" alt="Logo FitForge" class="w-12 h-12" />
      <div v-if="expanded" class="flex flex-row items-center">
        <h1 class="text-black font-bold ml-2 text-3xl" style="font-family: var(--font-bangers)">FitForge</h1>
      </div>
    </router-link>

    <hr class="w-full pb-1 mx-auto border-gray-500" />

    <!-- Navegación -->
    <nav class="h-full w-full pt-1">
      <ul class="flex flex-col justify-between h-full text-black">
        <div class="flex flex-col gap-2">
          <li>
            <router-link
              :to="{ name: 'Dashboard' }"
              exact-active-class="active-link"
              class="hover:bg-gray-300 opacity-50 hover:opacity-100 w-full h-10 flex items-center space-x-2 px-3 rounded-xl"
            >
              <span><LayoutDashboard /></span>
              <transition name="fade-slide">
                <span v-if="expanded">Dashboard</span>
              </transition>
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'ExercisesTrain' }"
              exact-active-class="active-link"
              class="hover:bg-gray-300 opacity-50 hover:opacity-100 w-full h-10 flex items-center space-x-2 px-3 rounded-xl"
            >
              <span><Dumbbell /></span>
              <transition name="fade-slide">
                <span v-if="expanded">Rutinas</span>
              </transition>
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'Exercises' }"
              exact-active-class="active-link"
              class="hover:bg-gray-300 opacity-50 hover:opacity-100 w-full h-10 flex items-center space-x-2 px-3 rounded-xl"
            >
              <span><BicepsFlexed /></span>
              <transition name="fade-slide">
                <span v-if="expanded">Ejercicios</span>
              </transition>
            </router-link>
          </li>
          <li>
            <router-link
              :to="{ name: 'DashboardStats' }"
              exact-active-class="active-link"
              class="hover:bg-gray-300 opacity-50 hover:opacity-100 w-full h-10 flex items-center space-x-2 px-3 rounded-xl"
            >
              <span><ChartNoAxesCombined /></span>
              <transition name="fade-slide">
                <span v-if="expanded">Estadisticas</span>
              </transition>
            </router-link>
          </li>
          <li>
            <router-link
              v-if="auth.isAdmin()"
              :to="{ name: 'DashboardAdmin' }"
              exact-active-class="active-link"
              class="hover:bg-gray-300 opacity-50 hover:opacity-100 w-full h-10 flex items-center space-x-2 px-3 rounded-xl"
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
            'text-white bg-gray-200 hover:bg-gray-300 w-full h-10 rounded-xl flex items-center cursor-pointer',
            expanded ? 'justify-end' : 'justify-center'
          ]"
          title="Expandir"
        >
          <span v-if="!expanded">
            <ChevronLeft class="text-slate-900" />
          </span>
          <span v-else>
            <ChevronRight class="text-slate-900" />
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
import { useAuthStore } from "@/utils/auth.js";
import { ChartNoAxesCombined } from "lucide-vue-next";
import logo from "/logov3.svg";

const auth = useAuthStore();

const expanded = ref(false);
const dropdownOpen = ref(false);

const imageURL = ref("");
imageURL.value = `http://localhost:8081/pfp/${auth.getImage()}`;

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
