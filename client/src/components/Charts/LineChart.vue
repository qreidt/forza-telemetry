<script setup lang="ts">
import {computed, defineProps, ref} from 'vue';
import { Line } from "vue-chartjs";
import type {PropType} from 'vue';
import type {Dataset} from "../../types/Session";

const colors = ['rgba(248,121,121, 0.7)', 'rgba(83,204,248, 0.7)'];

const props = defineProps({
  dataset_1: Object as PropType<Dataset|null>,
  dataset_2: Object as PropType<Dataset|null>,
  title: String,
  x_title: String,
  y_title: String,
  y_tick_suffix: String
});

const data = computed(() => {
  const datasets = [];
  if (props.dataset_1) datasets.push(props.dataset_1);
  if (props.dataset_2) datasets.push(props.dataset_2);

  return {
    datasets: datasets.map((dataset: Dataset, index: number) => ({
      ...dataset,
      pointRadius: .01,
      borderColor: colors[index],
      backgroundColor: colors[index]
    }))
  };
});

const options = {
  type: 'line',
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      type: 'linear',
      title: {
        display: true,
        text: props.x_title,
        font: { size: 12 }
      },
    },
    y: {
      title: {
        display: true,
        text: props.y_title,
        font: { size: 12 },
      },
      ticks: {
        //
      }
    },
  },
  plugins: {
    title: {
      display: true,
      text: props.title,
      font: { size: 16 }
    }
  }
};

if (props.y_tick_suffix) {
  options.scales.y.ticks.callback = (value: number) => `${value} ${props.y_tick_suffix}`
}
</script>

<template>
  <Line :data="data" :options="options" height="400" />
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
ChartJS.defaults.color = '#FFF';

export default defineComponent({
  name: 'LineChart',
});
</script>