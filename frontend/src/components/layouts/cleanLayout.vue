<template>
  <div class="bg-slate-950 p-0.5 h-screen">
    <div class="bg-black/50 w-full h-full rounded-4xl">
      <button
        @click="volver"
        to="/"
        class="hover:bg-tertiary-500 top-5 left-5 text-white w-12 absolute h-12 flex justify-center items-center z-50 rounded-2xl hover:shadow-inner transition-all duration-200 ease-in-out active:shadow-lg active:translate-y-1 cursor-pointer"
      >
        <ArrowBigLeftDash class="w-10 h-10" />
      </button>
      <main class="flex flex-col justify-center items-center h-full">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ArrowBigLeftDash } from "lucide-vue-next";
import { useRouter } from "vue-router";

const router = useRouter();

const volver = () => {
  router.back();
};
</script>
