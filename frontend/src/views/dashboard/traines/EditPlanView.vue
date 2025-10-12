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
    ejercicioId: z.number().refine((val) => /^\d+$/.test(val.toString()) && Number(val) >= 1, {
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
      })
  });

  const ejercicioDiaSchema = z.object({
    tipo: z.literal("ejercicio"),
    orden: z.number().int().min(1, "El ejercicio debe tener un orden"),
    ejercicio: ejercicioSchema
  });

  const circuitoSchema = z.object({
    tipo: z.literal("circuito"),
    orden: z.number().int().min(1, "El circuito debe tener un orden"),
    circuito: z.object({
      rondas: z
        .string()
        .nonempty("El circuito debe tener al menos una ronda.")
        .refine((val) => /^\d+$/.test(val.toString()), {
          message: "El numero de rondas debe ser un número valido y positivo."
        }),
      descansoEntre: z
        .string()
        .nonempty("Debe haber descanso entre las rondas.")
        .refine((val) => /^\d+$/.test(val.toString()), {
          message: "El descanso entre las rondas debe ser un número valido y positivo."
        }),
      tiempoEntre: z
        .string()
        .nonempty("Hay que especificar la duración de las rondas.")
        .refine((val) => /^\d+$/.test(val.toString()), {
          message: "La duración de las rondas debe ser un número valido y positivo."
        }),
      ejercicios: z
        .array(
          z.object({
            ejercicioId: z.number().refine((val) => /^\d+$/.test(val.toString()) && Number(val) >= 1, {
              message: "Por favor seleccione un ejercicio para el circuito."
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
            orden: z.number().int().min(1, "El ejercicio del circuito debe tener un orden")
          })
        )
        .nonempty("El circuito debe tener al menos un ejercicio.")
    })
  });

  const carreraSchema = z.object({
    tipo: z.literal("carrera"),
    orden: z.number().int().min(1, "La carrera debe tener un orden"),
    carrera: z.object({
      distancia: z
        .string()
        .nonempty("Debes indicar la distancia de tu carrera")
        .refine((val) => /^\d+$/.test(val.toString()) && Number(val) >= 1, {
          message: "La distancia debe ser un número valido y positivo."
        })
        .optional(),
      duracion: z
        .string()
        .nonempty("Debes indicar la duración de tu carrera")
        .refine((val) => /^\d+$/.test(val.toString()) && Number(val) >= 1, {
          message: "La duración debe ser un número valido y positivo."
        })
        .optional(),
      ritmo: z
        .string()
        .refine((val) => /^\d+$/.test(val.toString()) && Number(val) >= 1, {
          message: "El ritmo debe ser un número valido y positivo."
        })
        .optional()
    })
  });

  const notaSchema = z.object({
    tipo: z.literal("nota"),
    orden: z.number().int().min(1, "La nota debe tener un orden"),
    nota: z.object({
      nota: z.string().nonempty("La nota es obligatoria")
    })
  });

  const elementosSchema = z.discriminatedUnion("tipo", [ejercicioDiaSchema, circuitoSchema, carreraSchema, notaSchema]);

  const diaSchema = z.object({
    diaNumero: z.number().int().positive(),
    grupoMuscular: z.enum(["pecho", "brazos", "hombros", "full body", "espalda", "abdomen", "piernas"], {
      message: "Grupo muscular inválido"
    }),
    fecha: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Fecha inválida"
    }),
    elementos: z.array(elementosSchema).nonempty("Debe haber al menos un elemento en el día.")
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

        // Mapeamos los elementos del día
        elementos: d.elementos.map((e) => {
          const base = {
            orden: e.orden,
            tipo: e.tipo // "ejercicio" | "circuito" | "carrera"
          };

          if (e.tipo === "ejercicio") {
            return {
              ...base,
              ejercicio: {
                ejercicioId: e.ejercicio.ejercicioId,
                series: e.ejercicio.series,
                repeticiones: e.ejercicio.repeticiones,
                peso: e.ejercicio.peso,
                descanso: e.ejercicio.descanso
              }
            };
          }

          if (e.tipo === "circuito") {
            // Si es un circuito con ejercicios dentro
            return {
              ...base,
              circuito: {
                rondas: e.circuito.rondas,
                descansoEntre: e.circuito.descansoEntre,
                tiempoEntre: e.circuito.tiempoEntre,
                ejercicios: e.circuito.ejercicios.map((ej) => ({
                  ejercicioId: ej.ejercicioId,
                  repeticiones: ej.repeticiones,
                  peso: ej.peso,
                  orden: ej.orden
                  // descanso: ej.descanso,
                  // series: ej.series,
                }))
              }
            };
          }

          if (e.tipo === "carrera") {
            // Si es una carrera o ejercicio de cardio
            return {
              ...base,
              carrera: {
                distancia: e.carrera.distancia,
                duracion: e.carrera.duracion,
                ritmo: e.carrera.ritmo
              }
            };
          }

          if (e.tipo === "nota") {
            return {
              ...base,
              nota: {
                nota: e.nota.nota
              }
            };
          }

          return base;
        })
      }))
    };

    // console.log(JSON.stringify(planData.dias, null, 2));

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
      // console.error("Errores de validación:", err.errors);
      toast.error(err.errors[0].message);
    } else {
      // console.error("Error al guardar cambios:", err);
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

    // console.log(data.dias);

    dias.value = data.dias.map((dia) => ({
      ...dia,
      fecha: dia.fecha?.slice(0, 10) ?? "",
      elementos: dia.elementos.map((e) => {
        const base = {
          id: e.id ?? Date.now() + Math.random(),
          tipo: e.tipo,
          orden: e.orden ?? 1
        };

        if (e.tipo === "ejercicio") {
          return {
            ...base,
            ejercicio: {
              id: e.ejercicio?.id ?? Date.now() + 1,
              ejercicioId: e.ejercicio?.ejercicioId ?? 0,
              series: String(e.ejercicio?.series ?? "1"),
              repeticiones: String(e.ejercicio?.repeticiones ?? "10"),
              peso: String(e.ejercicio?.peso ?? "0"),
              descanso: String(e.ejercicio?.descanso ?? "60")
            }
          };
        }

        if (e.tipo === "circuito") {
          return {
            ...base,
            circuito: {
              id: e.circuito?.id ?? Date.now() + 2,
              rondas: String(e.circuito?.rondas ?? "1"),
              descansoEntre: String(e.circuito?.descansoEntre ?? "60"),
              tiempoEntre: String(e.circuito?.tiempoEntre ?? "30"),
              ejercicios: (e.circuito?.ejercicios ?? []).map((ej, idx) => ({
                id: ej.id ?? Date.now() + idx,
                ejercicioId: ej.ejercicioId ?? 0,
                repeticiones: String(ej.repeticiones ?? "10"),
                peso: String(ej.peso ?? "0"),
                orden: ej.orden ?? idx + 1
              }))
            }
          };
        }

        if (e.tipo === "carrera") {
          return {
            ...base,
            carrera: {
              id: e.carrera?.id ?? Date.now() + 3,
              distancia: String(e.carrera?.distancia ?? "1"),
              duracion: String(e.carrera?.duracion ?? "60"),
              ritmo: String(e.carrera?.ritmo ?? "30")
            }
          };
        }

        if (e.tipo === "nota") {
          return {
            ...base,
            nota: {
              id: e.nota?.id ?? Date.now() + 4,
              nota: String(e.nota?.nota ?? "")
            }
            
          };
        }

        return base;
      })
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

// Agregar un ejercicio como ElementoDia
const addEjercicio = (dia) => {
  dia.elementos.push({
    id: Date.now(), // temporal en frontend
    tipo: "ejercicio",
    orden: dia.elementos.length + 1,
    ejercicio: {
      id: Date.now() + 1, // id temporal para el EjercicioDia
      ejercicioId: 0,
      series: "1",
      repeticiones: "10",
      peso: "0",
      descanso: "60"
    }
  });
};

// Agregar un circuito como ElementoDia
const addCircuito = (dia) => {
  dia.elementos.push({
    id: Date.now(), // temporal en frontend
    tipo: "circuito",
    orden: dia.elementos.length + 1,
    circuito: {
      id: Date.now() + 1, // id temporal para el circuito
      rondas: "1",
      descansoEntre: "60",
      tiempoEntre: "30",
      ejercicios: [] // Ejercicios dentro del circuito
    }
  });
};

const addEjercicioCircuito = (circuito) => {
  circuito.ejercicios.push({
    id: Date.now(), // temporal en frontend
    ejercicioId: 0,
    series: "1",
    repeticiones: "10",
    peso: "0",
    descanso: "60",
    orden: circuito.ejercicios.length + 1
  });
};

// Agregar una carrera como ElementoDia

const addCarrera = (dia) => {
  dia.elementos.push({
    id: Date.now(), // temporal en frontend
    tipo: "carrera",
    orden: dia.elementos.length + 1,
    carrera: {
      id: Date.now() + 1, // id temporal para la carrera
      distancia: "1",
      duracion: "60",
      ritmo: "30"
    }
  });
};

const addNota = (dia) => {
  dia.elementos.push({
    id: Date.now(), // temporal en frontend
    tipo: "nota",
    orden: dia.elementos.length + 1,
    nota: {
      id: Date.now() + 1,
      nota: ""
    }
  });
};

watch(
  () => diaSeleccionado.value?.grupoMuscular,
  (nuevoValor, valorAnterior) => {
    ejerciciosDisponibles.value = ejercicios.value.filter((e) => e.categoria === nuevoValor);

    let ejerciciosLimpios = ejercicios.value.filter((e) => e.categoria != nuevoValor);
    ejerciciosExtras.value = ejerciciosLimpios;
  }
);

watch(
  () => diaSeleccionado.value?.fecha,
  () => {
    // Reordenar todos los días por fecha
    dias.value.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    // Reasignar diaNumero secuencialmente
    dias.value.forEach((dia, index) => {
      dia.diaNumero = index + 1;
    });
  },
  { deep: true }
);

// Ordenamos los ejercicios para mostrarlos en el orden correcto
watch(diaSeleccionado, () => {
  // console.log("diaSeleccionado.value", diaSeleccionado.value);
  if (diaSeleccionado.value === null) return;

  if (diaSeleccionado.value) {
    diaSeleccionado.value.elementos.sort((a, b) => a.orden - b.orden);
  }

  // Corregimos el orden si no tenia orden antes
  let ordenado = true;
  diaSeleccionado.value.elementos.forEach((e) => {
    if (e.orden == 0) {
      ordenado = false;
    }
  });

  if (!ordenado) {
    for (let i = 0; i < diaSeleccionado.value.elementos.length; i++) {
      diaSeleccionado.value.elementos[i].orden = i + 1;
    }
  }
});

function eliminarElemento(dia, id) {
  const index = dia.elementos.findIndex((e) => e.id === id);
  if (index === -1) return;

  dia.elementos.splice(index, 1);

  dia.elementos.forEach((elemento, i) => {
    elemento.orden = i + 1;
  });
}

function eliminarEjercicio(circuito, id) {
  const index = circuito.ejercicios.findIndex((e) => e.id === id);
  circuito.ejercicios.splice(index, 1);

  circuito.ejercicios.forEach((ejercicio, i) => {
    ejercicio.orden = i + 1;
  });
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
    elementos: [],
    fecha: nuevaFecha.toISOString().split("T")[0]
  };

  dias.value.push(nuevoDia);
  diaSeleccionado.value = nuevoDia;
}

function eliminarUltimoDia() {
  if (dias.length === 0) return;
  let eliminado = dias.value.pop();

  if (diaSeleccionado.value.id === eliminado.id) diaSeleccionado.value = dias.value[dias.value.length - 1] ?? null;
}

function formatFecha(fecha) {
  if (!fecha) return "";
  const opciones = { day: "2-digit", month: "2-digit" };
  return new Intl.DateTimeFormat("es-ES", opciones).format(new Date(fecha));
}

function moverElementoArriba(index) {
  diaSeleccionado.value.elementos[index - 1].orden = index - 1;
  diaSeleccionado.value.elementos[index - 2].orden = index;
  diaSeleccionado.value?.elementos.sort((a, b) => a.orden - b.orden);
}

function moverElementoAbajo(index) {
  diaSeleccionado.value.elementos[index - 1].orden = index + 1;
  diaSeleccionado.value.elementos[index].orden = index;
  diaSeleccionado.value?.elementos.sort((a, b) => a.orden - b.orden);
}

function moverEjercicioArriba(circuito, orden) {
  circuito.ejercicios[orden - 1].orden = orden - 1;
  circuito.ejercicios[orden - 2].orden = orden;
  circuito.ejercicios.sort((a, b) => a.orden - b.orden);
}

function moverEjercicioAbajo(circuito, orden) {
  circuito.ejercicios[orden - 1].orden = orden + 1;
  circuito.ejercicios[orden].orden = orden;
  circuito.ejercicios.sort((a, b) => a.orden - b.orden);
}
</script>

<template>
  <div class="mx-auto w-full flex flex-col lg:flex-row gap-4 h-full">
    <!-- Seccion de dias -->
    <div class="w-full lg:w-1/2 bg-white p-2 rounded-2xl">
      <div class="flex flex-col h-full bg-white rounded-2xl p-4 overflow-y-auto">
        <div class="flex flex-row justify-between items-center mb-2">
          <h2 class="text-xl font-bold">Editar Plan</h2>
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
                  <label for="nivel" class="block text-gray-700 font-semibold mb-1"> Nivel: </label>
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
              <div class="flex flex-col gap-2 w-full md:w-1/2">
                <div>
                  <label for="fechaInicio" class="block text-gray-700 font-semibold mb-1">Fec Inicio</label>
                  <input
                    v-model="form.fechaInicio"
                    type="date"
                    class="px-3 py-2 mt-1 border-2 border-gray-400 rounded-lg p-2 w-full"
                  />
                </div>
                <div>
                  <label for="fechaInicio" class="block text-gray-700 font-semibold mb-1">Fec Final</label>
                  <input
                    v-model="form.fechaFin"
                    type="date"
                    :min="new Date(form.fechaInicio)"
                    class="px-3 py-2 mt-1 border-2 border-gray-400 rounded-lg p-2 w-full"
                  />
                </div>
              </div>
            </div>

            <!-- Lista de días para seleccionar -->
            <div class="flex flex-col gap-2">
              <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 overflow-y-auto max-h-[225px] lg:max-h-[320px] h-full p-3 bg-gray-100 rounded-3xl inset-shadow-sm inset-shadow-gray-400/80"
              >
                <div
                  v-for="(dia, index) in dias"
                  :key="dia.id"
                  @click="diaSeleccionado = dia"
                  class="p-3 px-5 shadow-sm shadow-gray-300 rounded-2xl cursor-pointer hover:inset-shadow-sm transition relative"
                  :class="[
                    diaSeleccionado === dia
                      ? 'bg-tertiary-500 inset-shadow-sm inset-shadow-orange-950'
                      : 'bg-white hover:bg-gray-200 active:bg-gray-300 active:inset-shadow-gray-950 hover:inset-shadow-black/50 inset-shadow-sm'
                  ]"
                >
                  <div class="flex flex-row gap-2 items-center justify-between">
                    <div class="flex flex-col justify-between">
                      <div class="flex items-center gap-2">Día {{ dia.diaNumero }}</div>
                      <span class="text-xs font-semibold items-start my-1"
                        >({{ new Date(dia.fecha).toISOString().split("T")[0] }})</span
                      >
                      <span
                        class="text-xs font-semibold text-orange-700 block"
                        :class="diaSeleccionado === dia ? 'text-white' : ''"
                        >{{ capitalizar(dia.grupoMuscular) || "Sin grupo" }}</span
                      >
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
                  class="p-3 py-5 cursor-pointer rounded-xl border-dashed border-2 xl:border-gray-300 flex items-center justify-center text-green-600 xl:hover:bg-green-100 xl:hover:border-green-400 border-green-400 bg-green-100 xl:bg-transparent transition-all duration-200"
                >
                  + Añadir Día
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-row">
            <button
              type="submit"
              class="bg-tertiary-500 hover:bg-tertiary-600 flex w-full justify-center text-white font-medium px-4 py-2 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-200"
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
      <div v-if="diaSeleccionado" class="flex flex-col flex-1 p-3 md:p-6 rounded overflow-hidden gap-2">
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

          <div class="bg-tertiary-500 p-2 pl-4 pr-2 rounded-2xl w-full sm:w-fit h-full flex items-center gap-3">
            <h3 class="font-semibold text-lg">Día {{ diaSeleccionado.diaNumero }}</h3>
            <input
              v-model="diaSeleccionado.fecha"
              type="date"
              :min="new Date().toISOString().split('T')[0]"
              class="flex-1/2 p-2 text-sm text-black bg-gray-50 border border-[#f56e0f] rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f56e0f] cursor-pointer"
            />
          </div>
        </div>

        <!-- Lista de elementos scrolleable -->
        <div
          class="flex-1 overflow-y-auto pr-2 mr-2 space-y-2 p-2 bg-gray-100 inset-shadow-sm inset-shadow-gray-400 rounded-2xl flex"
        >
          <div v-if="diaSeleccionado.elementos.length === 0" class="text-gray-500 p-2 items-center justify-center flex flex-col w-full h-full">
            <p class="text-gray-800 font-semibold text-lg">No hay ejercicios para este día.</p>
            <p class="italic">Si lo dejas en blanco se considerará un día de descanso.</p>
          </div>
          <transition-group name="move" tag="div" class="gap-2 flex flex-col w-full" v-else>
            <!-- Elementos -->
            <div v-for="el in diaSeleccionado.elementos" :key="el.id">
              <!-- Si el elemento es un ejercicio -->
              <template v-if="el.tipo === 'ejercicio'">
                <div
                  :class="el.orden === diaSeleccionado.elementos.length ? 'mb-2' : ''"
                  class="flex gap-2 bg-white p-2 rounded-2xl shadow-sm shadow-gray-300 border-1 border-gray-200 items-center transition-all duration-200 ease-in-out"
                >
                  <div class="flex flex-col gap-2 w-fit h-fit">
                    <button
                      @click="moverElementoArriba(el.orden)"
                      :disabled="el.orden === 1"
                      class="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg p-1 cursor-pointer disabled:opacity-50"
                      title="Mover arriba"
                    >
                      ▲
                    </button>

                    <div class="border-gray-400 text-center border-2 rounded-md p-1 appearance-none w-10">
                      {{ el.orden }}
                    </div>
                    <button
                      @click="moverElementoAbajo(el.orden)"
                      :disabled="el.orden === diaSeleccionado.elementos.length"
                      class="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg p-1 cursor-pointer disabled:opacity-50"
                      title="Mover abajo"
                    >
                      ▼
                    </button>
                  </div>

                  <div class="flex flex-col w-full gap-1 h-full">
                    <div class="flex flex-row gap-2">
                      <select
                        v-model="el.ejercicio.ejercicioId"
                        class="border-2 border-gray-300 bg-gray-200 rounded-xl font-semibold p-2 w-full outline-gray-400"
                      >
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
                        @click="eliminarElemento(diaSeleccionado, el.id)"
                        class="bg-red-500 text-white font-semibold p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:bg-red-700 active:text-tertiary-200 hover:bg-red-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-red-200"
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
                        v-model="el.ejercicio.series"
                        type="text"
                        placeholder="Series"
                        class="border-2 border-gray-400 rounded-lg p-2 w-full"
                      />
                      <input
                        v-model="el.ejercicio.repeticiones"
                        type="text"
                        placeholder="Reps"
                        class="border-2 border-gray-400 rounded-lg p-2 w-full"
                      />
                      <input
                        v-model="el.ejercicio.peso"
                        type="text"
                        placeholder="Peso"
                        class="border-2 border-gray-400 rounded-lg p-2 w-full"
                      />
                      <input
                        v-model="el.ejercicio.descanso"
                        type="text"
                        placeholder="Descanso"
                        class="border-2 border-gray-400 rounded-lg p-2 w-full"
                      />
                    </div>
                  </div>
                </div>
              </template>

              <!-- Si el elemento es un circuito -->
              <template v-else-if="el.tipo === 'circuito'">
                <div
                  :class="el.orden === diaSeleccionado.elementos.length ? 'mb-2' : ''"
                  class="flex flex-col gap-2 bg-white p-2 rounded-2xl shadow-sm shadow-gray-300 border-1 border-gray-200 items-center transition-all duration-200 ease-in-out"
                >
                  <div class="flex flex-row gap-2 w-full">
                    <div class="flex flex-col gap-2 w-fit h-fit self-start">
                      <button
                        @click="moverElementoArriba(el.orden)"
                        :disabled="el.orden === 1"
                        class="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg p-1 cursor-pointer disabled:opacity-50"
                        title="Mover arriba"
                      >
                        ▲
                      </button>

                      <div class="border-gray-400 text-center border-2 rounded-md p-1 appearance-none w-10">
                        {{ el.orden }}
                      </div>
                      <button
                        @click="moverElementoAbajo(el.orden)"
                        :disabled="el.orden === diaSeleccionado.elementos.length"
                        class="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg p-1 cursor-pointer disabled:opacity-50"
                        title="Mover abajo"
                      >
                        ▼
                      </button>
                    </div>

                    <div class="flex flex-col w-full gap-1 h-full">
                      <div class="flex flex-row gap-2">
                        <div
                          class="flex w-full font-semibold items-center text-md md:text-xl px-3 bg-gray-200 rounded-xl"
                        >
                          Circuito
                        </div>
                        <button
                          @click="eliminarElemento(diaSeleccionado, el.id)"
                          class="bg-red-500 text-white font-semibold p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:bg-red-700 active:text-tertiary-200 hover:bg-red-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-red-200"
                          title="Eliminar ejercicio"
                        >
                          <Trash />
                        </button>
                      </div>
                      <div class="grid grid-cols-3">
                        <p class="pl-1 text-sm">Rondas</p>
                        <p class="pl-1 text-sm hidden xl:inline">Descanso entre rondas</p>
                        <p class="pl-1 text-sm xl:hidden">Des. R</p>
                        <p class="pl-1 text-sm hidden xl:inline">Tiempo entre rondas</p>
                        <p class="pl-1 text-sm xl:hidden">Tiempo. R</p>
                      </div>
                      <div class="flex flex-row gap-2">
                        <input
                          v-model="el.circuito.rondas"
                          type="text"
                          placeholder="Series"
                          class="border-2 border-gray-400 rounded-lg p-2 w-full"
                        />
                        <input
                          v-model="el.circuito.descansoEntre"
                          type="text"
                          placeholder="Reps"
                          class="border-2 border-gray-400 rounded-lg p-2 w-full"
                        />
                        <input
                          v-model="el.circuito.tiempoEntre"
                          type="text"
                          placeholder="Peso"
                          class="border-2 border-gray-400 rounded-lg p-2 w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Ejercicios del circuito -->
                  <div
                    class="bg-zinc-300 rounded-2xl p-2 w-full flex flex-col gap-2 inset-shadow-sm inset-shadow-gray-500"
                  >
                    <div v-for="circuitoEjercicio in el.circuito.ejercicios" :key="circuitoEjercicio.id">
                      <div
                        class="flex gap-2 bg-white border-gray-200 shadow-sm shadow-gray-400 border-1 p-2 rounded-2xl items-center transition-all duration-200 ease-in-out"
                      >
                        <div class="flex flex-col gap-2 w-fit h-fit">
                          <button
                            @click="moverEjercicioArriba(el.circuito, circuitoEjercicio.orden)"
                            :disabled="circuitoEjercicio.orden === 1"
                            class="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg p-1 cursor-pointer disabled:opacity-50"
                            title="Mover arriba"
                          >
                            ▲
                          </button>

                          <div class="border-gray-400 text-center border-2 rounded-lg p-1 appearance-none w-10">
                            {{ circuitoEjercicio.orden }}
                          </div>
                          <button
                            @click="moverEjercicioAbajo(el.circuito, circuitoEjercicio.orden)"
                            :disabled="circuitoEjercicio.orden === el.circuito.ejercicios.length"
                            class="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg p-1 cursor-pointer disabled:opacity-50"
                            title="Mover abajo"
                          >
                            ▼
                          </button>
                        </div>

                        <div class="flex flex-col w-full gap-1 h-full">
                          <div class="flex flex-row gap-2">
                            <select
                              v-model="circuitoEjercicio.ejercicioId"
                              class="border-2 border-gray-300 bg-gray-200 font-semibold rounded-xl p-2 w-full"
                            >
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
                              @click="eliminarEjercicio(el.circuito, circuitoEjercicio.id)"
                              class="bg-red-500 text-white font-semibold p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:bg-red-700 active:text-tertiary-200 hover:bg-red-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-red-200"
                              title="Eliminar ejercicio"
                            >
                              <Trash />
                            </button>
                          </div>
                          <div class="grid grid-cols-2">
                            <p class="pl-1 text-sm hidden xl:inline">Repeticiones</p>
                            <p class="pl-1 text-sm xl:hidden">Rep</p>
                            <p class="pl-1 text-sm">Peso</p>
                          </div>
                          <div class="flex flex-row gap-2">
                            <input
                              v-model="circuitoEjercicio.repeticiones"
                              type="text"
                              placeholder="Reps"
                              class="border-2 border-gray-400 rounded-lg p-2 w-full"
                            />
                            <input
                              v-model="circuitoEjercicio.peso"
                              type="text"
                              placeholder="Peso"
                              class="border-2 border-gray-400 rounded-lg p-2 w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      @click="addEjercicioCircuito(el.circuito)"
                      class="bg-orange-500/20 xl:bg-transparent border-tertiary-500 text-orange-600 xl:hover:bg-orange-500/20 cursor-pointer border-2 border-dashed xl:border-gray-600/50 xl:hover:border-tertiary-500 rounded-2xl p-2 py-3 w-full transition-colors duration-200"
                    >
                      + Añadir ejercicio
                    </button>
                  </div>
                </div>
              </template>

              <!-- Si el elemento es una carrera -->
              <template v-if="el.tipo === 'carrera'">
                <div
                  :class="el.orden === diaSeleccionado.elementos.length ? 'mb-2' : ''"
                  class="flex gap-2 bg-white p-2 rounded-2xl shadow-sm shadow-gray-300 border-1 border-gray-200 items-center transition-all duration-200 ease-in-out"
                >
                  <div class="flex flex-col gap-2 w-fit h-fit">
                    <button
                      @click="moverElementoArriba(el.orden)"
                      :disabled="el.orden === 1"
                      class="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md p-1 cursor-pointer disabled:opacity-50"
                      title="Mover arriba"
                    >
                      ▲
                    </button>

                    <div class="border-gray-400 text-center border-2 rounded-md p-1 appearance-none w-10">
                      {{ el.orden }}
                    </div>
                    <button
                      @click="moverElementoAbajo(el.orden)"
                      :disabled="el.orden === diaSeleccionado.elementos.length"
                      class="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md p-1 cursor-pointer disabled:opacity-50"
                      title="Mover abajo"
                    >
                      ▼
                    </button>
                  </div>

                  <div class="flex flex-col w-full gap-1 h-full">
                    <div class="flex flex-row gap-2">
                      <div
                        class="flex w-full font-semibold items-center text-md md:text-xl px-3 bg-gray-200 rounded-xl"
                      >
                        Carrera
                      </div>
                      <button
                        @click="eliminarElemento(diaSeleccionado, el.id)"
                        class="bg-red-500 text-white font-semibold p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:bg-red-700 active:text-tertiary-200 hover:bg-red-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-red-200"
                        title="Eliminar ejercicio"
                      >
                        <Trash />
                      </button>
                    </div>
                    <div class="grid grid-cols-3">
                      <p class="pl-1 text-sm">Distancia (km)</p>
                      <p class="pl-1 text-sm">Duración (min)</p>
                      <p class="pl-1 text-sm">Ritmo (km/h)</p>

                      <!-- <p class="pl-1 text-sm hidden xl:inline">Repeticiones</p> -->
                      <!-- <p class="pl-1 text-sm xl:hidden">Rep</p> -->
                      <!-- <p class="pl-1 text-sm">Peso</p> -->
                      <!-- <p class="pl-1 text-sm hidden xl:inline">Descanso</p> -->
                      <!-- <p class="pl-1 text-sm xl:hidden">Des</p> -->
                    </div>
                    <div class="flex flex-row gap-2">
                      <input
                        v-model="el.carrera.distancia"
                        type="text"
                        placeholder="Distancia"
                        class="border-2 border-gray-400 rounded-lg p-2 w-full"
                      />
                      <input
                        v-model="el.carrera.duracion"
                        type="text"
                        placeholder="Duracion"
                        class="border-2 border-gray-400 rounded-lg p-2 w-full"
                      />
                      <input
                        v-model="el.carrera.ritmo"
                        type="text"
                        placeholder="Ritmo"
                        class="border-2 border-gray-400 rounded-lg p-2 w-full"
                      />
                    </div>
                  </div>
                </div>
              </template>
              <!-- Si el elemento es una carrera -->
              <template v-if="el.tipo === 'nota'">
                <div
                  :class="el.orden === diaSeleccionado.elementos.length ? 'mb-2' : ''"
                  class="flex gap-2 bg-white p-2 rounded-2xl shadow-sm shadow-gray-300 border-1 border-gray-200 items-center transition-all duration-200 ease-in-out"
                >
                  <div class="flex flex-col gap-2 w-fit h-fit self-start">
                    <button
                      @click="moverElementoArriba(el.orden)"
                      :disabled="el.orden === 1"
                      class="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md p-1 cursor-pointer disabled:opacity-50"
                      title="Mover arriba"
                    >
                      ▲
                    </button>

                    <div class="border-gray-400 text-center border-2 rounded-md p-1 appearance-none w-10">
                      {{ el.orden }}
                    </div>
                    <button
                      @click="moverElementoAbajo(el.orden)"
                      :disabled="el.orden === diaSeleccionado.elementos.length"
                      class="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md p-1 cursor-pointer disabled:opacity-50"
                      title="Mover abajo"
                    >
                      ▼
                    </button>
                  </div>

                  <div class="flex flex-col w-full gap-1 h-full">
                    <div class="flex flex-row gap-2">
                      <div
                        class="flex w-full font-semibold items-center text-md md:text-xl px-3 bg-gray-200 rounded-xl"
                      >
                        Nota
                      </div>
                      <button
                        @click="eliminarElemento(diaSeleccionado, el.id)"
                        class="bg-red-500 text-white font-semibold p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:bg-red-700 active:text-tertiary-200 hover:bg-red-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-red-200"
                        title="Eliminar ejercicio"
                      >
                        <Trash />
                      </button>
                    </div>
                    <div class="flex flex-row gap-2">
                      <textarea
                        v-model="el.nota.nota"
                        type="text"
                        placeholder="Ingrese aqui sus comentarios"
                        class="border-2 border-gray-400 rounded-lg p-2 w-full resize-none h-36"
                      />
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </transition-group>
        </div>

        <!-- Botón fijo abajo -->
        <div class="flex flex-row gap-2 w-full">
          <button
            @click.prevent="addEjercicio(diaSeleccionado)"
            class="w-full justify-center bg-tertiary-500 hover:bg-tertiary-600 flex text-white font-medium px-4 py-2 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-200"
          >
            + Añadir Ejercicio
          </button>
          <button
            @click.prevent="addCircuito(diaSeleccionado)"
            class="w-full justify-center bg-tertiary-500 hover:bg-tertiary-600 flex text-white font-medium px-4 py-2 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-200"
          >
            + Añadir Circuito
          </button>
          <button
            @click.prevent="addCarrera(diaSeleccionado)"
            class="w-full justify-center bg-tertiary-500 hover:bg-tertiary-600 flex text-white font-medium px-4 py-2 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-200"
          >
            + Añadir Carrera
          </button>
          <button
            @click.prevent="addNota(diaSeleccionado)"
            class="w-full justify-center bg-tertiary-500 hover:bg-tertiary-600 flex text-white font-medium px-4 py-2 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:bg-orange-700 active:text-tertiary-200 hover:bg-orange-600 hover:inset-shadow-orange-400 active:inset-shadow-orange-950 transition-colores duration-200 cursor-pointer inset-shadow-sm inset-shadow-orange-200"
          >
            + Añadir Nota
          </button>
        </div>
      </div>
      <div v-else class="flex flex-col justify-center items-center h-full min-h-[200px]">
        <p class="mb-2 italic text-gray-800 font-semibold">Selecciona un dia de entrenamiento</p>
        <p class="italic text-sm text-gray-600">Se cargará la información de ese dia</p>
      </div>
    </div>
  </div>
</template>
