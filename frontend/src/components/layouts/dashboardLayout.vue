<template>
  <div class="flex flex-col h-screen">
    <div
      class="bg-white p-3 h-full rounded bg-[url(@/assets/imgs/bg.jpg)] bg-cover bg-center bg-no-repeat"
    >
      <div class="flex flex-row h-full p-3 space-x-2.5 bg-gray-200/20 rounded-2xl">
        <div>
          <Header />
        </div>

        <main class="w-full rounded-2xl p-3 shadow-[0px_10px_10px_-5px_rgba(0,0,0,0.3)]">
          <router-view></router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from "../HeaderDash.vue";
import { onMounted } from "vue";
</script>
