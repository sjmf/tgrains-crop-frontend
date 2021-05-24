<template>
  <div class="row" id="nutrition-tab">

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

    <div class="col s12 m6">
      <div class="card panel">
        <div class="card-content">
          <span class="card-title">Nutrition Comparison Chart</span>
          <p>This chart shows how much the nutrition delivered by the area has changed.
            Click the legend to turn series on or off:</p>
          <div class="chart-panel">
            <viz-radar
                :chart-data="radarData"
                :height="chartHeight"
                :width="chartHeight"/>
          </div>
        </div>
      </div>
    </div>

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
          <span class="card-title">People fed from the local area</span>
          <p>This table shows how many people can be fed using only crops produced in the local area,
          and whether the diet that they receive is balanced.&nbsp;</p><br/>
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
import VizRadar from "@/components/visualisations/VizRadar";
const cloneDeep = require('lodash/cloneDeep');

export default {
  name: 'TabNutrition',
  components: {
    VizNutrition,
    VizRadar,
    DataTable
  },
  mixins: [TabMixin],
  props: {
      chartHeight: Number
  },
  computed: {
    /**
     * Labels for the Nutrition pie charts
     * @returns Object
     */
    nutriLabels() {
      return (this.$store.state.strings[this.$store.state.landscape_id]['food_groups'] || [])
             .map(x => this.$store.state.food_groups_dictionary[x])
    },

    /**
     * Chart.js data structure for the nutrition pie charts
     * @returns Object
     */
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

    /**
     * Chart.js data structure for the Eat Lancet plate
     * @returns Object
     */
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

    /**
     * Nutrition tabulated data (table displayed below Pie charts)
     * @returns Object
     */
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
          value: Math.round((this.people_fed.qty / this.population) * 1000 + Number.EPSILON) / 10,
          change: Math.round((this.people_fed.qty - this.people_fed_bau.qty)
                                / this.population * 1000 + Number.EPSILON) / 10,
          unit: {string: '%', loc: 'post', which: 'both'},
          description: "Percentage of the population fed from the local area"
        },
        {
          label: "Limiting factor",
          value: this.nutriLabels[this.people_fed.lim],
          change: Math.round((this.baseData.nutritionaldelivery[this.people_fed.lim] -
                                 this.baseData.eatLancetPlate[this.people_fed.lim]) * 1000 + Number.EPSILON) / 10,
          unit: {string: '%', loc: 'post', which: 'change'},
          description: "Increase production of this group to feed more people locally"
        },
      ]
    },

    /**
     * Return the population of the selected area
     * @returns {*}
     */
    population() {
      return this.$store.state.population[this.$store.state.landscape_id]
    },

    /**
     * Calculate the number of people fed in the region
     * @returns {number|{lim: number, qty: number}}
     */
    people_fed() {
      // returns {qty, lim}
      return calcPeopleFed(this.rawData.production,            // Total calories
                           this.baseData.nutritionaldelivery,  // Food Groups
                           this.baseData.eatLancetPlate)       // Eat Lancet food groups
    },

    /**
     * Calculate the number of people fed at Business-as-usual state
     * @returns {number|{lim: number, qty: number}}
     */
    people_fed_bau() {
      return calcPeopleFed(this.bauData.production,
                           this.bauData.nutritionaldelivery,
                           this.baseData.eatLancetPlate)
    },

    /**
     * Return data for business-as-usual comparison radar chart
     * @returns {{datasets: [{pointBackgroundColor: string, pointBorderColor: string, backgroundColor: string, borderColor: string, data, pointHoverBorderColor: string, label: string, pointHoverBackgroundColor: string, fill: boolean}, {pointBackgroundColor: string, pointBorderColor: string, backgroundColor: string, borderColor: string, data, pointHoverBorderColor: string, label: string, pointHoverBackgroundColor: string, fill: boolean}], labels: *}}
     */
    radarData() {
      // Copy labels (we're about to mutate them)
      let labels = cloneDeep(this.nutriLabels)
      // Round all data to two significant figures (creates a copy)
      let baseData = this.baseData.nutritionaldelivery.map(a => Math.round( a * 10000 + Number.EPSILON ) / 100)
      let bauData = this.bauData.nutritionaldelivery.map(a => Math.round( a * 10000 + Number.EPSILON ) / 100)
      let eatLancet = this.baseData.eatLancetPlate.map(a => Math.round( a * 10000 + Number.EPSILON ) / 100)

      // Rotate arrays so that Fruits is at the top (so the labels aren't obscured by the line to Whole Grains)
      baseData.unshift(baseData.pop())
      bauData.unshift(bauData.pop())
      eatLancet.unshift(eatLancet.pop())
      labels.unshift(labels.pop())

      return {
        labels: labels,
        datasets: [{
            label: 'Current State',
            data: baseData,
            fill: true,
            spanGaps: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)',
          }, {
            label: 'Business-as-usual',
            data: bauData,
            fill: true,
            spanGaps: true,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            pointBackgroundColor: 'rgb(54, 162, 235)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)'
          }, {
            label: 'Eat Lancet Plate',
            data: eatLancet,
            fill: true,
            spanGaps: true,
            backgroundColor: 'rgba(96,226,74,0.2)',
            borderColor: 'rgb(122,226,111)',
            pointBackgroundColor: 'rgb(54,235,57)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(72,235,54)'
        }]
      }
    }
  }
}
</script>