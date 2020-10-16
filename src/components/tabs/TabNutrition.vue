<template>
  <div class="row">
    <div class="col s12 m6">
      <div class="card panel">
        <div class="card-content">
          <span class="card-title">Target plate</span>
          <p>The <a href="https://eatforum.org/eat-lancet-commission/" target="_blank">EATLancet report</a> suggests
            the following plate to achieve a balanced diet sustainably:</p>
          <div class="chart-panel">
            <viz-nutrition
                :chart-data="eatLancet"
                :height="chartHeight"
                :width="chartHeight"/>
          </div>
        </div>
      </div>
    </div>

    <div class="col s12 m6">
      <div class="card panel">
        <div class="card-content">
          <span class="card-title">Nutritional delivery</span>
          <p>This chart shows the nutritional delivery from the landscape, crops, and livestock you have defined:</p>
          <div class="chart-panel">
            <viz-nutrition
                :chart-data="nutriData"
                :height="chartHeight"
                :width="chartHeight"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VizNutrition from "@/components/visualisations/VizNutrition"

export default {
    name: 'TabNutrition',
    components: {VizNutrition},
    props: {
        chartHeight: Number,
        chartColors: Object
    },
    computed: {
        baseData() {
            return this.$store.state.data[this.$store.state.landscape_id]
        },
        nutriData() {
            return {
                labels: (this.$store.state.strings[this.$store.state.landscape_id]['food_groups'] || [])
                    .map(x => this.$store.state.food_groups_dictionary[x]),
                type: 'outlabeledPie',
                datasets: [{
                    backgroundColor: this.chartColors.opaque,
                    borderWidth: 1,
                    data: this.baseData.nutritionaldelivery
                }]
            }
        },
        eatLancet() {
            return {
                labels: this.nutriData.labels,
                type: 'outlabeledPie',
                datasets: [{
                  backgroundColor: this.chartColors.opaque,
                  borderWidth: 1,
                  data: this.baseData.eatLancetPlate
                }]
            }
        }
    }
}
</script>