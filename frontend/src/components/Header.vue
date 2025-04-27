<template>
  <header class="bg-transparent text-white p-4">
    <nav>
      <ul class="flex space-x-4 justify-between">
        <li>
          <router-link to="/" class="text-white p-2 rounded-full font-rr">FitForge</router-link>
        </li>
        <div class="flex space-x-2">
          <router-link to="/" class="text-white bg-quaternary-500 hover:bg-quinary-500 p-2 rounded-full">Inicio</router-link>
          <router-link to="/about" class="text-white bg-quaternary-500 hover:bg-quinary-500 p-2 rounded-full">Sobre Nosotros</router-link>
        </div>
        <div class="flex space-x-2">
          <li><router-link to="/about" class="text-white bg-tertiary-500 border-1 border-tertiary-500 py-2 px-5 rounded-full">Login</router-link></li>
          <li><router-link to="/about" class="bg-transparent border-tertiary-500 border-1 text-tertiary-500 p-2 rounded-full">Register</router-link></li>
        </div>
      </ul>
    </nav>
  </header>
</template>
