<template>
  <div class="relative flex h-[35rem] flex-col w-full backface-hidden overflow-hidden text-white shadow-md">
    <div class="absolute bg-black inset-0">
      <div class="absolute flex w-full bg-cover inset-0"></div>
      <!-- Fondo base (imagen a la derecha) -->
      <div class="w-3/5 h-full bg-cover bg-no-repeat float-right bg-[url(/imgs/header.avif)]"></div>

      <!-- Capa superior con clip-path en curva -->
      <div class="absolute inset-0 bg-linear-[90deg,#000000_40%,transparent_80%]"></div>
    </div>
    <div class="z-10 h-full flex flex-col justify-center items-start px-10 gap-6 text-white w-1/2">
      <h1 class="text-6xl font-light w-[500px] mt-6" style="font-family: var(--font-inter)">
        Forja Disciplina. Construye Fuerza.
      </h1>
      <p class="text-xl text-gray-300 font-light w-[600px]">
        En FitForge nos dedicamos a transformar tu vida llevando tus entrenamientos y rutinas a otro nivel.
      </p>
      <div class="flex gap-4">
        <a href="#" class="bg-tertiary-500 text-white rounded-tl-2xl hover:bg-orange-700 p-4 px-6 font-bold"
          >SABER MAS</a
        >
      </div>
    </div>
  </div>

  <div class="flex flex-row h-full justify-between items-start text-black bg-white py-40">
    <div class="flex justify-start items-center w-3/5 relative">
      <div
        class="bg-tertiary-500 w-full h-96 diagonal-top-right absolute top-3 left-0 z-0"
        data-aos="fade-right"
        data-aos-delay="300"
      ></div>

      <div
        class="bg-[url(/imgs/photo-1483721310020-03333e577078.webp)] w-11/12 h-96 bg-cover z-10 diagonal-top-right relative -top-3 shadow-xl"
        data-aos="fade-right"
        data-aos-delay="400"
      ></div>
    </div>

    <div class="flex flex-col gap-10 w-2/5 h-full items-start mt-10">
      <h1 style="font-family: var(--font-anton)" class="text-6xl font-bold" data-aos="fade-up">¿QUE ES FITFORGE?</h1>
      <p class="text-xl text-gray-600 mt-4 max-w-[90%]" data-aos="fade-up" data-aos-delay="100">
        FitForge es tu aliado para forjar disciplina, mejorar tu rendimiento y transformar tu cuerpo. Crea planes
        personalizados, sigue tu progreso y lleva tu estilo de vida fitness al siguiente nivel.
      </p>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { useAuthStore } from "@/utils/auth";
import { onMounted, ref } from "vue";

const auth = useAuthStore();
</script>

<style>
.diagonal-top-right {
  clip-path: polygon(0 0, 80% 0, 100% 100%, 100% 100%, 0 100%);
}

</style>
