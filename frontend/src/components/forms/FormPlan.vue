<template>
  <div class="container mx-auto p-4 h-2/4"> 
    <form @submit.prevent="handleSubmit">
      <!-- Información del Plan -->
      <div class="mb-4">
        <label for="nombre" class="block text-gray-700">Nombre del plan</label>
        <input
          v-model="plan.nombre"
          type="text"
          id="nombre"
          class="mt-1 p-2 border rounded w-full"
          placeholder="Nombre del plan"
        />
      </div>

      <div class="mb-4">
        <label for="descripcion" class="block text-gray-700">Descripción</label>
        <textarea
          v-model="plan.descripcion"
          id="descripcion"
          class="mt-1 p-2 border rounded w-full"
          rows="2"
          placeholder="Descripción del plan"
        ></textarea>
      </div>

      <div class="mb-4">
        <label for="objetivo" class="block text-gray-700">Objetivo</label>
        <input
          v-model="plan.objetivo"
          type="text"
          id="objetivo"
          class="mt-1 p-2 border rounded w-full"
          placeholder="Objetivo del plan"
        />
      </div>

      <!-- Tabla de Días -->
      <div class="mb-4 overflow-scroll h-1/4">
        <h3 class="text-xl font-bold">Días de Entrenamiento</h3>
        <table class="table-auto w-full mt-4">
          <thead>
            <tr>
              <th class="border px-4 py-2">Día</th>
              <th class="border px-4 py-2">Ejercicios</th>
              <th class="border px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(dia, index) in plan.dias" :key="index">
              <td class="border px-4 py-2">
                <input
                  v-model="dia.nombre"
                  type="text"
                  class="w-full p-2 border rounded"
                  placeholder="Nombre del día"
                />
              </td>
              <td class="border px-4 py-2">
                <table class="table-auto w-full">
                  <thead>
                    <tr>
                      <th class="border px-4 py-2">Ejercicio</th>
                      <th class="border px-4 py-2">Series</th>
                      <th class="border px-4 py-2">Repeticiones</th>
                      <th class="border px-4 py-2">Peso</th>
                      <th class="border px-4 py-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(ejercicio, ejIndex) in dia.ejercicios" :key="ejIndex">
                      <td class="border px-4 py-2">
                        <input
                          v-model="ejercicio.nombre"
                          type="text"
                          class="w-full p-2 border rounded"
                          placeholder="Ejercicio"
                        />
                      </td>
                      <td class="border px-4 py-2">
                        <input
                          v-model="ejercicio.series"
                          type="number"
                          class="w-full p-2 border rounded"
                          placeholder="Series"
                        />
                      </td>
                      <td class="border px-4 py-2">
                        <input
                          v-model="ejercicio.repeticiones"
                          type="number"
                          class="w-full p-2 border rounded"
                          placeholder="Repeticiones"
                        />
                      </td>
                      <td class="border px-4 py-2">
                        <input
                          v-model="ejercicio.peso"
                          type="number"
                          class="w-full p-2 border rounded"
                          placeholder="Peso"
                        />
                      </td>
                      <td class="border px-4 py-2">
                        <button
                          @click.prevent="eliminarEjercicio(dia, ejIndex)"
                          class="text-red-500 hover:text-red-700"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button @click.prevent="agregarEjercicio(dia)" class="mt-2 text-blue-500 hover:text-blue-700">
                  Agregar Ejercicio
                </button>
              </td>
              <td class="border px-4 py-2">
                <button @click.prevent="eliminarDia(index)" class="text-red-500 hover:text-red-700">
                  ×
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <button @click.prevent="agregarDia" class="mt-4 text-blue-500 hover:text-blue-700">Agregar Día</button>
      </div>

      <!-- Botón de Enviar -->
      <div>
        <button type="submit" class="w-full bg-blue-500 text-white p-3 rounded">Guardar Plan de Entrenamiento</button>
      </div>
    </form>
  </div>
</template>

<script setup>
defineProps({
  nombre: String,
  edad: Number
})
</script>
<script>


export default {
  data() {
    return {
      plan: {
        nombre: "",
        descripcion: "",
        objetivo: "",
        dias: [] // Aquí almacenamos los días con sus ejercicios
      }
    };
  },
  methods: {
    // Agregar un nuevo día de entrenamiento
    agregarDia() {
      this.plan.dias.push({
        nombre: "",
        diaNumero: this.plan.dias.length + 1,
        ejercicios: [] // Los ejercicios del día
      });
    },
    // Eliminar un día
    eliminarDia(index) {
      this.plan.dias.splice(index, 1);
    },
    // Agregar un ejercicio a un día
    agregarEjercicio(dia) {
      dia.ejercicios.push({
        nombre: "",
        series: 0,
        repeticiones: 0,
        peso: 0
      });
    },
    // Eliminar un ejercicio de un día
    eliminarEjercicio(dia, index) {
      dia.ejercicios.splice(index, 1);
    },
    // Manejar el envío del formulario
    handleSubmit() {
      // Aquí enviaríamos el plan al backend para guardar o actualizar
      console.log(this.plan);
    }
  }
};
</script>
