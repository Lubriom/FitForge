<template>
  <div class="flex flex-col py-5 px-5">
    <h1 class="text-white text-2xl">
      Bienvenido a la Página de Inicio<span v-if="auth.isLoggedIn">, {{ auth.getName() }}</span>
    </h1>
    <br />
    <div class="p4 flex justify-center">
      <table class="table-auto rounded-2xl bg-quaternary-500 col-span-2 row-span-5 text-white">
        <tr class="bg-tertiary-500 text-white">
          <th>ID</th>
          <th>Nombre</th>
          <th>P. Apellido</th>
          <th>S. Apellido</th>
          <th>Genero</th>
          <th>Correo</th>
          <th>Fecha Nac</th>
          <th>Rol</th>
          <th v-if="auth.isLoggedIn">Acciones</th>
        </tr>
        <tr v-for="user in users" :key="user.id">
          <td class="p-5">{{ user.id }}</td>
          <td class="p-5">{{ user.nombre }}</td>
          <td class="p-5">{{ user.apellido }}</td>
          <td class="p-5">{{ user.sapellido }}</td>
          <td class="p-5">{{ user.genero !== null ? user.genero : "No especificado" }}</td>
          <td class="p-5">{{ user.correo }}</td>
          <td class="p-5">{{ user.fec_nac != null ? (user.fec_nac + "").split("T")[0] : "No especificado" }}</td>
          <td class="p-5">{{ user.role }}</td>
          <td v-if="auth.isLoggedIn" class="p-5">
            <router-link :to="{ name: 'Edit', params: { id: user.id } }" class="bg-green-500 text-white rounded-md p-2"
              >Editar</router-link
            >
            <button v-if="auth.isAdmin()" @click="deleteUser(user.id)" class="bg-red-500 text-white rounded-md p-2">
              Eliminar
            </button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { useAuthStore } from "@/utils/auth";
import { onMounted, ref } from "vue";

const auth = useAuthStore();
const users = ref([]);

onMounted(async () => {
  const response = await axios.get("http://localhost:8081/users");
  users.value = response.data;
});

const deleteUser = async (id) => {
  await axios.delete(`http://localhost:8081/users/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("log_token")}` }
  });
  users.value = users.value.filter((user) => user.id !== id); // Quita el eliminado sin recargar página
};
</script>
