/***
 * Provides shorthands for data in store for use in tabs
 */
export default {
    computed: {
        chartColors() {
            return this.$store.state.chartColors
        },
        baseData() {
            return this.$store.state.data[this.$store.state.landscape_id]
        },
        rawData() {
            return this.$store.state.data.raw[this.$store.state.landscape_id]
        },
        bauData() {
            return this.$store.state.bau[this.$store.state.landscape_id]
        },
    }
}