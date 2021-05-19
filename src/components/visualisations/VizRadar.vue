<script>
  import { Radar, mixins } from 'vue-chartjs'
  import './scale.radialLogarithmic'
  const { reactiveProp } = mixins

  export default {
    name: 'viz-radar',
    extends: Radar,
    mixins: [reactiveProp],
    props: {
      chartData: Object,
      prOptions: Object
    },
    computed: {
      options() {
        return {
          tooltips: {
            mode: 'label'
          },
          scale: {
            type: 'radialLogarithmic',
            ticks: {
              max: 100
            }
          }
        }
      }
    },
    mounted () {
      this.renderChart(this.chartData, this.options)
    }
  }
</script>