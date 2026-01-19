<!-- components/BotonGenerico.vue -->
<template>
  <button
    :type="type"
    @click="handleClick"
    class="w-full bg-tertiary-500 hover:bg-tertiary-600 text-white font-semibold py-2 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-200"
  >
    {{ label }}
  </button>
</template>

<script setup>
defineProps({
  label: String,
  type: {
    type: String,
    default: "button" // o 'submit' si quieres que lo sea por defecto
  },
  onClick: Function // función que le pasas desde el padre
});

const emit = defineEmits(["click"]);

function handleClick(event) {
  // Emitimos si se necesita también, pero ejecutamos directamente
  if (typeof onClick === "function") {
    onClick(event);
  }
  emit("click", event);
}
</script>
