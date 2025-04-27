<template>
  <div class="flex flex-col py-5 px-5">
    <h1>Bienvenido a la Página de Inicio</h1>
    <br />
    <div class="p4 flex justify-center">
      <table class="table-auto border-1 rounded-2xl">
        <tr class="bg-blue-500 text-white">
          <th>Nombre</th>
          <th>Email</th>
          <th>Acciones</th>
        </tr>
        <tr v-for="user in users" :key="user.id">
          <td class="px-2">{{ user.nombre }}</td>
          <td class="px-2">{{ user.email }}</td>
          <td class="space-x-2 px-2">
            <router-link :to="{ name: 'Edit', params: { id: user.id } }" class="bg-green-500 text-white rounded-md p-2">Editar</router-link>
            <button @click="deleteUser(user.id)" class="bg-red-500 text-white rounded-md p-2">Eliminar</button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";

const users = ref([]); // Array reactivo

onMounted(async () => {
  const response = await axios.get("http://localhost:8081/users");
  users.value = response.data;
});

const deleteUser = async (id) => {
  await axios.delete(`http://localhost:8081/users/${id}`);
  users.value = users.value.filter((user) => user.id !== id); // Quita el eliminado sin recargar página
};
</script>
