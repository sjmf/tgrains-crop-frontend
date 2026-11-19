<template>
    <Bar :data="chartData" :options="options"/>
</template>

<script>
    import { Bar } from 'vue-chartjs'
    import { bauBarOptions } from './chartSetup'

    export default {
        name: 'viz-environment',
        components: { Bar },
        props: {
            chartData: Object,
            width: { type: Number, default: 400 },
            height: { type: Number, default: 400 }
        },
        computed: {
            options() {
                return bauBarOptions(this.width / this.height)
            }
        }
    }
</script>
