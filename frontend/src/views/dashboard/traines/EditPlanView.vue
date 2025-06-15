<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "@/utils/Auth";
import { LucideAirVent, Trash } from "lucide-vue-next";
import { z } from "zod";
import { useToast } from "vue-toastification";

const toast = useToast();

const emit = defineEmits(["loading-start", "loading-end"]);

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
const ejerciciosDisponibles = ref([]);
const diaSeleccionado = ref(null);

onMounted(async () => {
  emit("loading-start");

  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/trains/plan/${planId}`, {
      headers: { Authorization: `Bearer ${auth.getToken()}` }
    });
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

    const resEjercicios = await axios.get(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/exercises/get`);
    ejerciciosDisponibles.value = resEjercicios.data;
  } catch (err) {
    console.error("Error cargando plan:", err);
  } finally {
    emit("loading-end");
  }
});

const addEjercicio = (dia) => {
  dia.ejercicios.push({
    id: Date.now(), // Temporal en frontend
    ejercicioId: 1,
    series: "0",
    repeticiones: "0",
    peso: "0",
    descanso: "0",
    ejercicioNombre: ""
  });
};

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

const submit = async () => {
  const ejercicioSchema = z.object({
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
      })
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
    nivel: z.enum(["basico", "avanzado", "personalizado"]),
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
          descanso: e.descanso
        }))
      }))
    };

    planSchema.parse(planData);
    const userId = route.params.userId;

    await axios.patch(`${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/trains/update/${planId}/user/${userId}`, planData, {
      headers: { Authorization: `Bearer ${auth.getToken()}` }
    });
    router.push("/dashboard/train");
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

function formatFecha(fecha) {
  if (!fecha) return "";
  const opciones = { day: "2-digit", month: "2-digit" };
  return new Intl.DateTimeFormat("es-ES", opciones).format(new Date(fecha));
}

function moverEjercicioArriba(index) {
  if (index === 0) return; // ya está arriba
  const ejercicios = diaSeleccionado.value.ejercicios;
  [ejercicios[index - 1], ejercicios[index]] = [ejercicios[index], ejercicios[index - 1]];
}

function moverEjercicioAbajo(index) {
  const ejercicios = diaSeleccionado.value.ejercicios;
  if (index === ejercicios.length - 1) return; // ya está abajo
  [ejercicios[index], ejercicios[index + 1]] = [ejercicios[index + 1], ejercicios[index]];
}
</script>

