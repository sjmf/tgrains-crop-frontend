import Chart from 'chart.js'

const helpers = Chart.helpers;

function XlogY(x,y) {
    return Math.log(x) / Math.log(y)
}

let scale_radialLinear = helpers.clone(Chart.scaleService.getScaleConstructor('radialLinear'))
let opts_radialLinear = helpers.clone(scale_radialLinear._defaults)

let RadialLogarithmic = scale_radialLinear.extend({
    /**
     * Tells chart where to draw points on drawing surface
     * @param value
     * @return scalar value for co-ordinate point
     */
    getDistanceFromCenterForValue: function(value) {
        if (helpers.isNullOrUndef(value)) {
            return NaN;
        }

        // Handle edge case where value <1
        if(value < 1)
            value = 1

        // drawingArea – the scale to fit values to
        // min - minimum value from input data
        // max - maximum value from input data (value log base max)
        // value - value to fit to drawingArea (between min and max)

        if (this.options.ticks.reverse)
            return this.drawingArea - (this.drawingArea * XlogY(value, this.max))

        return this.drawingArea * XlogY(value, this.max)
    },

    // There is an infinite loop problem with the buildTicks function as written (I think when values are 0?)
    // This is a hack that only works for the charts in this project:
    buildTicks: function() {
        this.ticks =  [1, 2, 4, 10, 22, 50, 100]
    }

    /**
     * Logarithmic tick generation adapted from chart.js core
     *   Generate tick marks. this.chart is the chart instance. The data object can be accessed as this.chart.data
     *   buildTicks() should create a ticks array on the axis instance, if you intend to use any of the
     *   implementations from the base class
     *
     * @returns {[]}
     */
    // buildTicks: function() {
    //     function finiteOrDefault(value, defaultValue) {
    //         const isNumberFinite = (value) => (typeof value === 'number' || value instanceof Number) && isFinite(+value);
    //         return isNumberFinite(value) ? value : defaultValue;
    //     }
    //     function isMajor(tickVal) {
    //         let remain = tickVal / Math.pow(10, Math.floor(helpers.log10(tickVal)));
    //         return remain === 1;
    //     }
    //     const log10 = helpers.log10;
    //
    //     this.min = this.options.ticks.min ? this.options.ticks.min : this.min;
    //     this.max = this.options.ticks.max ? this.options.ticks.max : this.max;
    //
    //     const endExp = Math.floor(log10(this.max));
    //     const endSignificand = Math.ceil(this.max / Math.pow(10, endExp));
    //     const ticks = [];
    //
    //     let tickVal = finiteOrDefault(this.min, Math.pow(10, Math.floor(log10(this.min))));
    //     let exp = Math.floor(log10(tickVal));
    //     let significand = Math.floor(tickVal / Math.pow(10, exp));
    //     let precision = exp < 0 ? Math.pow(10, Math.abs(exp)) : 1;
    //
    //     do {
    //         ticks.push({value: tickVal, major: isMajor(tickVal)});
    //
    //         ++significand;
    //         if (significand === 10) {
    //             significand = 1;
    //             ++exp;
    //             precision = exp >= 0 ? 1 : precision;
    //         }
    //
    //         tickVal = Math.round(significand * Math.pow(10, exp) * precision) / precision;
    //     } while (exp < endExp || (exp === endExp && significand < endSignificand));
    //
    //     const lastTick = finiteOrDefault(this.max, tickVal);
    //     ticks.push({value: lastTick, major: isMajor(tickVal)});
    //     return ticks;
    // }
})

Chart.scaleService.registerScaleType('radialLogarithmic', RadialLogarithmic, opts_radialLinear);
