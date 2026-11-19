import { RadialLinearScale } from 'chart.js'

function XlogY(x,y) {
    return Math.log(x) / Math.log(y)
}

/**
 * Radial scale with logarithmic spacing, for the nutrition radar chart.
 * Register with Chart.register(RadialLogarithmicScale) and use as `scales: { r: { type: 'radialLogarithmic' } }`.
 */
export default class RadialLogarithmicScale extends RadialLinearScale {
    static id = 'radialLogarithmic'
    static defaults = RadialLinearScale.defaults

    /**
     * Tells chart where to draw points on drawing surface
     * @param value
     * @return scalar value for co-ordinate point
     */
    getDistanceFromCenterForValue(value) {
        if (value === null || value === undefined) {
            return NaN;
        }

        // Handle edge case where value <1
        if(value < 1)
            value = 1

        // drawingArea – the scale to fit values to
        // max - maximum value from input data (value log base max)
        // value - value to fit to drawingArea (between 1 and max)

        if (this.options.reverse)
            return this.drawingArea - (this.drawingArea * XlogY(value, this.max))

        return this.drawingArea * XlogY(value, this.max)
    }

    // Generating log ticks from the data loops forever when values are 0, so use fixed ticks.
    // This only works for the charts in this project:
    buildTicks() {
        return [1, 2, 4, 10, 22, 50, 100].map(value => ({ value }))
    }
}
