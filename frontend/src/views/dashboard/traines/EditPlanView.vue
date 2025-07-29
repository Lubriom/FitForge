<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "@/utils/Auth";
import { LucideAirVent, Trash } from "lucide-vue-next";
import { z } from "zod";
import { useToast } from "vue-toastification";
import PrimaryButton from "@/components/basics/PrimaryButton.vue";

const toast = useToast();

const emit = defineEmits(["loading-start", "loading-end"]);

const submit = async () => {
  const ejercicioSchema = z.object({
    ejercicioId: z
      .number()
      .refine((val) => /^\d+$/.test(val.toString()) && Number(val) >= 1, {
        message: "Por favor seleccione un ejercicio."
      }),
    descanso: z
      .string()
      .nonempty("El descanso es obligatorio")
      .refine((val) => /^\d+$/.test(val.toString()), {
        message: "El descanso debe ser un número válido y positivo."
      }),

    series: z
      .string()
      .nonempty("Las series son obligatorias")
      .refine((val) => /^\d+$/.test(val.toString()) && Number(val) >= 1, {
        message: "Debe haber al menos una serie."
      }),

    repeticiones: z
      .string()
      .nonempty("Las repeticiones son obligatorias")
      .refine((val) => /^\d+$/.test(val.toString()) && Number(val) >= 1, {
        message: "Debe haber al menos una repetición."
      }),

    peso: z
      .string()
      .nonempty("El peso es obligatorio")
      .refine((val) => /^\d{1,3}(\.\d{1,2})?$/.test(val.toString()), {
        message: "Peso debe ser un número válido (hasta 2 decimales)."
      }),
    orden: z.number("El orden debe ser un número").int().min(1, "El orden debe ser mayor que 0")
  });

  const diaSchema = z.object({
    diaNumero: z.number().int().positive(),
    grupoMuscular: z.string().optional().nullable(),
    fecha: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Fecha inválida"
    }),
    ejercicios: z.array(ejercicioSchema)
  });

  const planSchema = z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    descripcion: z.string().max(500).optional(),
    nivel: z.enum(["basico", "intermedio", "avanzado", "personalizado"]),
    objetivo: z.enum(["hipertrofia", "fuerza", "personalizado"]),
    activo: z.boolean(),
    dias: z.array(diaSchema).min(1, "Debe haber al menos un día en el plan")
  });

  try {
    const planData = {
      ...form.value,
      dias: dias.value.map((d) => ({
        diaNumero: d.diaNumero,
        grupoMuscular: d.grupoMuscular,
        fecha: d.fecha,
        finalizado: d.finalizado || false,
        ejercicios: d.ejercicios.map((e) => ({
          id: e.id,
          ejercicioId: e.ejercicioId,
          series: e.series,
          repeticiones: e.repeticiones,
          peso: e.peso,
          descanso: e.descanso,
          orden: e.orden
        }))
      }))
    };

    planSchema.parse(planData);
    const userId = route.params.userId;

    await axios.patch(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/trains/update/${planId}/user/${userId}`,
      planData,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` }
      }
    );

    toast.success("Cambios guardados correctamente.");
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error("Errores de validación:", err.errors);
      toast.error(err.errors[0].message);
    } else {
      console.error("Error al guardar cambios:", err);
      toast.error("Error al guardar los cambios.");
    }
  }
};

