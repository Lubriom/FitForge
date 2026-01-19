<template>
  <div class="flex flex-col h-[100dvh]">
    <transition name="fade-out">
      <div v-if="loading" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-90">
        <div class="w-16 h-16 border-4 border-tertiary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-lg text-primary-600 font-semibold animate-pulse">Cargando...</p>
      </div>
    </transition>

    <div class="bg-white md:p-3 h-full md:rounded bg-[url(@/assets/imgs/bg.jpg)] bg-cover bg-center bg-no-repeat">
      <div class="flex flex-col-reverse md:flex-row h-full md:gap-3 overflow-hidden">
        <Header class="hidden md:block" />

        <main class="w-full h-full flex flex-col p-0 overflow-hidden">
          
          <!-- Remover el padding pr-2 y el md:px-2 si no se usará el diseño -->
          <div class="flex justify-between items-center p-2 px-3 md:pt-0 md:pb-2 md:bg-transparent bg-gray-100 shadow-lg md:shadow-none">
            <HeaderSmall class="md:hidden block" />
            <p class="text-black text-2xl font-bold">{{ layoutStore.title }}</p>
            <div
              ref="dropdownButton"
              @click="toggleDropdown"
              class="text-white flex bg-tertiary-500 p-1 rounded-full inset-shadow-sm inset-shadow-orange-300 shadow-md shadow-black/20 cursor-pointer"
            >
              <div class="justify-center items-center pr-2 pl-3 hidden md:flex">
                <MenuIcon v-show="!dropdownOpen" class="w-9 h-9" data-aos="fade-out" />
                <X v-show="dropdownOpen" class="w-9 h-9" data-aos="fade-out" />
              </div>

              <div class="relative">
                <div
                  class="bg-gray-300 p-0.5 w-12 h-12 flex items-center justify-center rounded-full cursor-pointer shadow-[0px_10px_10px_-5px_rgba(0,0,0,0.3)]"
                >
                  <img :src="imageURL" alt="Perfil" class="w-full h-full rounded-full object-cover" />
                </div>
              </div>
            </div>
            <transition name="fade-slide">
              <div
                v-show="dropdownOpen"
                ref="dropdownMenu"
                class="absolute right-5 top-17 mt-2 w-64 px-2 bg-white border border-gray-200 rounded-3xl shadow-lg z-20"
              >
                <div class="flex p-1 py-3 flex-col justify-center items-center gap-2">
                  <div
                    class="w-full bg-gray-200 rounded-2xl flex flex-col justify-center items-center gap-2 py-3 shadow-sm shadow-black/20 inset-shadow-sm inset-shadow-gray-100"
                  >
                    <router-link :to="{ name: 'DashboardProfile' }" class="w-30 h-30">
                      <div class="w-30 h-30 flex items-center justify-center rounded-full p-0.5 bg-tertiary-500">
                        <img :src="imageURL" alt="Perfil" class="w-full h-full rounded-full object-cover bg-white" />
                      </div>
                    </router-link>
                    <p class="text-sm font-semibold text-slate-900">
                      {{ auth.getName() }}
                      <span class="text-xs mb-1 text-gray-500">({{ capitalizar(auth.getRole()) }})</span>
                    </p>

                    <router-link
                      :to="{ name: 'DashboardProfile' }"
                      class="bg-tertiary-500 hover:bg-orange-600 transition-colors text-white rounded-xl text-sm px-12 py-1 shadow-md shadow-black/20 inset-shadow-sm inset-shadow-orange-300"
                    >
                      Ver Perfil
                    </router-link>
                    <router-link
                      :to="{ name: 'DashboardSettings' }"
                      class="absolute top-5 left-5 p-1 rounded-xl inset-shadow-sm inset-shadow-gray-400 bg-slate-100"
                      ><Bolt class="text-tertiary-500 hover:text-orange-700 w-7 h-7"
                    /></router-link>
                  </div>
                  <ul class="w-full flex flex-col gap-1">
                    <li>
                      <button
                        @click="logout"
                        class="bg-gray-200 text-red-600 hover:text-red-800 flex items-center justify-between w-full text-center px-4 py-2 hover:bg-gray-200 rounded-2xl cursor-pointer shadow-sm shadow-black/20 inset-shadow-sm inset-shadow-gray-100 active:bg-red-300/50 active:inset-shadow-red-400 transition-colores duration-200"
                      >
                        Cerrar sesión <LogOut class="w-5 h-5" />
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </transition>
          </div>

          <!-- Remover el padding p-3 y el md:p-0 si no se usara el diseño -->
          <div class="flex-1 overflow-y-auto w-full h-full p-3 md:p-0">
            <router-view v-slot="{ Component }">
              <component :is="Component" @loading-start="loading = true" @loading-end="loading = false" />
            </router-view>
          </div>

          <Footer class="mt-2" />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from "../HeaderDash.vue";
import HeaderSmall from "../HeaderDashSmall.vue";
import Footer from "../FooterDash.vue";
import { useAuthStore } from "@/utils/Auth";
import { ref, watch } from "vue";
import { onMounted, onBeforeUnmount } from "vue";
import { useLayoutStore } from "@/stores/layoutStore";
import { useRouter, useRoute } from "vue-router";
import { Bolt, LogOut, Menu, MenuIcon, X, XIcon } from "lucide-vue-next";

const layoutStore = useLayoutStore();
const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const expanded = ref(false);
const loading = ref(true);

const dropdownOpen = ref(false);
const dropdownButton = ref(null); // botón
const dropdownMenu = ref(null); // el menú

watch(route, () => {
  dropdownOpen.value = false;
});

function handleClickOutside(event) {
  const clickedOutside = !dropdownMenu.value?.contains(event.target) && !dropdownButton.value?.contains(event.target);

  if (clickedOutside) {
    dropdownOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const imageURL = ref("");
imageURL.value = `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/pfp/${auth.getImage()}`;

const logout = () => {
  auth.logout();
  router.push("/");
};

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;

  setTimeout(() => {
    if (dropdownOpen.value) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
  }, 10);
}

const capitalizar = (texto) => {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};
</script>

<style scoped>
.active-link {
  background-color: #f56e0f;
  opacity: 100%;
  color: white;
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

.fade-out-leave-active {
  transition: opacity 1s ease 0.2s; /* Solo salida, con delay */
}

.fade-out-leave-to {
  opacity: 0;
}
</style>
