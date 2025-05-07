<template>
    <div>
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
  import Header from '../HeaderDash.vue';
  import Footer from '../FooterDash.vue';
  </script>
  