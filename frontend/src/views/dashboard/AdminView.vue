<template>
  <div class="flex flex-col h-full gap-3">
    <!-- Barra de listado -->
    <div class="hidden md:flex flex-row-reverse justify-between items-center gap-4">
      <form class="flex flex-wrap gap-2 p-2 mr-2 rounded-lg">
        <div class="flex items-center gap-2">
          <label for="perPage">Mostrando: </label>
          <select
            id="perPage"
            v-model.number="filtros.perPage"
            class="appearance-none px-4 py-2 rounded-xl bg-tertiary-500/50 text-black focus:outline-none focus:ring-2 focus:ring-tertiary-500 shadow-md"
          >
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </div>
      </form>
      <form
        @submit.prevent="emitirFiltros"
        class="w-full flex flex-wrap gap-3 bg-gray-100 p-2 rounded-xl shadow-[0px_10px_10px_-5px_rgba(0,0,0,0.3)]"
      >
        <!-- Buscador -->
        <input
          v-model="filtros.query"
          type="text"
          placeholder="Buscar por nombre, ID o correo"
          class="rounded-xl px-4 py-2 min-w-[200px] flex-1 bg-white text-black border border-gray-300 hover:border-tertiary-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all"
          :disabled="filtros.ordenarPor === 'activo'"
        />

        <!-- Ordenar por -->
        <select v-model="filtros.ordenarPor" class="rounded-lg px-4 py-2 bg-white text-black border border-gray-300 hover:border-tertiary-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all">
          <option disabled value="">Ordenar por...</option>
          <option value="id">ID</option>
          <option value="nombre">Nombre</option>
          <option value="apellido">Apellido 1</option>
          <option value="sapellido">Apellido 2</option>
          <option value="correo">Correo</option>
          <option value="activo">Activo</option>
        </select>

        <!-- Dirección -->
        <select v-model="filtros.direccion" class="rounded-lg px-4 py-2 bg-white text-black border border-gray-300 hover:border-tertiary-500 focus:outline-none focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 focus:ring-offset-1 focus:ring-offset-white transition-all">
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </select>

        <!-- Botón Filtrar -->
        <button
          type="submit"
          class="bg-tertiary-500 text-white py-2 px-4 rounded-lg hover:bg-orange-700 cursor-pointer"
        >
          <span class="flex items-center gap-1"><Funnel/> Filtrar</span>
        </button>

        <!-- Botón Reset -->
        <button
          type="button"
          @click="resetFiltros"
          class="bg-gray-300 text-black py-2 px-2 rounded-lg hover:bg-gray-400 cursor-pointer rotate"
        >
          <RotateCcw />
        </button>
      </form>
    </div>
    <!-- Tabla de usuarios -->
    <div class="overflow-y-auto max-h-full rounded-lg pr-2">
      <table class="table-fixed bg-white rounded-lg">
        <thead class="sticky top-0">
          <tr class="bg-gray-100 text-left">
            <th class="p-3  cursor-pointer w-1/12 sm:w-12">
              <button @click="sortBy('id')">ID</button>
            </th>
            <th class="p-3 w-1/12 text-center">Foto</th>
            <th class="p-3 w-1/4">
              <button @click="sortBy('nombre')">Nombre Completo</button>
            </th>
            <th class="p-3 w-1/4 hidden sm:table-cell">
              <button @click="sortBy('correo')">Correo</button>
            </th>
            <th class="p-3 w-1/8 hidden md:table-cell">
              <button @click="sortBy('role')">Rol</button>
            </th>
            <th class="p-3 w-1/6 hidden lg:table-cell">
              <button @click="sortBy('activo')">Activo</button>
            </th>
            <th class="p-3 w-1/3 sm:1/2">Acciones</th>
          </tr>
        </thead>
        <tbody class="overflow-y-scroll">
          <tr v-for="user in users" :key="user.id">
            <td class="p-3">{{ user.id }}</td>
            <td class="p-3 text-center align-middle">
              <div class="flex justify-center items-center">
                <img
                  class="w-8 h-8 rounded-lg object-cover"
                  :src="'http://localhost:8081/pfp/' + user.profile_img"
                  alt="Foto de perfil"
                />
              </div>
            </td>
            <td class="p-3">{{ user.nombre }} {{ user.apellido }} {{ user.sapellido }}</td>
            <td class="p-3 hidden sm:table-cell">{{ user.correo }}</td>
            <td class="p-3 hidden md:table-cell">{{ user.role }}</td>
            <td class="p-3 hidden lg:table-cell">
              <div class="flex justify-center items-center h-full">
                <span v-if="user.activo == 1" class="text-green-500 bg-green-300/50 rounded-2xl px-3 py-1">
                  Activo
                </span>
                <span v-else class="text-red-500 bg-red-300/50 rounded-2xl px-3 py-1"> Inactivo </span>
              </div>
            </td>

            <td class="pr-2">
              <div class="flex justify-start items-center gap-1.5 h-full">
                <router-link
                  :to="{ name: 'DashboardSeeProfile', params: { id: user.id } }"
                  class="bg-tertiary-500 hover:bg-orange-700 text-white rounded-md p-2"
                >
                  <ContactRound />
                </router-link>
                <router-link
                  :to="{ name: 'DashboardAdminEdit', params: { id: user.id } }"
                  class="bg-green-500 hover:bg-green-800 text-white rounded-md p-2"
                >
                  <UserPen />
                </router-link>
                <button
                  v-if="user.activo == 1 && auth.isAdmin()"
                  @click="deleteUser(user.id)"
                  class="bg-red-500 hover:bg-red-800 text-white rounded-md p-2 cursor-pointer"
                >
                  <Trash2 />
                </button>
                <button
                  v-if="user.activo == 0 && auth.isAdmin()"
                  @click="activateUser(user.id)"
                  class="bg-blue-500 hover:bg-blue-800 text-white rounded-md p-2 cursor-pointer"
                >
                  <UserPlus />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Paginación -->
    <div
      class="bg-gray-100 p-2 rounded-xl flex justify-between items-center "
    >
      <button
        @click="prevPage"
        :disabled="page <= 1"
        class="px-3 py-1 bg-tertiary-500 hover:bg-orange-700 text-white rounded-xl cursor-pointer"
      >
        Anterior
      </button>
      <span>Página {{ page }} de {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="page >= totalPages"
        class="px-3 py-1 bg-tertiary-500 hover:bg-orange-700 text-white rounded-xl cursor-pointer"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useAuthStore } from "@/utils/auth";
