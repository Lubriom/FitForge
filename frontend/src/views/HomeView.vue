<template>
  <div class="flex flex-col py-5 px-5">
    <h1 class="text-white text-2xl">
      Bienvenido a la Página de Inicio<span v-if="auth.isLoggedIn">, {{ auth.getName() }}</span>
    </h1>
    <br />
    <div class="p4 flex justify-center">

    </div>

    <br />
  </div>
</template>

<script setup>
import axios from "axios";
import { useAuthStore } from "@/utils/auth";
import { onMounted, ref } from "vue";

const auth = useAuthStore();

</script>
