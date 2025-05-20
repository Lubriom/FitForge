<template>
  <div class="flex flex-col gap-6 h-full">
    <div class="bg-gray-100 p-4 rounded-2xl h-full w-full px-8 flex flex-row gap-8">
      <div class="flex flex-col justify-start gap-4">
        <div class="flex flex-row w-full items-center justify-start">
          <div class="flex flex-col justify-center items-center">
            <div class="w-64 h-64 bg-tertiary-500 rounded-full flex flex-col">
              <img
                :src="imageURL"
                alt="Foto de perfil"
                class="mt-0.5 ml-0.5 bg-white w-63 h-63 object-cover rounded-full"
              />
            </div>
            <p class="pt-4 font-bold text-lg mx-auto">{{ user.nombre }}</p>
          </div>
        </div>
        <div>
          <ul class="flex flex-col gap-3">
            <li class="border-t-1 border-gray-500/40"></li>
            <li>
              <p class="text-black text-md pt-2 pl-2 items-center flex gap-0.5">
                <span class="font-bold"><Mail /></span><span>{{ "\xa0" }}</span
                ><span>{{ user.correo }}</span>
              </p>
            </li>
            <li>
              <p v-if="user.genero == 'Hombre'" class="text-black text-md pt-2 pl-2 items-center flex gap-0.5">
                <span class="font-bold"><Mars /> </span>
                <span>{{ "\xa0" }}</span
                ><span>{{ user.genero }}</span>
              </p>
              <p v-if="user.genero == 'Mujer'" class="text-black text-md pt-2 pl-2 items-center flex gap-0.5">
                <span class="font-bold"><Venus /> </span><span>{{ "\xa0" }}</span
                ><span>{{ user.genero }}</span>
              </p>
            </li>
            <li>
              <p class="text-black text-md pt-2 pl-2 items-center flex gap-0.5">
                <span class="font-bold"><Cake /></span><span>{{ "\xa0" }}</span
                ><span>{{
                  new Date(user.fec_nac).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })
                }}</span>
              </p>
            </li>
            <li class="border-t-1 border-gray-500/40">
              <p class="text-black text-md pt-2 pl-2 items-center flex">
                <span class="font-bold">Se unio el: </span><span>{{ "\xa0" }}</span
                ><span>{{
                  new Date(user.created_at).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })
                }}</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div class="border-1 border-gray-500/10" />
      <div class="flex flex-col w-full h-min gap-4">
        <div class="bg-tertiary-500 p-4 rounded-2xl h-full w-full px-8 flex flex-row gap-8">
          <p v-if="!rutinas.value" class="text-black mx-auto">Este usuario aún no tiene ninguna rutina registrada</p>
          <p v-if="rutinas.value && rutinas.value.length > 0"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/utils/auth";
import axios from "axios";
import { useRouter } from "vue-router";
import { useLayoutStore } from '@/stores/layoutStore'

const layoutStore = useLayoutStore()
layoutStore.setTitle('Mi perfil')

const auth = useAuthStore();
const user = ref({});
const rutinas = ref({});
const imageURL = ref("");

onMounted(async () => {
  const userId = auth.getId();
  const token = auth.getToken();

  try {
    const response = await axios.get(`http://localhost:8081/users/get/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    imageURL.value = `http://localhost:8081/pfp/${response.data.profile_img}`;

    user.value = response.data;
  } catch (error) {
    console.error("Error al cargar los datos del usuario:", error);
  }
});

// ICONS

import { User } from "lucide-vue-next";
import { Mail } from "lucide-vue-next";
import { Cake } from "lucide-vue-next";
import { Mars } from "lucide-vue-next";
import { Venus } from "lucide-vue-next";
import { ArrowBigLeftDash } from "lucide-vue-next";

const router = useRouter();

function volverAtras() {
  router.back();
}
</script>
