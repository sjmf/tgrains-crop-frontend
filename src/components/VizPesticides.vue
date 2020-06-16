<script>
    import { Bar, mixins } from 'vue-chartjs'
    const { reactiveProp } = mixins

    export default {
        name: 'viz-environment',
        extends: Bar,
        mixins: [reactiveProp],
        props: {
            chartData: Array,
            chartColors: Object
        },
        data() {
            return {
                labels: [
                    'Nitrogen leeching',
                    'Ground Water',
                    'Fish',
                    'Birds',
                    'Bees',
                    'Beneficial Arthropods'],
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
        mounted() {
            this.renderChart({
                labels: this.labels,
                datasets: [{
                    label: '% change from BAU state',
                    backgroundColor: this.chartColors.translucent[4],
                    borderWidth: 1,
                    data: this.chartData
                }]
            }, this.options)
        }
    }
</script>