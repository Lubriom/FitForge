<template>
  <footer class="bg-primary-500 h-fit w-full py-16 pt-24 text-white p-4 clipped-footer">
    <div class="flex flex-col gap-4">
      <div class="flex flex-row justify-around items-start w-full h-full gap-8">
        <div class="flex flex-col gap-5">
          <div class="flex justify-center"><img src="/logov1.svg" class="h-36 w-36" /></div>
        </div>
        <div class="flex flex-row gap-12 items-start">
          <div class="flex flex-col">
            <h1 class="text-2xl text-tertiary-500 mb-3 font-bold revamped">General</h1>
            <div class="flex flex-col gap-1 text-gray-300">
              <router-link to="/" class="hover:text-tertiary-500">Inicio</router-link>
              <router-link to="/" class="hover:text-tertiary-500">Sobre Nosotros</router-link>
              <router-link to="/" class="hover:text-tertiary-500">Contacto</router-link>
            </div>
          </div>
          <div class="flex flex-col">
            <h1 class="text-2xl text-tertiary-500 mb-3 font-bold revamped">Usuario</h1>
            <div class="flex flex-col gap-1 text-gray-300">
              <router-link :to="{ name: 'Login' }" class="hover:text-tertiary-500">Login</router-link>
              <router-link :to="{ name: 'Register' }" class="hover:text-tertiary-500">Registrarse</router-link>
              <router-link :to="{ name: 'Dashboard' }" class="hover:text-tertiary-500">Dashboard</router-link>
            </div>
          </div>
          <div class="flex flex-col">
            <h1 class="text-2xl text-tertiary-500 mb-3 font-bold revamped">Soporte</h1>
            <div class="flex flex-col gap-1 text-gray-300">
              <router-link to="/" class="hover:text-tertiary-500">Preguntas Frecuentes</router-link>
              <router-link to="/" class="hover:text-tertiary-500">Terminos y Condiciones</router-link>
            </div>
          </div>
        </div>
        <div class="flex flex-col-reverse justify-start gap-8">
          <div class="flex justify-center items-center gap-8">
            <a href="https://facebook.com" target="_blank" class="text-white hover:text-tertiary-500"><Facebook /></a>
            <a
              href="https://github.com/Lubriom"
              target="_blank"
              class="text-white hover:text-tertiary-500"
              aria-label="GitHub"
              ><Github
            /></a>
            <a
              href="https://instagram.com"
              target="_blank"
              class="text-white hover:text-tertiary-500"
              aria-label="Instagram"
              ><Instagram
            /></a>
            <a href="https://x.com" target="_blank" class="text-white hover:text-tertiary-500" aria-label="Insta"
              ><X
            /></a>
            <a href="https://x.com" target="_blank" class="text-white hover:text-tertiary-500" aria-label="Insta"
              ><Linkedin
            /></a>
          </div>
          <div class="flex flex-col text-start gap-2 text-gray-400">
            <p class="font-bold text-xl revamped">Contacto</p>
            <p class="text-sm max-w-[400px]">
              ¿Tienes preguntas o quieres saludarnos? Escríbenos y te responderemos lo antes posible. En FitForge
              valoramos tus comentarios para seguir mejorando.
            </p>
          </div>
        </div>
      </div>
      <hr class="my-4 mx-2 text-gray-300/20" />
      <div>
        <div class="flex flex-col text-center items-center gap-2 text-gray-400">
          <p>© 2025 FitForge - Roy Lunar</p>
          <p>Todos los derechos reservados</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Facebook, Github, Instagram, Linkedin, X, Youtube } from "lucide-vue-next";
</script>
