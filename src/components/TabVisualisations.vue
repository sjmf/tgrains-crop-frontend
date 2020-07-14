<template>
  <div class="container">
    <div id="production-tab" class="col s12">
      <div class="card panel">
        <div class="card-content">
          <span class="card-title">Change from "Business-as-usual"</span>
          <div class="chart-panel">
            <viz-production
                :chart-data="proddata"
                :height="chartHeight"/>
            <!-- -->
          </div>
        </div>
      </div>
    </div>

    <div id="environment-tab" class="col s12">
      <div class="card panel">
        <div class="card-content">
          <span class="card-title">Nutrient Leaching and Pesticides</span>
          <div class="chart-panel">
            <viz-pests
                :chart-data="pestdata"
                :height="chartHeight"/>
          </div>
        </div>
      </div>
    </div>

    <div id="nutrition-tab" class="col s12">
      <div class="row">
        <div class="col s12 m6">
          <div class="card panel">
            <div class="card-content">
              <span class="card-title">Health Risks</span>
              <div class="chart-panel">
                <viz-health
                    :chart-data="healthdata"
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

    <viz-debug/>
  </div>
</template>
<script>
    import VizProduction from "@/components/VizProduction";
    import VizPests from "@/components/VizPesticides";
    import VizNutrition from "@/components/VizNutrition";
    import VizHealth from "@/components/VizHealth";
    import VizDebug from "@/components/VizDebug";

    import store from "../store";

    export default {
        name: 'TabVisualisations',
        components: {VizDebug, VizHealth, VizPests, VizNutrition, VizProduction},
        data (){
            return {
                chartHeight: 200,
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
                        'rgba(127, 127, 127, 1)',  // grey
                        'rgba(188, 189,  34, 1)',  // lime
                        'rgba( 23, 190, 207, 1)',  // turquoise
                    ],
                    translucent: [
                        'rgba( 31, 119, 180, .3)',  // blue
                        'rgba(255, 127,  14, .3)',  // orange
                        'rgba( 44, 160,  44, .3)',  // green
                        'rgba(214,  39,  40, .3)',  // red
                        'rgba(148, 103, 189, .3)',  // purple
                        'rgba(140,  86,  75, .3)',  // brown
                        'rgba(227, 119, 194, .3)',  // pink
                        'rgba(127, 127, 127, .3)',  // grey
                        'rgba(188, 189,  34, .3)',  // lime
                        'rgba( 23, 190, 207, .3)',  // turquoise
                    ]
                }
            }
        },
        computed: {
            basedata() {
                return store.state.data[store.state.landscape_id]
            },
            proddata () {
               return {
                    labels: [
                        'GHG',
                        'Nitrogen leaching',
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
            pestdata () {
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
            nutridata () {
                return {
                    labels: [
                        'Whole Grains',
                        'Tubers',
                        'Vegetables',
                        'Fruits',
                        'Dairy',
                        'Added Fats',
                        'Saturated Fats',
                        'Sugars',
                        'Animal Protein',
                        'Vegetable Protein'
                    ],
                    type: 'outlabeledPie',
                    datasets: [{
                        backgroundColor: this.chartColors.opaque,
                        borderWidth: 1,
                        data: this.basedata.nutritionaldelivery
                    }]
                }
            },
            healthdata () {
                return {
                    labels: [
                        'Stroke',
                        'Cancer',
                        'Heart Disease',
                        'Diabetes'
                    ],
                    datasets: [{
                        label: '% change from BAU state',
                        backgroundColor: this.chartColors.translucent[3],
                        borderWidth: 1,
                        data: this.basedata.healthRiskFactors
                    }]
                }
            }
        }
    }
</script>

<style scoped>
  .chart-panel {
    min-height: 300px;
  }
</style>