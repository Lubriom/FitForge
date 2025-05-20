<template>
  <div
    v-show="visible"
    class="fixed top-0 inset-0 bg-black/50 w-full h-full flex justify-center items-center z-50"
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
        <button class="absolute top-2 right-2 text-black text-xl bg-red-500 rounded-2xl p-1" @click="close"><X class="text-white"/></button>
        <component :is="component" v-bind="props" />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import { X } from "lucide-vue-next";

const props = defineProps({
  visible: Boolean,
  component: [Object, Function, String],
  props: Object
});

const emit = defineEmits(["close"]);

const close = () => emit("close");
</script>
