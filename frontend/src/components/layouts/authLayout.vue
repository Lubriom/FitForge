<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <router-link
      to="/"
      class="hover:bg-tertiary-500 top-3 left-3 text-white w-12 absolute h-12 flex justify-center items-center z-50 rounded-2xl hover:shadow-inner transition-all duration-200 ease-in-out active:shadow-lg active:translate-y-1"
    >
      <ArrowBigLeftDash class="w-10 h-10" />
    </router-link>
    <main class="w-full relative h-screen">
      <!-- Panel negro animado -->
      <div
        ref="blackPanel"
        class="absolute top-0 w-full md:w-1/2 h-full bg-transparent md:bg-black z-29"
        :style="{ transform: `translateX(${initialTranslateX})` }"
      >
        <div class="absolute inset-0 flex items-center justify-center z-30">
          <Transition
            mode="out-in"
            @enter="enterAnimation"
            @leave="leaveAnimation"
            @trigger-animation="swapSides"
            :class="{ 'animate-class': animationActive }"
          >
            <router-view :key="$route.fullPath" />
          </Transition>
        </div>
      </div>

      <!-- Panel de transición -->
      <div
        ref="blackPanel2"
        class="absolute top-0 w-1/2 h-full bg-black z-28"
        :style="{ transform: `translateX(${initialTranslateX})` }"
      ></div>

      <!-- Panel izquierdo con imagen -->
      <div class="absolute right-1/2 w-1/2 h-full bg-[url(@/assets/imgs/loginPhoto.avif)] bg-cover bg-center z-0"></div>

      <!-- Panel derecho con imagen -->
      <div class="absolute left-1/2 w-1/2 h-full bg-[url(@/assets/imgs/loginPhoto2.avif)] bg-cover bg-center z-0"></div>
    </main>
  </div>
</template>

<script setup>
import { nextTick, computed } from "vue";
import anime from "animejs";
import { useRouter, useRoute } from "vue-router";
import { ArrowBigLeftDash } from "lucide-vue-next";
import { ref, onMounted, onBeforeUnmount } from "vue";

const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768; // Tailwind md = 768px
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkMobile);
});

const animationActive = ref(false);

const router = useRouter();
const route = useRoute();

const blackPanel = ref(null);
const blackPanel2 = ref(null);

// Detecta si está en la ruta de login
const isLogin = computed(() => route.name === "Login");

// Posición inicial del panel
const initialTranslateX = computed(() => {
  if (isMobile.value) return "0%";
  return isLogin.value ? "0%" : "100%";
});

const enterAnimation = (el, done) => {
  anime({
    targets: el,
    opacity: [0, 1],
    translateY: [-30, 0],
    duration: 300,
    easing: "easeOutQuad",
    complete: done
  });
};

const leaveAnimation = (el, done) => {
  anime({
    targets: el,
    opacity: [1, 0],
    translateY: [0, 30],
    duration: 200,
    easing: "easeInQuad",
    complete: done
  });
};

const swapSides = () => {
  nextTick(() => {
    if (!blackPanel.value || isMobile.value) {
      router.push(isLogin.value ? "/register" : "/login");
      return
    }

    anime({
      targets: blackPanel.value,
      translateX: isLogin.value ? "100%" : "0%",
      duration: 800,
      easing: "easeInOutQuad"
    });

    anime({
      targets: blackPanel2.value,
      translateX: isLogin.value ? "100%" : "0%",
      duration: 800,
      delay: 800,
      easing: "easeInOutQuad",
      complete: () => {
        router.push(isLogin.value ? "/register" : "/login");
      }
    });
  });
};
</script>
<style scoped></style>