<template>
  <div class="mx-auto w-full flex flex-col lg:flex-row gap-4 h-full">
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

        <!-- 📝 Formulario del plan -->
        <form @submit.prevent="submit" class="space-y-4">
          <div>
            <label for="nombre" class="block text-gray-700 font-semibold mb-2">Nombre del plan</label>
            <input v-model="form.nombre" placeholder="Nombre" class="border rounded p-2 w-full" />
          </div>
          <div>
            <label for="descripcion" class="block text-gray-700 font-semibold mb-2">Descripción</label>
            <textarea v-model="form.descripcion" placeholder="Descripción" class="border rounded p-2 w-full" />
          </div>
          <div class="flex flex-row gap-2">
            <div class="w-1/2">
              <label class="block">
                Nivel:
                <select v-model="form.nivel" required class="w-full rounded border px-3 py-2 mt-1">
                  <option value="" disabled>Selecciona nivel</option>
                  <option value="basico">Basico</option>
                  <option value="avanzado">Avanzado</option>
                  <option value="personalizado">Personalizado</option>
                </select>
              </label>
            </div>
            <div class="w-1/2">
              <label class="block">
                Objetivo:
                <select v-model="form.objetivo" required class="w-full rounded border px-3 py-2 mt-1">
                  <option value="" disabled>Selecciona objetivo</option>
                  <option value="hipertrofia">Hipertrofia</option>
                  <option value="fuerza">Fuerza</option>
                  <option value="personalizado">Personalizado</option>
                </select>
              </label>
            </div>
          </div>

          <!-- 📆 Lista de días para seleccionar -->
          <div class="flex flex-col gap-2">
            <label>Dias del plan</label>
            <div
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 overflow-y-auto max-h-[250px] p-2 bg-gray-100 rounded"
            >
              <div
                v-for="(dia, index) in dias"
                :key="dia.id"
                @click="diaSeleccionado = dia"
                class="p-3 shadow-md rounded cursor-pointer hover:inset-shadow-sm transition relative"
                :class="[
                  diaSeleccionado?.id === dia.id ? 'bg-orange-400 hover:bg-orange-500' : 'bg-white hover:bg-gray-200'
                ]"
              >
                <div class="flex flex-row gap-2 items-center justify-between">
                  <div class="flex flex-col justify-between">
                    Día {{ dia.diaNumero }} ({{ new Date(dia.fecha).toLocaleDateString() }})
                    <span class="text-sm text-gray-500 block">{{ dia.grupoMuscular || "Sin grupo" }}</span>
                  </div>

                  <!-- Botón eliminar solo en el último día -->
                  <button
                    v-if="index === dias.length - 1"
                    @click.stop.prevent="eliminarUltimoDia()"
                    class="bg-red-500 hover:bg-red-600 text-white w-fit h-fit p-1 rounded text-xs"
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

          <button
            type="submit"
            class="px-4 py-2 rounded bg-tertiary-500 hover:bg-orange-700 cursor-pointer text-white w-full mt-6"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
    <div class="w-full lg:w-1/2 flex flex-col bg-white rounded-2xl h-full">
      <!-- Ejercicios del día seleccionado -->
      <div v-if="diaSeleccionado" class="flex flex-col flex-1 p-6 rounded overflow-hidden">
        <!-- Cabecera -->
        <h3 class="font-semibold text-xl mb-2">
          Día {{ diaSeleccionado.diaNumero + " (" + new Date(diaSeleccionado.fecha).toLocaleDateString() + ")" }}
        </h3>

        <select v-model="diaSeleccionado.grupoMuscular" class="p-2 border rounded-lg w-full mb-4">
          <option disabled value="">No asignado</option>
          <option value="piernas">Pierna</option>
          <option value="pecho">Pecho</option>
          <option value="espalda">Espalda</option>
          <option value="hombros">Hombros</option>
          <option value="brazos">Brazos</option>
          <option value="abdomen">Abdomen</option>
          <option value="full body">Full Body</option>
        </select>

        <!-- Lista de ejercicios scrolleable -->
        <label class="mb-2">Ejercicios</label>
        <div class="flex-1 overflow-y-auto pr-2 space-y-2 p-2 bg-gray-100 rounded-md">
          <transition-group name="move" tag="div" class="space-y-2">
            <div class="grid grid-cols-6 gap-2">
              <p class="col-span-2 pl-1 text-sm">Ejercicios</p>
              <p class="pl-1 text-sm">Series</p>
              <p class="pl-1 text-sm">Repeticiones</p>
              <p class="pl-1 text-sm">Peso</p>
              <p class="pl-1 text-sm">Descanso</p>
            </div>
            <div
              v-for="(ej, j) in diaSeleccionado.ejercicios"
              :key="ej.id ?? j"
              class="grid grid-cols-6 gap-2 bg-white p-2 rounded-xl shadow-lg items-center transition-all duration-200 ease-in-out"
            >
              <select v-model="ej.ejercicioId" class="border rounded p-2 w-full col-span-2">
                <option :value="null" disabled>Selecciona un ejercicio</option>
                <option v-for="e in ejerciciosDisponibles" :key="e.id" :value="e.id">
                  {{ e.nombre }} - ({{ capitalizar(e.categoria) }})
                </option>
              </select>
              <input v-model="ej.series" type="text" placeholder="Series" class="border rounded p-2 w-full" />
              <input v-model="ej.repeticiones" type="text" placeholder="Reps" class="border rounded p-2 w-full" />
              <input v-model="ej.peso" type="text" placeholder="Peso" class="border rounded p-2 w-full" />
              <input v-model="ej.descanso" type="text" placeholder="Descanso" class="border rounded p-2 w-full" />
              <div class="flex flex-row gap-1 w-fit h-fit">
                <button
                  @click="moverEjercicioArriba(j)"
                  :disabled="j === 0"
                  class="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded p-1 w-fit h-fit cursor-pointer"
                  title="Mover arriba"
                >
                  ▲
                </button>
                <button
                  @click="moverEjercicioAbajo(j)"
                  :disabled="j === diaSeleccionado.ejercicios.length - 1"
                  class="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded p-1"
                  title="Mover abajo"
                >
                  ▼
                </button>
                <button
                  @click="eliminarEjercicio(diaSeleccionado, j)"
                  class="bg-red-600 hover:bg-red-800 text-white transition p-1 w-fit rounded-lg cursor-pointer"
                  title="Eliminar ejercicio"
                >
                  <Trash />
                </button>
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
          class="bg-tertiary-500 hover:bg-orange-700 cursor-pointer text-white px-4 py-2 rounded text-sm mt-4 self-start"
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