import { useLayoutStore } from "@/stores/layoutStore";

const emit = defineEmits(["loading-start", "loading-end"]);

// Stores
const layoutStore = useLayoutStore();
layoutStore.setTitle("Lista de Usuarios");

const auth = useAuthStore();

// Estado principal
const users = ref([]);
const page = ref(1);
const totalPages = ref(1);

// Filtros reactivos
const filtros = ref({
  query: "",
  ordenarPor: "id",
  direccion: "asc",
  perPage: 10
});

// Fetch de usuarios con filtros aplicados
const fetchUsers = async () => {
  emit("loading-start");

  try {
    if (filtros.ordenarPor === "activo") {
      filtros.query = "";
    }

    const res = await axios.get("http://localhost:8081/users/paginate", {
      headers: { Authorization: `Bearer ${auth.getToken()}` },
      params: {
        page: page.value,
        limit: filtros.value.perPage,
        sortField: filtros.value.ordenarPor,
        sortDirection: filtros.value.direccion,
        query: filtros.value.query
      }
    });
    users.value = res.data.users;
    totalPages.value = res.data.totalPages;
  } catch (err) {
    console.error("Error al cargar usuarios:", err);
  } finally {
    emit("loading-end");
  }

};

// Orden desde headers de tabla
const sortBy = (field) => {
  if (filtros.value.ordenarPor === field) {
    filtros.value.direccion = filtros.value.direccion === "asc" ? "desc" : "asc";
  } else {
    filtros.value.ordenarPor = field;
    filtros.value.direccion = "asc";
  }
  fetchUsers();
};

// Paginación
const prevPage = () => {
  if (page.value > 1) {
    page.value--;
    fetchUsers();
  }
};

const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value++;
    fetchUsers();
  }
};

// Borrar usuario
const deleteUser = async (userId) => {
  try {
    if (auth.getId() === userId) return alert("No puedes borrar tu propio usuario.");
    await axios.delete(`http://localhost:8081/users/delete/${userId}`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` }
    });
    fetchUsers();
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
  }
};

const activateUser = async (userId) => {
  try {
    await axios.patch(
      `http://localhost:8081/users/update/${userId}`,
      { activo: 1 },
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` }
      }
    );
    fetchUsers();
  } catch (err) {
    console.error("Error al activar usuario:", err);
  }
};

// Envío manual de filtros (desde formulario)
const emitirFiltros = () => {
  page.value = 1;
  fetchUsers();
};

// Reset de filtros
const resetFiltros = () => {
  filtros.value = {
    query: "",
    ordenarPor: "id",
    direccion: "asc",
    perPage: 10
  };
  page.value = 1;
  fetchUsers();
};

// Inicial
onMounted(fetchUsers);

watch(
  () => filtros.value.perPage,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      page.value = 1;
      fetchUsers();
    }
  }
);

watch(
  () => filtros.value.ordenarPor,
  (nuevoValor) => {
    if (nuevoValor === "id" || nuevoValor === "activo") {
      filtros.value.query = "";
    }
  }
);

// Iconos
import { RotateCcw, Trash2, UserPen, ContactRound, UserPlus, Funnel } from "lucide-vue-next";
</script>

<style scoped>
.rotate:hover > *{
  transition: all 0.5s ease-in-out;
  transform: rotate(-360deg);
}
</style>