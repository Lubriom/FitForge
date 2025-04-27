<template>
  <div class="flex flex-col py-5 px-5">
    <h1>Modificando el usuario: {{ nameUser }}</h1>
    <br />
    <form @submit="modifiedUser">
      <label for="name">Name:</label>
      <input type="text" id="name" v-model="user.nombre" class="border p-2 mb-2" />

      <label for="email">Email:</label>
      <input type="email" id="email" v-model="user.email" class="border p-2 mb-2" />

      <button type="submit" class="bg-blue-500 text-white p-2 rounded-md">Guardar</button>
    </form>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { z } from "zod";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const user = ref({});
const nameUser = ref('');

onMounted(async () => {
  const response = await axios.get(`http://localhost:8081/users/${id}`);
  user.value = response.data;
  nameUser.value = user.value.nombre;
});


const modifiedUser = async (event) => {
    console.log(user.value)
  event.preventDefault();

  const schema = z.object({
    nombre: z.string().min(1, { message: "El nombre es requerido" }),
    email: z.string().email({ message: "Email no válido" })
  });

  try {
    schema.parse(user.value);

    await axios.patch(`http://localhost:8081/users/${id}`, {
      nombre: user.value.nombre,
      email: user.value.email
    });
    router.push("/");

    alert("Usuario actualizado correctamente ✅");
  } catch (error) {
    if (error instanceof z.ZodError) {
      alert("Error de validación: " + error.errors[0].message);
    } else {
      console.error(error);
      alert("Error al actualizar el usuario ❌");
    }
  }
};
</script>
