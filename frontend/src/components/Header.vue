<template>
  <header class="bg-blue-600 text-white p-4">
    <nav>
      <ul class="flex space-x-4 justify-between">
        <li>
          <router-link to="/" class="text-white p-2 rounded-full">FitForge</router-link>
        </li>
        <li>
          <router-link to="/" class="text-white hover:bg-blue-800 p-2 rounded-full">Inicio</router-link>
          <router-link to="/about" class="text-white hover:bg-blue-800 p-2 rounded-full">Sobre Nosotros</router-link>
        </li>
        <div class="flex justify-end float-left">
          <li><router-link to="/about" class="text-white bg-blue-800 p-2 rounded-full">Login</router-link></li>
          <li><router-link to="/about" class="text-white bg-blue-800 p-2 rounded-full">Register</router-link></li>
        </div>
      </ul>
    </nav>
  </header>
</template>
