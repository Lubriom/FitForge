<template>
  <div
    class="relative flex h-[35rem] justify-center flex-col w-full backface-hidden overflow-hidden text-white shadow-md"
  >
    <div class="absolute bg-black inset-0">
      <div class="absolute flex w-full bg-cover inset-0"></div>
      <!-- Fondo base (imagen a la derecha) -->
      <div class="w-3/5 h-full bg-cover bg-no-repeat float-right bg-[url(/imgs/header.avif)]"></div>

      <!-- Capa superior con clip-path en curva -->
      <div class="absolute inset-0 bg-linear-[90deg,#000000_40%,transparent_80%]"></div>
    </div>
    <div class="z-10 flex flex-col justify-center items-start px-10 gap-6 text-white w-1/2">
      <h1 class="text-6xl font-light w-[500px] mt-6" style="font-family: var(--font-inter)">
        Forja Disciplina. Construye Fuerza.
      </h1>
      <p class="text-xl text-gray-300 font-light w-[600px]">
        En FitForge nos dedicamos a transformar tu vida llevando tus entrenamientos y rutinas a otro nivel.
      </p>
      <div class="flex gap-4">
        <router-link
          :to="{ name: 'Register' }"
          class="text-2xl bg-tertiary-500 text-white hover:bg-orange-700 p-4 px-6 font-bold brochazo-horizontal transition-all duration-300 anton"
          >Comienza ahora</router-link
        >
        <a
          href="#know"
          class="text-2xl bg-quaternary-500 text-white hover:bg-gray-700 p-4 px-6 font-bold brochazo-horizontal transition-all duration-300 anton"
          >SABER MAS</a
        >
      </div>
    </div>
  </div>

  <div class="flex flex-col lg:flex-row justify-between items-center text-black bg-white py-20 lg:py-40 px-0 lg:px-0">
    <!-- Imagen con fondo y sombra -->
    <div class="relative w-full lg:w-3/5 flex justify-start items-center mb-10 lg:mb-0">
      <!-- Fondo color con forma diagonal -->
      <div
        class="bg-tertiary-500 w-full h-64 lg:h-96 diagonal-top-right absolute top-3 left-0 z-0"
        data-aos="fade-right"
        data-aos-delay="300"
      ></div>

      <!-- Imagen -->
      <div
        class="bg-[url(/imgs/photo-1483721310020-03333e577078.webp)] w-11/12 h-64 lg:h-96 bg-cover z-10 diagonal-top-right relative -top-3 shadow-xl"
        data-aos="fade-right"
        data-aos-delay="400"
      ></div>
    </div>

    <!-- Texto -->
    <div class="flex flex-col gap-8 w-full lg:w-2/5 h-full items-start px-20">
      <h1 style="font-family: var(--font-anton)" class="text-4xl sm:text-5xl lg:text-6xl font-bold" data-aos="fade-up">
        ¿QUE ES FITFORGE?
      </h1>
      <p class="text-base sm:text-lg text-gray-600 max-w-full lg:max-w-[90%]" data-aos="fade-up" data-aos-delay="100">
        FitForge es tu aliado para forjar disciplina, mejorar tu rendimiento y transformar tu cuerpo. Crea planes
        personalizados, sigue tu progreso y lleva tu estilo de vida fitness al siguiente nivel.
      </p>
    </div>
  </div>

  <!-- Que lograras hacer -->
  <section class="bg-tertiary-500 text-black py-24 px-6" id="know">
    <div class="text-center mb-12" data-aos="fade-up">
      <h2 class="text-5xl font-bold anton">¿QUÉ PUEDES HACER CON FITFORGE?</h2>
      <p class="mt-4 text-lg max-w-2xl mx-auto">
        FitForge te ofrece herramientas inteligentes para entrenar, alimentarte y progresar con propósito.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <div
        class="p-6 rounded-2xl shadow-lg bg-gray-50 hover:scale-105 transition-all"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <Dumbbell class="w-12 h-12 text-primary-500 mb-4" />
        <h3 class="text-xl font-bold mb-2">Rutinas personalizadas</h3>
        <p>Genera entrenamientos adaptados a tu objetivo y nivel físico.</p>
      </div>

      <div
        class="p-6 rounded-2xl shadow-lg bg-gray-50 hover:scale-105 transition-all"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <LineChart class="w-12 h-12 text-primary-500 mb-4" />
        <h3 class="text-xl font-bold mb-2">Progreso visual</h3>
        <p>Monitorea tu evolución con gráficas interactivas.</p>
      </div>

      <div
        class="p-6 rounded-2xl shadow-lg bg-gray-50 hover:scale-105 transition-all"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        <MonitorSmartphone class="w-12 h-12 text-primary-500 mb-4" />
        <h3 class="text-xl font-bold mb-2">Accede desde cualquier lugar</h3>
        <p>Tus rutinas están disponibles en todo momento, desde móvil, tablet o PC.</p>
      </div>

      <div
        class="p-6 rounded-2xl shadow-lg bg-gray-50 hover:scale-105 transition-all"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        <CalendarCheck class="w-12 h-12 text-primary-500 mb-4" />
        <h3 class="text-xl font-bold mb-2">Organiza tus rutinas</h3>
        <p>Planifica tus días de entrenamiento y registra cada sesión.</p>
      </div>

      <div
        class="p-6 rounded-2xl shadow-lg bg-gray-50 hover:scale-105 transition-all duration-75"
        data-aos="fade-up"
        data-aos-delay="500"
      >
        <HeartPulse class="w-12 h-12 text-primary-500 mb-4" />
        <h3 class="text-xl font-bold mb-2">Bienestar físico</h3>
        <p>Controla tu salud con métricas clave de seguimiento.</p>
      </div>

      <div
        class="p-6 rounded-2xl shadow-lg bg-gray-50 hover:scale-105 transition-all"
        data-aos="fade-up"
        data-aos-delay="600"
      >
        <CircleGauge class="w-12 h-12 text-primary-500 mb-4" />
        <h3 class="text-xl font-bold mb-2">Rutinas creadas por expertos</h3>
        <p>Entrenadores certificados diseñan planes personalizados según tus objetivos.</p>
      </div>
    </div>
  </section>

  <!-- Como funciona -->
  <div class="bg-black py-32 pb-28 flex flex-col lg:flex-row text-white gap-8">
    <div class="w-full lg:w-2/5 px-10 flex flex-col justify-center items-center gap-6">
      <h2 class="text-5xl font-bold anton" data-aos="fade-up">TODO EN SIMPLES PASOS</h2>
      <div class="flex flex-col gap-4 text-lg justify-self-center">
        <p class="flex items-center gap-2" data-aos="fade-right" data-aos-delay="300">
          <MoveRight class="w-5 h-5 text-white" />
          Ingresa tus datos
        </p>
        <p class="flex items-center gap-2" data-aos="fade-right" data-aos-delay="350">
          <MoveRight class="w-5 h-5 text-white" />
          Elige tu objetivo
        </p>
        <p class="flex items-center gap-2" data-aos="fade-right" data-aos-delay="400">
          <MoveRight class="w-5 h-5 text-white" />
          Crea tu rutina
        </p>
        <p class="flex items-center gap-2" data-aos="fade-right" data-aos-delay="450">
          <MoveRight class="w-5 h-5 text-white" />
          Sigue tu progreso
        </p>
      </div>
    </div>

    <div
      class="w-full lg:w-3/5 h-96 flex overflow-hidden py-2 border-y-8 border-y-tertiary-500 duration-200 transition-all"
      data-aos="fade-up"
      data-aos-delay="500"
    >
      <div
        class="bg-[url('/imgs/chander-r-z4WH11FMfIQ-unsplash.jpg')] bg-cover bg-center flex-1 hover:flex-[3] transition-all duration-500 ease-in-out"
      ></div>
      <div
        class="bg-[url('/imgs/karsten-winegeart-0Wra5YYVQJE-unsplash.jpg')] bg-cover bg-center flex-1 hover:flex-[3] transition-all duration-500 ease-in-out"
      ></div>
      <div
        class="bg-[url('/imgs/i-yunmai-_-DOhLYdUFM-unsplash.jpg')] bg-cover bg-center flex-1 hover:flex-[3] transition-all duration-500 ease-in-out"
      ></div>
    </div>
  </div>

  <div class="p-12 bg-gradient-to-b from-black to-white"></div>

  <!-- Muchos ejercicios -->
  <div class="bg-white py-32 flex flex-col items-center gap-14 px-8">
    <h2 class="text-5xl font-bold anton text-black" data-aos="fade-up">MUCHOS EJERCICIOS</h2>

    <p class="max-w-3xl text-center text-lg text-gray-700" data-aos="fade-up" data-aos-delay="100">
      Nuestra plataforma te ofrece acceso a una amplia variedad de ejercicios, cuidadosamente seleccionados para
      ayudarte a alcanzar tus metas. Ya sea que busques ganar fuerza, mejorar tu resistencia o simplemente mantenerte
      activo, aquí encontrarás el entrenamiento ideal para ti.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 max-w-6xl" data-aos="fade-up" data-aos-delay="200">
      <!-- Card: Fuerza -->
      <div
        class="bg-tertiary-500 rounded-2xl shadow-lg p-6 flex flex-col items-center gap-4 hover:scale-105 transition-transform"
      >
        <Dumbbell class="w-12 h-12 text-white" />
        <h3 class="text-xl font-bold text-white">Ejercicios de Fuerza</h3>
        <p class="text-white text-center">
          Potencia tus músculos y mejora tu rendimiento físico con rutinas enfocadas en hipertrofia y fuerza máxima.
        </p>
      </div>

      <!-- Card: Cardio -->
      <div
        class="bg-tertiary-500 rounded-2xl shadow-lg p-6 flex flex-col items-center gap-4 hover:scale-105 transition-transform"
      >
        <HeartPulse class="w-12 h-12 text-white" />
        <h3 class="text-xl font-bold text-white">Cardio y Resistencia</h3>
        <p class="text-white text-center">
          Quema calorías, fortalece tu corazón y mejora tu capacidad aeróbica con ejercicios dinámicos y eficaces.
        </p>
      </div>

      <!-- Card: Flexibilidad -->
      <div
        class="bg-tertiary-500 rounded-2xl shadow-lg p-6 flex flex-col items-center gap-4 hover:scale-105 transition-transform"
      >
        <Turtle class="w-12 h-12 text-white" />
        <h3 class="text-xl font-bold text-white">Movilidad y Flexibilidad</h3>
        <p class="text-white text-center">
          Ejercicios suaves y efectivos para mejorar tu rango de movimiento y prevenir lesiones.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { useAuthStore } from "@/utils/auth";
import { onMounted, ref } from "vue";
import {
  Dumbbell,
  LineChart,
  HeartPulse,
  CalendarCheck,
  MonitorSmartphone,
  CircleGauge,
  MoveRight,
  StretchHorizontal,
  Turtle
} from "lucide-vue-next";

const auth = useAuthStore();
</script>

<style>
.diagonal-top-right {
  clip-path: polygon(0 0, 80% 0, 100% 100%, 100% 100%, 0 100%);
}

.brochazo-horizontal {
  clip-path: polygon(
    0% 10%,
    /* Arranca más arriba (menos 30% antes) */ 5% 5%,
    15% 8%,
    25% 0%,
    40% 10%,
    60% 5%,
    75% 15%,
    85% 10%,
    95% 13%,
    100% 10%,
    100% 90%,
    /* Baja más (antes 70%) */ 95% 95%,
    85% 92%,
    75% 98%,
    60% 90%,
    40% 95%,
    25% 85%,
    15% 90%,
    5% 88%,
    0% 90%
  );
}
</style>