const capitalizar = (texto) => {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

const auth = useAuthStore();

const route = useRoute();
const router = useRouter();
const planId = parseInt(route.params.id);

const form = ref({
  nombre: "",
  descripcion: "",
  nivel: "",
  objetivo: "",
  activo: false
});

const dias = ref([]);
const ejercicios = ref([]);
const ejerciciosDisponibles = ref([]);
const ejerciciosExtras = ref([]);
const diaSeleccionado = ref(null);

onMounted(async () => {
  emit("loading-start");

  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/trains/plan/${planId}`,
      {
        headers: { Authorization: `Bearer ${auth.getToken()}` }
      }
    );
    const data = res.data;

    form.value = {
      nombre: String(data.nombre ?? ""),
      descripcion: String(data.descripcion ?? ""),
      nivel: String(data.nivel ?? ""), // Convertir a string
      objetivo: String(data.objetivo ?? ""), // Convertir a string
      activo: Boolean(data.activo ?? false), // Asegurar booleano
      fechaInicio: data.fechaInicio ? data.fechaInicio.slice(0, 10) : "", // Fecha como string yyyy-mm-dd
      fechaFin: data.fechaFin ? data.fechaFin.slice(0, 10) : ""
    };

    dias.value = data.dias.map((dia) => ({
      ...dia,
      fecha: dia.fecha.slice(0, 10),
      ejercicios: dia.ejercicios.map((e) => ({
        ...e,
        peso: String(e.peso ?? 0),
        descanso: String(e.descanso ?? 0),
        series: String(e.series ?? 0),
        repeticiones: String(e.repeticiones ?? 0)
      }))
    }));

    const resEjercicios = await axios.get(
      `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/exercises/get`
    );
    ejercicios.value = resEjercicios.data;
  } catch (err) {
    console.error("Error cargando plan:", err);
  } finally {
    emit("loading-end");
  }
});

const addEjercicio = (dia) => {
  dia.ejercicios.push({
    id: Date.now(), // Temporal en frontend
    ejercicioId: 0,
    series: "0",
    repeticiones: "0",
    peso: "0",
    descanso: "0",
    ejercicioNombre: "",
    orden: dia.ejercicios.length + 1
  });
};

watch(
  () => diaSeleccionado.value?.grupoMuscular,
  (nuevoValor, valorAnterior) => {
    // console.log(`Grupo muscular cambiado de "${valorAnterior}" a "${nuevoValor}"`);

    // console.log(diaSeleccionado.value.ejercicios.forEach((e) => console.log(e.ejercicioId)));
    // console.log(diaSeleccionado.value.ejercicios.forEach((e) => e.ejercicioId == ""));
    ejerciciosDisponibles.value = ejercicios.value.filter((e) => e.categoria === nuevoValor);

    let ejerciciosLimpios = ejercicios.value.filter((e) => e.categoria != nuevoValor);
    ejerciciosExtras.value = ejerciciosLimpios;
  }
);

// Ordenamos los ejercicios para mostrarlos en el orden correcto
watch(diaSeleccionado, () => {
  if (diaSeleccionado.value) {
    diaSeleccionado.value.ejercicios.sort((a, b) => a.orden - b.orden);
  }
});

function eliminarEjercicio(dia, index) {
  dia.ejercicios.splice(index, 1);
}

function añadirDia() {
  let nuevoDiaNumero = 1;
  let nuevaFecha = new Date();

  if (dias.value.length > 0) {
    // Obtener el último día
    const ultimoDia = dias.value[dias.value.length - 1];

    // Día siguiente para diaNumero
    nuevoDiaNumero = ultimoDia.diaNumero + 1;

    // Fecha siguiente al último día
    const fechaUltimoDia = new Date(ultimoDia.fecha);
    fechaUltimoDia.setDate(fechaUltimoDia.getDate() + 1);
    nuevaFecha = fechaUltimoDia;
  }

  const nuevoDia = {
    diaNumero: nuevoDiaNumero,
    grupoMuscular: "",
    ejercicios: [],
    fecha: nuevaFecha.toISOString()
  };

  dias.value.push(nuevoDia);
  diaSeleccionado.value = nuevoDia;
}

function eliminarUltimoDia() {
  if (dias.length === 0) return;
  const eliminado = dias.value.pop();
  // deseleccionar si justo eliminaste el que estaba seleccionado
  if (diaSeleccionado?.id === eliminado.id) diaSeleccionado = dias[dias.length - 1] ?? null;
  contadorDia = dias.length > 0 ? Math.max(...dias.map((d) => d.diaNumero)) + 1 : 1;
}

function formatFecha(fecha) {
  if (!fecha) return "";
  const opciones = { day: "2-digit", month: "2-digit" };
  return new Intl.DateTimeFormat("es-ES", opciones).format(new Date(fecha));
}

function moverEjercicioArriba(index) {
  diaSeleccionado.value.ejercicios[index - 1].orden = index - 1;
  diaSeleccionado.value.ejercicios[index - 2].orden = index;
  diaSeleccionado.value?.ejercicios.sort((a, b) => a.orden - b.orden);
}

function moverEjercicioAbajo(index) {
  diaSeleccionado.value.ejercicios[index - 1].orden = index + 1;
  diaSeleccionado.value.ejercicios[index].orden = index;
  diaSeleccionado.value?.ejercicios.sort((a, b) => a.orden - b.orden);
}
</script>

<template>
  <div class="mx-auto w-full flex flex-col lg:flex-row gap-4 h-full">
    <!-- Seccion de dias -->
    <div class="w-full lg:w-1/2 bg-white p-2 rounded-2xl">
      <div class="flex flex-col h-full bg-white rounded-2xl p-4 overflow-y-auto">
        <div class="flex flex-row justify-between">
          <h2 class="text-2xl font-bold mb-4">Editar Plan</h2>
          <label class="flex items-center gap-2 cursor-pointer select-none">
            <span class="text-gray-700 font-semibold">Activo</span>
            <div
              class="flex items-center w-12 h-6 transition duration-200 ease-linear rounded-full"
              :class="form.activo ? 'bg-tertiary-500' : 'bg-gray-300'"
              @click="form.activo = !form.activo"
              role="switch"
              aria-checked="form.activo"
            >
              <div
                class="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200"
                :class="form.activo ? 'translate-x-6' : 'translate-x-1'"
              ></div>
            </div>
          </label>
        </div>

        <!-- Formulario del plan -->
        <form @submit.prevent="submit" class="flex flex-col gap-4 h-full justify-between">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col md:flex-row gap-2">
              <div class="flex flex-col gap-2 w-full md:w-1/2">
                <div>
                  <label for="nombre" class="block text-gray-700 font-semibold mb-1">Nombre del plan</label>
                  <input
                    v-model="form.nombre"
                    placeholder="Nombre"
                    class="px-3 py-2 mt-1 border-2 border-gray-400 rounded-lg p-2 w-full"
                  />
                </div>
                <div>
                  <label for="descripcion" class="block text-gray-700 font-semibold mb-1">Descripción</label>
                  <textarea
                    v-model="form.descripcion"
                    placeholder="Descripción"
                    class="px-3 py-2 mt-1 border-2 border-gray-400 rounded-lg p-2 w-full"
                  />
                </div>
              </div>
              <div class="flex flex-col gap-2 w-full md:w-1/2">
                <div>
                  <label class="block text-gray-700 font-semibold mb-1"> Nivel: </label>
                  <select
                    v-model="form.nivel"
                    required
                    class="px-3 py-2 mt-1 border-2 border-gray-400 rounded-lg p-2 w-full"
                  >
                    <option value="" disabled>Selecciona nivel</option>
                    <option value="basico">Basico</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                    <option value="personalizado">Personalizado</option>
                  </select>
                </div>
                <div>
                  <label class="block text-gray-700 font-semibold mb-1"> Objetivo: </label>
                  <select
                    v-model="form.objetivo"
                    required
                    class="px-3 py-2 mt-1 border-2 border-gray-400 rounded-lg p-2 w-full"
                  >
                    <option value="" disabled>Selecciona objetivo</option>
                    <option value="hipertrofia">Hipertrofia</option>
                    <option value="fuerza">Fuerza</option>
                    <option value="personalizado">Personalizado</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Lista de días para seleccionar -->
            <div class="flex flex-col gap-2">
              <!-- <label>Dias del plan</label> -->
              <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 overflow-y-auto max-h-[225px] p-2 bg-gray-100 rounded-lg shadow-inner"
              >
                <div
                  v-for="(dia, index) in dias"
                  :key="dia.id"
                  @click="diaSeleccionado = dia"
                  class="p-3 shadow-md rounded-lg cursor-pointer hover:inset-shadow-sm transition relative"
                  :class="[
                    diaSeleccionado?.id === dia.id
                      ? 'bg-tertiary-500 inset-shadow-sm inset-shadow-orange-950'
                      : 'bg-white hover:bg-gray-100 active:bg-gray-300 active:inset-shadow-gray-950'
                  ]"
                >
                  <div class="flex flex-row gap-2 items-center justify-between">
                    <div class="flex flex-col justify-between">
                      Día {{ dia.diaNumero }} ({{ new Date(dia.fecha).toLocaleDateString() }})
                      <span class="text-sm text-gray-500 block">{{
                        capitalizar(dia.grupoMuscular) || "Sin grupo"
                      }}</span>
                    </div>

                    <!-- Botón eliminar solo en el último día -->
                    <button
                      v-if="index === dias.length - 1"
                      @click.stop.prevent="eliminarUltimoDia()"
                      class="bg-red-600 hover:bg-red-700 text-white w-fit h-fit p-1 rounded-lg text-xs"
                      :disabled="dias.length === 0"
                      title="Eliminar último día"
                    >
                      <Trash />
                    </button>
                  </div>
                </div>

                <!-- “Día” para añadir nuevo día, dentro del grid -->
                <div
                  @click.prevent="añadirDia()"
                  class="p-3 cursor-pointer rounded border-dashed border-2 border-gray-300 flex items-center justify-center text-green-600 hover:bg-green-100 hover:border-green-400"
                >
                  + Añadir Día
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-row">
            <button
              type="submit"
              class="bg-tertiary-500 hover:bg-tertiary-600 flex w-full justify-center text-white font-medium px-4 py-2 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-300"
            >
              <p>Guardar Cambios</p>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Sección de ejercicios -->
    <div class="w-full lg:w-1/2 flex flex-col bg-white rounded-2xl h-full">
      <!-- Ejercicios del día seleccionado -->
      <div v-if="diaSeleccionado" class="flex flex-col flex-1 p-6 px-6 rounded overflow-hidden gap-2">
        <!-- Cabecera -->
        <div class="flex flex-col-reverse sm:flex-row-reverse justify-between items-center gap-2">
          <div
            class="flex flex-row justify-between items-center w-full sm:flex-1/2 bg-gray-200 p-2 px-3 rounded-2xl gap-4"
          >
            <label>Grupo Muscular</label>

            <select
              v-model="diaSeleccionado.grupoMuscular"
              id=""
              class="block flex-1/2 px-4 py-2 text-sm text-black bg-gray-50 border border-[#f56e0f] rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f56e0f] cursor-pointer"
            >
              <option value="">No asignado</option>
              <option value="piernas">Pierna</option>
              <option value="pecho">Pecho</option>
              <option value="espalda">Espalda</option>
              <option value="hombros">Hombros</option>
              <option value="brazos">Brazos</option>
              <option value="abdomen">Abdomen</option>
              <option value="full body">Full Body</option>
            </select>
          </div>

          <div class="bg-tertiary-500 p-2 px-4 rounded-2xl w-full sm:w-fit h-full flex items-center">
            <h3 class="font-semibold text-lg">
              Día {{ diaSeleccionado.diaNumero + " (" + new Date(diaSeleccionado.fecha).toLocaleDateString() + ")" }}
            </h3>
          </div>
        </div>

        <!-- Lista de ejercicios scrolleable -->
        <div class="flex-1 overflow-y-auto pr-2 mr-2 space-y-2 p-2 bg-gray-100 rounded-2xl">
          <transition-group name="move" tag="div" class="space-y-2">
            <!-- Ejercicios -->
            <div
              v-for="ej in diaSeleccionado.ejercicios"
              :key="ej.id"
              class="flex gap-2 bg-white p-2 rounded-xl shadow-lg items-center transition-all duration-200 ease-in-out"
            >
              <div class="flex flex-col gap-2 w-fit h-fit">
                <button
                  @click="moverEjercicioArriba(ej.orden)"
                  :disabled="ej.orden === 1"
                  class="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md p-1 cursor-pointer disabled:opacity-50"
                  title="Mover arriba"
                >
                  ▲
                </button>

                <div class="border-gray-400 text-center border-2 rounded-md p-1 appearance-none w-12">
                  {{ ej.orden }}
                </div>
                <button
                  @click="moverEjercicioAbajo(ej.orden)"
                  :disabled="ej.orden === diaSeleccionado.ejercicios.length"
                  class="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md p-1 cursor-pointer disabled:opacity-50"
                  title="Mover abajo"
                >
                  ▼
                </button>
              </div>

              <div class="flex flex-col w-full gap-1 h-full">
                <div class="flex flex-row gap-2">
                  <select v-model="ej.ejercicioId" class="border-2 border-gray-400 rounded-lg p-2 w-full">
                    <option value="0" disabled>Selecciona un ejercicio</option>
                    <option v-for="e in ejerciciosDisponibles" :key="e.id" :value="e.id">
                      {{ e.nombre }} - ({{ capitalizar(e.categoria) }})
                    </option>
                    <optgroup label="Variados">
                      <option v-for="e in ejerciciosExtras" :key="e.id" :value="e.id">
                        {{ e.nombre }} - ({{ capitalizar(e.categoria) }})
                      </option>
                    </optgroup>
                  </select>
                  <button
                    @click="eliminarEjercicio(diaSeleccionado, j)"
                    class="bg-red-600 hover:bg-red-800 text-white transition p-2 w-fit rounded-lg cursor-pointer"
                    title="Eliminar ejercicio"
                  >
                    <Trash />
                  </button>
                </div>
                <div class="grid grid-cols-4">
                  <p class="pl-1 text-sm">Series</p>
                  <p class="pl-1 text-sm hidden xl:inline">Repeticiones</p>
                  <p class="pl-1 text-sm xl:hidden">Rep</p>
                  <p class="pl-1 text-sm">Peso</p>
                  <p class="pl-1 text-sm hidden xl:inline">Descanso</p>
                  <p class="pl-1 text-sm xl:hidden">Des</p>
                </div>
                <div class="flex flex-row gap-2">
                  <input
                    v-model="ej.series"
                    type="text"
                    placeholder="Series"
                    class="border-2 border-gray-400 rounded-lg p-2 w-full"
                  />
                  <input
                    v-model="ej.repeticiones"
                    type="text"
                    placeholder="Reps"
                    class="border-2 border-gray-400 rounded-lg p-2 w-full"
                  />
                  <input
                    v-model="ej.peso"
                    type="text"
                    placeholder="Peso"
                    class="border-2 border-gray-400 rounded-lg p-2 w-full"
                  />
                  <input
                    v-model="ej.descanso"
                    type="text"
                    placeholder="Descanso"
                    class="border-2 border-gray-400 rounded-lg p-2 w-full"
                  />
                </div>
              </div>
            </div>
          </transition-group>

          <div v-if="diaSeleccionado.ejercicios.length === 0" class="text-gray-500 mb-4">
            No hay ejercicios para este día. Si lo dejas en blanco se considerará un día de descanso.
          </div>
        </div>

        <!-- Botón fijo abajo -->
        <button
          @click.prevent="addEjercicio(diaSeleccionado)"
          class="bg-tertiary-500 hover:bg-tertiary-600 flex text-white font-medium px-4 py-2 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-300"
        >
          + Añadir ejercicio
        </button>
      </div>
      <div v-else class="flex flex-col justify-center items-center h-full">
        <p class="mb-2 italic text-gray-800 font-semibold">Selecciona un dia de entrenamiento</p>
        <p class="italic text-sm text-gray-600">Se cargará la información de ese dia</p>
      </div>
    </div>
  </div>
</template>
