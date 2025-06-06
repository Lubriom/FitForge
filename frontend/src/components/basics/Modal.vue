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
      <div v-show="visible" class="bg-white p-6 rounded-2xl w-2/5 min-w-[300px] relative shadow-2xl">
        <div class="flex flex-row justify-between items-start gap-4">
          <h1 class="text-2xl font-bold">{{ title }}</h1>
          <div class="w-fit h-fit flex justify-center items-center cursor-pointer">
            <button
              class="text-black text-xl bg-red-500 rounded-xl p-1.5 w-fit h-fit flex justify-center items-center cursor-pointer hover:bg-red-700 transition"
              @click="close"
            >
              <X class="text-white" />
            </button>
          </div>
        </div>
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
  title: String,
  component: [Object, Function, String],
  props: Object
});

const emit = defineEmits(["close"]);

const close = () => emit("close");
</script>
