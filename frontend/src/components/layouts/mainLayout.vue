<template>
    <div class="bg-primary-500">
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
  