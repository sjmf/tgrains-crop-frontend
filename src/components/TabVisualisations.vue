<template>
  <div class="container">
    <div id="production-tab" class="col s12">
      <div class="card panel">
        <div class="card-content">
          <span class="card-title">Change from "Business-as-usual"</span>
          <div class="chart-panel">
            <viz-production
                :chart-data="this.proddata"
                :chart-colors="colors"
                :height="chartHeight"/>
            <!-- -->
          </div>
        </div>
      </div>
    </div>

    <div id="environment-tab" class="col s12">
      <div class="row">
        <div class="col s12 m6">
          <div class="card panel">
            <div class="card-content">
              <span class="card-title">Nutrient Leeching and Pesticides</span>
              <div class="chart-panel">
                <viz-pests
                    :chart-data="this.pestdata"
                    :chart-colors="colors"
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
                    :chart-data="this.nutridata"
                    :chart-colors="colors"
                    :height="chartHeight"
                    :width="chartHeight"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="health-tab" class="col s12">
      <div class="card panel">
        <div class="card-content">
          <span class="card-title">Health Risks</span>
          <div class="chart-panel">
            <viz-health
                :chart-data="this.healthdata"
                :chart-colors="colors"
                :height="chartHeight"/>
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

    export default {
        name: 'TabVisualisations',
        components: {VizDebug, VizHealth, VizPests, VizNutrition, VizProduction},
        data (){
            return {
                chartHeight: 200,
                // Use TAB10 colors for charts to aid colorblind use
                colors: {
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
            proddata () {
                return [30, 10, -10, -4, 14]
            },
            pestdata () {
                return [35, 21, -3, -5, 10, 17]
            },
            nutridata () {
                return [12, 8, 33, 12, 10, 10, 5, 5, 3, 2]
            },
            healthdata () {
                return [20, -26, 17, 40]
            }
        }
    }
</script>

<style scoped>
  .chart-panel {
    min-height: 300px;
  }
</style>