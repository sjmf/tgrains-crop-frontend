<template>
  <div class="card panel" id="environment-tab">
    <div class="card-content">
      <span class="card-title">Environmental Impacts</span>
      <div class="chart-panel">
        <viz-pests
            :chart-data="environmentData"
            :height="chartHeight"/>
      </div>
      <p>This chart shows environmental impacts, including those of fertilizers and
        pesticides, on the environment and affected species.</p>
      <p><em>Higher values indicate worse environmental impacts.
        Lower values indicate an improvement.</em></p>
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
        environmentData() {
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
                    data: this.baseData.environmentImpacts
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