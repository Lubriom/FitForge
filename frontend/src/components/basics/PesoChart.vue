<script setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { computed } from 'vue'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale)

// Props que recibes del padre
const props = defineProps({
  datosPeso: {
    type: Array,
    required: true
  }
})

// Preparar los datos
const chartData = computed(() => {
  return {
    labels: props.datosPeso.map(d => d.fecha), // Ej: ['2025-05-30', '2025-06-01', ...]
    datasets: [
      {
        data: props.datosPeso.map(d => d.peso), // Ej: [70, 69.5, 69, ...]
        borderColor: '#f56e0f',
        backgroundColor: '#f56e0f',
        pointBackgroundColor: '#f56e0f',
        fill: true,
        tension: 0.1
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
        display: false,
      position: 'top'
    }
  },
  scales: {
    y: {
      title: {
        display: true,
        text: 'Kg'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Fecha'
      }
    }
  }
}
</script>

<template>
  <div class="bg-transparent w-full h-full">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
