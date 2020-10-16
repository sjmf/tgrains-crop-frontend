<template>
  <div class="container">
    <div id="production-tab" class="col s12">
      <TabProduction :chart-height="chartHeight" :chart-colors="chartColors"/>
    </div>

    <div id="environment-tab" class="col s12">
      <TabEnvironment :chart-height="chartHeight" :chart-colors="chartColors"/>
    </div>

    <div id="nutrition-tab" class="col s12">
      <TabNutrition :chart-height="chartHeight" :chart-colors="chartColors"/>
    </div>

    <div id="history-tab" class="col s12">
      <TabHistory/>
    </div>
  </div>
</template>
<script>
import TabNutrition from "@/components/tabs/TabNutrition";
import TabProduction from "@/components/tabs/TabProduction";
import TabEnvironment from "@/components/tabs/TabEnvironment";
import TabHistory from "@/components/tabs/TabHistory";

export default {
        name: 'TabVisualisations',
        components: {
            TabHistory,
            TabEnvironment,
            TabProduction,
            TabNutrition
        },
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
        }
    }
</script>