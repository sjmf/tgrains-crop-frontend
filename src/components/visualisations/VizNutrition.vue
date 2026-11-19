<template>
    <Pie :data="chartData" :options="options" :plugins="plugins"/>
</template>

<script>
    import { Pie } from 'vue-chartjs'
    import OutLabels from '@energiency/chartjs-plugin-piechart-outlabels'
    import './chartSetup'

    export default {
        name: 'viz-nutrition',
        components: { Pie },
        props: {
            chartData: Object,
            width: { type: Number, default: 400 },
            height: { type: Number, default: 400 }
        },
        data() {
            return {
                // Only attach outlabels to this chart: it assumes a pie controller
                plugins: [OutLabels]
            }
        },
        computed: {
            options() {
                return {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: this.width / this.height,
                    animation: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: false
                        },
                        outlabels: {
                            display: true,
                            text: '%l\n%p',
                            borderWidth: 0,
                            lineWidth: 0,
                            padding: 3,
                            stretch: 20,
                            maxZoomOutPercentage: 50,
                        }
                    }
                }
            }
        }
    }
</script>
