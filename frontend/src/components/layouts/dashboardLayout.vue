<template>
  <div class="flex flex-col h-screen">
    <div class="bg-white p-3 h-full rounded bg-[url(@/assets/imgs/bg.jpg)] bg-cover bg-center bg-no-repeat">
      <div class="flex flex-row h-full gap-3 rounded-2xl overflow-hidden">
        <div>
          <Header />
        </div>

        <main class="w-full flex flex-col rounded-2xl gap-2 overflow-hidden">
          <div class="flex justify-between items-center px-2 pb-1">
            <h1 class="text-black text-2xl font-bold">{{ layoutStore.title }}</h1>
            <div class="flex bg-tertiary-500 p-1 rounded-full shadow-[0px_10px_10px_-5px_rgba(0,0,0,0.3)]">
              <div class="justify-center items-center px-4 hidden sm:flex"><b class="mr-2">Rol:</b> {{ capitalizar( auth.getRole() )}}</div>
              <div class="relative">
                <button
                  @click="toggleDropdown"
                  class="bg-gray-300 p-0.5 w-12 h-12 flex items-center justify-center rounded-full cursor-pointer shadow-[0px_10px_10px_-5px_rgba(0,0,0,0.3)]"
                >
                  <img :src="imageURL" alt="Perfil" class="w-full h-full rounded-full object-cover" />
                </button>

                <transition name="fade-slide">
                  <ul
                    v-if="dropdownOpen"
                    class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                  >
                    <li>
                      <router-link
                        :to="{ name: 'DashboardProfile' }"
                        class="block px-4 py-2 hover:bg-gray-100 rounded-2xl"
                        >Perfil</router-link
                      >
                    </li>
                    <li>
                      <router-link
                        :to="{ name: 'DashboardSettings' }"
                        class="block px-4 py-2 hover:bg-gray-100 rounded-2xl"
                        >Configuración</router-link
                      >
                    </li>
                    <li>
                      <button
                        @click="logout"
                        class="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-2xl cursor-pointer"
                      >
                        Cerrar sesión
                      </button>
                    </li>
                  </ul>
                </transition>
              </div>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto rounded-xl">
            <router-view />
          </div>

          <Footer />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from "../HeaderDash.vue";
import Footer from "../FooterDash.vue";
import { useAuthStore } from "@/utils/auth";
import { ref } from "vue";
import { useLayoutStore } from "@/stores/layoutStore";
import { useRouter } from "vue-router";

const layoutStore = useLayoutStore();
const router = useRouter();
const auth = useAuthStore();

const expanded = ref(false);
const dropdownOpen = ref(false);

const imageURL = ref("");
imageURL.value = `http://localhost:8081/pfp/${auth.getImage()}`;

const logout = () => {
  auth.logout();
  router.push("/");
};

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
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
