<template>
  <section class="flex flex-col w-full pt-24 bg-black text-black">
    <div class="bg-white px-10 md:px-32 py-16">
      <h2 class="text-3xl sm:text-4xl font-bold text-center mb-8 text-black">Preguntas Frecuentes</h2>
      <div class="space-y-4 text-black text-base sm:text-lg leading-relaxed max-w-4xl mx-auto">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="bg-black/20 border border-white/10 rounded-xl overflow-hidden transition-all duration-300"
        >
          <button
            class="w-full text-left px-6 py-4 flex justify-between items-center text-black text-xl font-semibold hover:bg-black/30 transition-colors duration-200"
            @click="toggle(index)"
          >
            {{ faq.pregunta }}
            <svg
              :class="{ 'rotate-180': faq.abierto }"
              class="w-5 h-5 transform transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div v-if="faq.abierto" class="px-6 pb-4 py-4 bg-white text-black text-base sm:text-lg transition-all duration-300">
            {{ faq.respuesta }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

const faqs = ref([
  {
    pregunta: "¿Cómo personaliza FitForge mis planes de entrenamiento?",
    respuesta:
      "FitForge genera rutinas personalizadas basándose en tu objetivo físico, nivel de experiencia y datos personales como edad, peso y condición actual. También puedes pedirle a un entrenador que te proporcione los ejercicios según tus preferencias.",
    abierto: false
  },
  {
    pregunta: "¿Qué diferencia a FitForge de otras aplicaciones de fitness?",
    respuesta:
      "FitForge combina planificación deportiva, seguimiento físico y visualización de estadísticas en una sola plataforma, adaptada totalmente a tus metas personales, sin depender de planes genéricos.",
    abierto: false
  },
  {
    pregunta: "¿Cómo mide FitForge mi progreso físico y de rendimiento?",
    respuesta:
      "La plataforma registra tus datos físicos, entrenamiento completado y repeticiones/pesos usados. A partir de eso, genera gráficos de evolución y comparativas con tus valores iniciales, mostrándote tu mejora real.",
    abierto: false
  },
  {
    pregunta: "¿Puedo recuperar mis datos si cambio de dispositivo o pierdo el acceso?",
    respuesta:
      "Sí, todos tus datos están almacenados de forma segura en la nube. Al iniciar sesión desde cualquier dispositivo, se sincronizará tu perfil, progreso y rutinas sin pérdida de información.",
    abierto: false
  },
  {
    pregunta: "¿FitForge tiene en cuenta lesiones o patologías?",
    respuesta:
      "Sí. Puedes indicar condiciones específicas (como lesiones, problemas articulares o patologías) al configurar tu perfil, lo que le indica a nuestros entrenadores que ejercicios son sugeridos para evitar movimientos de a la hora de hacer tu plan generalizado.",
    abierto: false
  },
  {
    pregunta: "¿Es posible compartir mis progresos o planes con un entrenador o amigo?",
    respuesta:
      "Actualmente puedes exportar tus planes y métricas, y en próximas versiones se incluirá un sistema para compartir rutinas y progreso con entrenadores o compañeros de entrenamiento.",
    abierto: false
  },
  {
    pregunta: "¿Qué tipo de datos recopila FitForge y para qué se usan?",
    respuesta:
      "Recopilamos solo los datos necesarios para personalizar tu experiencia (como métricas físicas, preferencias deportivas y nivel de experiencia). No vendemos ni compartimos tu información con terceros.",
    abierto: false
  },
  {
    pregunta: "¿Puedo usar FitForge si entreno desde casa y no tengo equipamiento?",
    respuesta:
      "Sí, puedes indicar que entrenas desde casa al configurar tu plan. FitForge generará rutinas personalizadas que se adaptan a tus objetivos, nivel y datos físicos, utilizando solo el peso corporal o materiales disponibles en casa, sin necesidad de equipamiento de gimnasio.",
    abierto: false
  }
]);

const toggle = (index) => {
  faqs.value[index].abierto = !faqs.value[index].abierto;
};
</script>
