<template>
  <div class="row">
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
              :titles="prodTitles"
              :values="prodValues"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DataTable from "@/components/visualisations/DataTable"
import VizProduction from "@/components/visualisations/VizProduction"

export default {
    name: 'TabProduction',
    components: {
        DataTable,
        VizProduction
    },
    props: {
        chartHeight: Number
    },
    computed: {
        baseData() {
            return this.$store.state.data[this.$store.state.landscape_id]
        },
        rawData() {
            return this.$store.state.data.raw[this.$store.state.landscape_id]
        },
        bau() {
            return this.$store.state.bau[this.$store.state.landscape_id]
        },
        chartColors() {
            return this.$store.state.chartColors
        },
        prodTitles() {
            return ['Factor', 'Value', 'Change', 'Description']
        },
        prodValues() {
            return [
                {
                    label: "Greenhouse Gasses",
                    value: this.rawData['greenhouseGasEmissions'],
                    change: this.rawData['greenhouseGasEmissions'] - this.bau['greenhouseGasEmissions'],
                    unit: "Total emissions in CO2-equiv (average kg/ha/year)"
                },
                {
                    label: "Profit",
                    value: this.rawData['profit'],
                    change: this.rawData['profit'] - this.bau['profit'],
                    unit: "Profit over variable costs (average £ ha-1)"
                },
                {
                    label: "Calories",
                    value: this.rawData['production'],
                    change: this.rawData['production'] - this.bau['production'],
                    unit: "Calories delivered"
                },
                {
                    label: "People supported",
                    value: this.people_fed,
                    change: this.people_fed - this.people_fed_bau,
                    unit: "Total people receiving a fully-balanced diet"
                }
            ]
        },
        proddata() {
            return {
                labels: [
                    'GHG',
                    'Profit',
                    'Calories'
                ],
                datasets: [{
                    label: '% change from BAU state',
                    backgroundColor: this.chartColors.translucent[2],
                    borderWidth: 1,
                    data: this.baseData.production
                }]
            }
        },
        people_fed() {
            return this.calc_people_fed(
                this.rawData.production,            // Total calories
                this.baseData.nutritionaldelivery,  // Food Groups
                this.baseData.eatLancetPlate)       // Eat Lancet food groups
        },
        people_fed_bau() {
            return this.calc_people_fed(
                this.bau.production,
                this.bau.nutritionaldelivery,
                this.baseData.eatLancetPlate)
        }
    },
    methods: {
        /***
         * Function sent by Alice to calculate the number of people who can be fed based on the provided nutrition.
         *
         * @param totalCalories – the number of calories produced in the region
         * @param foodGroups are the proportions of each group that comes out of the region (i.e. the stuff that informs the pie chart)
         * @param eatLancetFoodGroups are the proportions of each group recommended by EatLancet
         */
        calc_people_fed(totalCalories, foodGroups, eatLancetFoodGroups) {
          // First find the limiting group
          let myMin = foodGroups[0] / eatLancetFoodGroups[0]
          //console.log(totalCalories, myMin, foodGroups, eatLancetFoodGroups)

          for (let i=1 ; i < foodGroups.length; i++)
          {
            if (myMin > foodGroups[i] / eatLancetFoodGroups[i])
              myMin = foodGroups[i] / eatLancetFoodGroups[i]
          }

          return Math.floor((totalCalories*1000000) * myMin / (2500*365.2425))
        }
    }
}
</script>