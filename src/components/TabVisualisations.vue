<template>
  <div class="container">
    <div id="production-tab" class="col s12">
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
                  :titles="prodtitles"
                  :values="prodvalues"/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="environment-tab" class="col s12">
      <div class="card panel">
        <div class="card-content">
          <span class="card-title">Nitrogen Leaching and Pesticide Impacts</span>
          <div class="chart-panel">
            <viz-pests
                :chart-data="pestdata"
                :height="chartHeight"/>
          </div>
          <p>In this chart, higher values indicate worse environmental impacts.</p>
        </div>
      </div>
    </div>

    <div id="nutrition-tab" class="col s12">
      <div class="row">
        <div class="col s12 m6">
          <div class="card panel">
            <div class="card-content">
              <span class="card-title">Target plate</span>
              <p>The <a href="https://eatforum.org/eat-lancet-commission/" target="_blank">EATLancet report</a> suggests the following plate to achieve a balanced diet sustainably:</p>
              <div class="chart-panel">
                <viz-nutrition
                    :chart-data="eatlancet"
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
                    :chart-data="nutridata"
                    :height="chartHeight"
                    :width="chartHeight"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    import VizProduction from "@/components/VizProduction";
    import VizPests from "@/components/VizPesticides";
    import VizNutrition from "@/components/VizNutrition";

    import DataTable from "@/components/DataTable";

    export default {
        name: 'TabVisualisations',
        components: {DataTable, VizPests, VizNutrition, VizProduction},
        data (){
            return {
                chartHeight: 125,
                // Use TAB10 colors for charts to aid colorblind use
                chartColors: {
                    opaque: [
                        'rgba( 31, 119, 180, 1)',  // blue
                        'rgba(255, 127,  14, 1)',  // orange
                        'rgba( 44, 160,  44, 1)',  // green
                        'rgba(214,  39,  40, 1)',  // red
                        'rgba(148, 103, 189, 1)',  // purple
                        'rgba(140,  86,  75, 1)',  // brown
                        'rgba(227, 119, 194, 1)',  // pink
                        'rgba(188, 189,  34, 1)',  // lime
                        'rgba( 23, 190, 207, 1)',  // turquoise
                        'rgba(127, 127, 127, 1)',  // grey
                    ],
                    translucent: [
                        'rgba( 31, 119, 180, .3)',  // blue
                        'rgba(255, 127,  14, .3)',  // orange
                        'rgba( 44, 160,  44, .3)',  // green
                        'rgba(214,  39,  40, .3)',  // red
                        'rgba(148, 103, 189, .3)',  // purple
                        'rgba(140,  86,  75, .3)',  // brown
                        'rgba(227, 119, 194, .3)',  // pink
                        'rgba(188, 189,  34, .3)',  // lime
                        'rgba( 23, 190, 207, .3)',  // turquoise
                        'rgba(127, 127, 127, .3)',  // grey
                    ]
                }
            }
        },
        computed: {
            basedata() {
                return this.$store.state.data[this.$store.state.landscape_id]
            },
            rawdata() {
                return this.$store.state.data.raw[this.$store.state.landscape_id]
            },
            bau() {
                return this.$store.state.bau[this.$store.state.landscape_id]
            },
            prodtitles() {
                return ['Factor', 'Value', 'Change', 'Description']
            },
            prodvalues() {
                return [
                    {
                        label: "Greenhouse Gasses",
                        value: this.rawdata['greenhouseGasEmissions'],
                        change: this.rawdata['greenhouseGasEmissions'] - this.bau['greenhouseGasEmissions'],
                        unit: "Total emissions in CO2-equiv (average kg/ha/year)"
                    },
                    {
                        label: "Profit",
                          value: this.rawdata['profit'],
                        change: this.rawdata['profit'] - this.bau['profit'],
                        unit: "Profit over variable costs (average £ ha-1)"
                    },
                    {
                        label: "Calories",
                        value: this.rawdata['production'],
                        change: this.rawdata['production'] - this.bau['production'],
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
                        data: this.basedata.production
                    }]
                }
            },
            pestdata() {
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
                        data: this.basedata.pesticideImpacts
                    }]
                }
            },
            nutridata() {
                return {
                    labels: (this.$store.state.strings[this.$store.state.landscape_id]['food_groups'] || [])
                        .map(x => this.$store.state.food_groups_dictionary[x]),
                    type: 'outlabeledPie',
                    datasets: [{
                        backgroundColor: this.chartColors.opaque,
                        borderWidth: 1,
                        data: this.basedata.nutritionaldelivery
                    }]
                }
            },
            eatlancet() {
                return {
                    labels: this.nutridata.labels,
                    type: 'outlabeledPie',
                    datasets: [{
                        backgroundColor: this.chartColors.opaque,
                        borderWidth: 1,
                        data: this.basedata.eatLancetPlate
                    }]
                }
            },
            people_fed() {
                return this.calc_people_fed(
                    this.$store.state.data.raw[this.$store.state.landscape_id].production,
                    this.$store.state.data[this.$store.state.landscape_id].nutritionaldelivery,
                    this.$store.state.data[this.$store.state.landscape_id].eatLancetPlate)
            },
            people_fed_bau() {
              return this.calc_people_fed(
                  this.$store.state.bau[this.$store.state.landscape_id].production,
                  this.$store.state.bau[this.$store.state.landscape_id].nutritionaldelivery,
                  this.$store.state.data[this.$store.state.landscape_id].eatLancetPlate)
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
            calc_people_fed(totalCalories, foodGroups, eatLancetFoodGroups)
            {
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

<style scoped>
  .chart-panel {
    min-height: 300px;
  }
  .card .card-content .chart-panel + p {
    margin-top: 20px;
  }
</style>