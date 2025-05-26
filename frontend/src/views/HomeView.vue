<template>
  <div class="relative flex h-[35rem] flex-col w-full backface-hidden overflow-hidden text-white shadow-md">
    <div class="absolute bg-black inset-0">
      <div class="absolute flex w-full bg-cover inset-0"></div>
      <!-- Fondo base (imagen a la derecha) -->
      <div class="w-3/5 h-full bg-cover bg-no-repeat float-right bg-[url(/imgs/header.avif)] grayscale"></div>

      <!-- Capa superior con clip-path en curva -->
      <div class="absolute inset-0 bg-linear-[90deg,#000000_40%,transparent_80%]"></div>
      <div class="w-full h-full z-1 backdrop-blur-sm"></div>
    </div>
    <div class="z-10 h-full flex flex-col justify-center items-start px-10 gap-6 text-white w-1/2">
      <h1 class="text-6xl font-bold font-light w-[500px] mt-6" style="font-family: var(--font-inter)">
        Construye Fuerza. Forja Disciplina.
      </h1>
      <p class="text-xl text-gray-300 font-bold font-light w-[600px]">En FitForge nos dedicamos a ayudarte a transformar tu vida llevando tus entrenamientos y rutinas a otro nivel.</p>
      <div class="flex gap-4">
        <a href="#" class="bg-tertiary-500 text-white rounded-tl-2xl hover:bg-orange-700 p-4 px-6 font-bold">SABER MAS</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { useAuthStore } from "@/utils/auth";
import { onMounted, ref } from "vue";

const auth = useAuthStore();
</script>
