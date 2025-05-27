<template>
  <div class="bg-black h-screen">
    <Header />

    <main>
      <router-view></router-view>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import Header from "../Header.vue";
import Footer from "../Footer.vue";
</script>
