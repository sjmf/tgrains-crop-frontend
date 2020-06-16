<script>
    import { mixins, generateChart } from 'vue-chartjs'
    import 'chartjs-plugin-piechart-outlabels'
    const { reactiveProp } = mixins
    const OutlabeledPie = generateChart('outlabeledPie', 'outlabeledPie')

    export default {
        name: 'viz-nutrition',
        extends: OutlabeledPie,
        mixins: [reactiveProp],
        props: {
            chartData: Array,
            chartColors: Object,
            plugins: Array
        },
        data() {
            return {
                labels: [
                    'Whole Grains', 'Tubers', 'Vegetables', 'Fruits', 'Dairy',
                    'Added Fats', 'Saturated Fats', 'Sugars', 'Animal Protein', 'Vegetable Protein'],
                options: {
                    responsive: true,           // Changed as responsive doesn't work properly with tabs (display:none)
                    maintainAspectRatio: true,  //
                    legend: {
                        display: false
                    },
                    tooltips: {
                        enabled: false
                    },
                    //rotation: .5* Math.PI,
                    plugins: {
                        outlabels: {
                            display: true,
                            text: '%l\n%p',
                            borderWidth: 0,
                            lineWidth: 0,
                            padding: 3,
                            stretch: 20,
                            zoomOutPercentage: 50,
                            //color: 'white',
                            //backgroundColor: "",
                            //lineColor: "rgba(255, 255, 255, 0)",  // hide lines
                        }
                    },
                    // font: {
                    //     size:16,
                    //     resizable: true,
                    //     minSize: 12,
                    //     maxSize: 18
                    // }
                },
            }
        },
        mounted() {

            this.renderChart({
                labels: this.labels,
                type: 'outlabeledPie',
                datasets: [{
                    backgroundColor: this.chartColors.opaque,
                    borderWidth: 1,
                    data: this.chartData
                }]
            }, this.options)
        }
    }
</script>