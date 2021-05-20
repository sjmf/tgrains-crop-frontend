<template>
  <div class="row" id="production-tab">
    <div class="col s12 m12 l6">
      <div class="card panel">
        <div class="card-content">
          <span class="card-title">Change from "Business-as-usual"</span>
          <div class="chart-panel">
            <viz-production
                :chart-data="proddata"
                :height="chartHeight*2  "/>
            <!-- ^ this doesn't support dynamic resize (but is better than nothing)! -->
          </div>
        </div>
      </div>
    </div>

    <div class="col s12 m12 l6">
      <div class="card panel">
        <div class="card-content">
          <span class="card-title">Production Values</span>
          <data-table
              :titles="['Factor', 'Value', 'Change', 'Description']"
              :values="prodValues"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DataTable from "@/components/visualisations/DataTable"
import VizProduction from "@/components/visualisations/VizProduction"
import TabMixin from "./tabMixin"
export default {
    name: 'TabProduction',
    components: {
        DataTable,
        VizProduction
    },
    mixins: [TabMixin],
    props: {
        chartHeight: Number
    },
    computed: {
        prodValues() {
            return [
                {
                    label: "Profit",
                    value: this.rawData['profit'],
                    change: this.rawData['profit'] - this.bauData['profit'],
                    unit: {string: '£', loc: 'pre'},
                    description: "Profit over variable costs (£/year)"
                },
                {
                    label: "Calories",
                    value: this.rawData['production'],
                    change: this.rawData['production'] - this.bauData['production'],
                    unit: {string: 'kCal', loc: 'post'},
                    description: "Calories delivered"
                },
                {
                    label: "Area",
                    value: (this.$store.state.data[this.$store.state.landscape_id].area),
                    change: (this.$store.state.data[this.$store.state.landscape_id].area - this.$store.state.area.bau.total),
                    unit: {string: 'ha', loc: 'post'},
                    description: "Area used (hectares)"
                }
            ]
        },
        proddata() {
            return {
                labels: [
                    'Profit',
                    'Calories',
                    'Area change'
                ],
                datasets: [{
                    label: '% change from BAU state',
                    backgroundColor: this.chartColors.translucent[2],
                    borderWidth: 1,
                    data: this.baseData.production
                }]
            }
        },
    }
}
</script>