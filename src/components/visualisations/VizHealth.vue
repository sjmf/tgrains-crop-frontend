<script>
    import { Bar, mixins } from 'vue-chartjs'
    const { reactiveProp } = mixins

    export default {
        name: 'viz-health',
        extends: Bar,
        mixins: [reactiveProp],
        props: {
            chartData: Object
        },
        data () {
            return {
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    legend: {
                        display: false
                    },
                    scales: {
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: '% change from BAU state',
                                fontSize: 14
                            },
                            ticks: {
                                suggestedMax: 50,
                                suggestedMin: -50,
                            },
                            type: 'linear',
                            gridLines: {
                                zeroLineWidth: .5,
                                lineWidth: 0
                            }
                        }],
                        xAxes: [{
                            position: 'top',
                            offset: true,
                            ticks: {
                                beginAtZero: false,
                                fontSize: 14
                            },
                            gridLines: {
                                zeroLineWidth: .5,
                                lineWidth: 0
                            }
                        }]
                    }
                }
            }
        },
        mounted () {
            this.renderChart(this.chartData, this.options)
        }
    }
</script>