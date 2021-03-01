<template>
  <div class="row" id="nutrition-tab">
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

    <div class="col s12 m12">
      <div class="card panel">
        <div class="card-content">
          <data-table
              :titles="['Factor', 'Value', 'Change', 'Description']"
              :values="nutriValues"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VizNutrition from "@/components/visualisations/VizNutrition"
import DataTable from "@/components/visualisations/DataTable";
import {calcPeopleFed} from "@/store/helpers";
import TabMixin from "@/components/tabs/tabMixin";

export default {
    name: 'TabNutrition',
    components: {
      VizNutrition,
      DataTable
    },
    mixins: [TabMixin],
    props: {
        chartHeight: Number
    },
    computed: {
        nutriLabels() {
            return (this.$store.state.strings[this.$store.state.landscape_id]['food_groups'] || [])
                .map(x => this.$store.state.food_groups_dictionary[x])
        },
        nutriData() {
            return {
                labels: this.nutriLabels,
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
                labels: this.nutriLabels,
                type: 'outlabeledPie',
                datasets: [{
                  backgroundColor: this.chartColors.opaque,
                  borderWidth: 1,
                  data: this.baseData.eatLancetPlate
                }]
            }
        },
        nutriValues() {
            return [
                {
                    label: "People supported",
                    value: this.people_fed.qty,
                    change: this.people_fed.qty - this.people_fed_bau.qty,
                    description: "Total people receiving a fully-balanced diet"
                },
                {
                    label: "Area population",
                    value: this.population,
                    description: "Number of people living in the study area"
                },
                {
                    label: "Percentage fed",
                    value: Math.round(
                        (this.people_fed.qty / this.population)
                        * 1000 + Number.EPSILON) / 10,
                    change: Math.round(
                        (this.people_fed.qty - this.people_fed_bau.qty) / this.population
                        * 1000 + Number.EPSILON) / 10,
                    unit: {string: '%', loc: 'post', which: 'both'},
                    description: "Percentage of the population fed from the local area"
                },
                {
                    label: "Limiting factor",
                    value: this.nutriLabels[this.people_fed.lim],
                    change: Math.round(
                        (this.baseData.nutritionaldelivery[this.people_fed.lim] -
                            this.baseData.eatLancetPlate[this.people_fed.lim])
                        * 1000 + Number.EPSILON) / 10,
                    unit: {string: '%', loc: 'post', which: 'change'},
                    description: "Increase production of this group to feed more people locally"
                },
            ]
        },
        population() {
            return this.$store.state.population[this.$store.state.landscape_id]
        },
        people_fed() {
            // returns {qty, lim}
            return calcPeopleFed(
                this.rawData.production,            // Total calories
                this.baseData.nutritionaldelivery,  // Food Groups
                this.baseData.eatLancetPlate)       // Eat Lancet food groups
        },
        people_fed_bau() {
            return calcPeopleFed(
                this.bauData.production,
                this.bauData.nutritionaldelivery,
                this.baseData.eatLancetPlate)
        }
    },
}
</script>