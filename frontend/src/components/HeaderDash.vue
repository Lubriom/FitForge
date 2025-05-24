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
      <div v-if="expanded" class="items-center">
        <h1 class="text-black font-bold ml-2">FitForge</h1>
      </div>
      <button
        @click="expanded = !expanded"
        :class="[
          'text-white w-full h-10 rounded-xl flex items-center cursor-pointer',
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
    </div>

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
              to="/settings"
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
        <div class="flex flex-col">
          <hr class="w-full pb-2 mx-auto border-gray-500" />
          <div class="relative flex">
            <button
              @click="toggleDropdown"
              class="bg-gray-300 w-12 h-12 flex items-center justify-start rounded-full cursor-pointer space-x-2 shadow-[0px_10px_10px_-5px_rgba(0,0,0,0.3)]"
            >
              <img alt="Imagen de perfil" :src="imageURL" class="w-full h-full rounded-full object-cover z-3" />
              <div
                class="absolute flex items-center bg-gray-300 w-full h-12 rounded-full"
                :class="{ 'pl-2': !expanded, 'pl-14': expanded }"
              >
                <span v-if="expanded">{{ auth.getName() }}</span>
              </div>
            </button>

            <!-- <transition name="fade-slide"> </transition> -->
            <transition name="fade-slide">
              <ul
                v-if="dropdownOpen"
                class="absolute left-10 bottom-10 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
              >
                <li>
                  <router-link :to="{ name: 'DashboardProfile' }" class="block px-4 py-2 hover:bg-gray-100 rounded-2xl">Perfil</router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'DashboardSettings' }" class="block px-4 py-2 hover:bg-gray-100 rounded-2xl">Configuración</router-link>
                </li>
                <li>
                  <button @click="logout" class="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-2xl">
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </transition>
          </div>
        </div>
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
