<template>
  <div class="card panel">
    <div class="card-content">
      <span class="card-title">Nitrogen Leaching and Pesticide Impacts</span>
      <div class="chart-panel">
        <viz-pests
            :chart-data="pestData"
            :height="chartHeight"/>
      </div>
      <p>In this chart, higher values indicate worse environmental impacts.</p>
    </div>
  </div>
</template>
<script>
import VizPests from "@/components/visualisations/VizPesticides"

export default {
    name: 'TabEnvironment',
    components: {VizPests},
    props: {
        chartHeight: Number
    },
    computed: {
        baseData() {
            return this.$store.state.data[this.$store.state.landscape_id]
        },
        chartColors() {
            return this.$store.state.chartColors
        },
        pestData() {
            return {
                labels: [
                    'Nitrogen leaching',
                    'Ground Water',
                    'Fish',
                    'Birds',
                    'Bees',
                    'Beneficial Arthropods'
                ],
                datasets: [{
                    label: '% change from BAU state',
                    backgroundColor: this.chartColors.translucent[4],
                    borderWidth: 1,
                    data: this.baseData.pesticideImpacts
                }]
            }
        }
    }
}
</script>

<style scoped>
.card .card-content .chart-panel + p {
  margin-top: 20px;
}
</style>