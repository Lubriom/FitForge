<template>
    <div class="bg-gray-600">
      <header>
        <Header />
      </header>
      
      <main>
        <router-view></router-view>
      </main>
      
      <footer>
        <Footer />
      </footer>
    </div>
  </template>
  
  <script setup>
  import Header from '../Header.vue';
  import Footer from '../Footer.vue';
  </script>
  