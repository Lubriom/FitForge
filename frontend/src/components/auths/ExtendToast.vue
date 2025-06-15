<template>
  <div class="p-4 bg-white rounded text-black shadow-md w-full">
    <p>Tu sesión está a punto de expirar, ¿quieres extenderla?</p>
    <div class="mt-3 flex gap-3 justify-end">
      <button
        @click="handleExtend"
        class="bg-tertiary-500 hover:bg-orange-700 text-white px-4 p-2 rounded-xl cursor-pointer"
      >
        Extender
      </button>
      <button @click="handleLogout" class="bg-red-600 hover:bg-red-800 text-white px-4 p-2 rounded-xl cursor-pointer">
        Cerrar sesión
      </button>
    </div>
  </div>
</template>

<script setup>
import { useToast } from "vue-toastification";

const toast = useToast();

const props = defineProps({
  onExtend: Function,
  onLogout: Function,
  toastId: [String, Number] // <-- Necesitamos esto para poder cerrarlo manualmente
});

function handleExtend() {
  props.onExtend();
  toast.dismiss(props.toastId); // Cierra el toast con su ID
}

function handleLogout() {
  props.onLogout();
  toast.dismiss(props.toastId); // También lo cierra aquí
}
</script>
