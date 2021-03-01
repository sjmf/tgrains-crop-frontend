<template>
  <div class="row" id="environment-tab">
    <div class="col s12 m12">
      <div class="card panel">
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
    </div>

    <div class="col s12 m12">
      <div class="card panel">
        <div class="card-content">
          <data-table
              :titles="['Factor', 'Value', 'Change', 'Description']"
              :values="enviroValues"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VizPests from "@/components/visualisations/VizPesticides"
import DataTable from "@/components/visualisations/DataTable"
import TabMixin from "@/components/tabs/tabMixin";

export default {
    name: 'TabEnvironment',
    components: {
      VizPests,
      DataTable
    },
    mixins: [TabMixin],
    props: {
        chartHeight: Number
    },
    computed: {
        environmentData() {
            return {
                labels: [
                    'Greenhouse Gas',
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
        },
        enviroValues() {
          return [
            {
              label: "Greenhouse Gasses",
              value: this.rawData['greenhouseGasEmissions'],
              change: this.rawData['greenhouseGasEmissions'] - this.bauData['greenhouseGasEmissions'],
              unit: {string: "kg", loc: "post"},
              description: "Total emissions equivalent to CO<sub>2</sub> (average kg/ha/year)"
            },
          ]
        }
    }
}
</script>

<style scoped>
.card .card-content .chart-panel + p {
  margin-top: 20px;
}
</style>