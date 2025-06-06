<template>
  <div class="flex flex-col gap-6 h-full">
    <div class="flex flex-col gap-6 overflow-y-auto pr-2">
      <div class="bg-gray-100 p-4 rounded-2xl border-2 border-tertiary-500 h-fit w-full px-8">
        <Preferencias />
      </div>
      <div class="flex flex-col md:flex-row gap-4">
        <div class="bg-primary-500 text-white p-4 rounded-2xl h-full w-full px-8">
          <Password />
        </div>
        <div class="flex flex-col bg-gray-100 p-4 rounded-2xl w-full h-full px-8 gap-3">
          <h1 class="text-gray-600 font-bold text-2xl">Seguridad:</h1>
          <div class="flex w-full h-full justify-center items-center">
            <button
              @click="openModal"
              class="text-white cursor-pointer bg-red-500 hover:bg-red-800 px-6 py-3 rounded-full w-60 transition"
            >
              Eliminar Cuenta
            </button>
            <BaseModal
              :visible="showModal"
              :component="modalComponent"
              :title="titleModal"
              :props="{}"
              @close="showModal = false"
              class="absolute"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent, markRaw } from "vue";
import { useRouter } from "vue-router";
import Preferencias from "@/components/auths/Preferencias.vue";
import Password from "../../components/auths/Password.vue";
import BaseModal from "@/components/basics/Modal.vue";
import { useLayoutStore } from "@/stores/layoutStore";

const layoutStore = useLayoutStore();
layoutStore.setTitle("Configuración");
const titleModal = "¿Estás seguro que deseas eliminar tu cuenta?";

const router = useRouter();
const showModal = ref(false);
const modalComponent = ref(null);

const openModal = () => {
  const asyncComponent = defineAsyncComponent(() => import("@/components/auths/Deactivate.vue"));
  modalComponent.value = markRaw(asyncComponent); // <- asegúrate que lo marcas antes de pasarlo a un ref
  showModal.value = true;
};

function volverAtras() {
  router.back();
}
</script>
