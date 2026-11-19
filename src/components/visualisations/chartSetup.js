// Chart.js setup shared by the Viz* components. Import this before rendering a chart.

import { Chart, registerables } from 'chart.js'
import RadialLogarithmicScale from './scale.radialLogarithmic'

Chart.register(...registerables, RadialLogarithmicScale)

/**
 * Options shared by the "% change from BAU" bar charts.
 * Only the zero line and the left axis line are drawn, as in the Chart.js 2 version.
 * @param aspectRatio width / height of the chart
 */
export function bauBarOptions(aspectRatio) {
    const axisLine = 'rgba(0, 0, 0, 0.25)'
    return {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                type: 'linear',
                title: {
                    display: true,
                    text: '% change from BAU state',
                    font: { size: 14 }
                },
                suggestedMax: 50,
                suggestedMin: -50,
                border: { width: .5, color: axisLine },
                grid: {
                    color: axisLine,
                    lineWidth: (ctx) => ctx.tick && ctx.tick.value === 0 ? .5 : 0
                }
            },
            x: {
                position: 'top',
                offset: true,
                beginAtZero: false,
                ticks: {
                    font: { size: 14 }
                },
                border: { display: false },
                grid: { display: false }
            }
        }
    }
}
