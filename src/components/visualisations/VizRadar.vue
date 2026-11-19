<template>
    <Radar :data="chartData" :options="options"/>
</template>

<script>
  import { Radar } from 'vue-chartjs'
  import './chartSetup'

  export default {
    name: 'viz-radar',
    components: { Radar },
    props: {
      chartData: Object,
      width: { type: Number, default: 400 },
      height: { type: Number, default: 400 }
    },
    computed: {
      options() {
        return {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: this.width / this.height,
          plugins: {
            tooltip: {
              mode: 'index'
            }
          },
          scales: {
            r: {
              type: 'radialLogarithmic',
              max: 100,
              pointLabels: {
                font: { size: 10 }
              }
            }
          }
        }
      }
    }
  }
</script>
