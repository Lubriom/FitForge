<template>
  <div
    v-show="visible"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
    @click.self="close"
  >
    <Transition
      appear
      enter-active-class="transition transform duration-300 ease-out"
      enter-from-class="opacity-0 scale-90"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition transform duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-90"
    >
      <div v-show="visible" class="bg-white p-6 rounded-2xl w-1/2 relative shadow-2xl">
        <button class="absolute top-2 right-2 text-black text-xl bg-red-500 rounded-2xl p-2" @click="close">&times;</button>
        <component :is="component" v-bind="props" />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  visible: Boolean,
  component: [Object, Function, String],
  props: Object
});

const emit = defineEmits(["close"]);

const close = () => emit("close");
</script>
