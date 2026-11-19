import { describe, it, expect } from 'vitest'
import RadialLogarithmicScale from '@/components/visualisations/scale.radialLogarithmic'
import { bauBarOptions } from '@/components/visualisations/chartSetup'

// Call the scale's methods on a plain object standing in for a laid-out scale
const scale = (opts = {}) => Object.assign(Object.create(RadialLogarithmicScale.prototype),
    { drawingArea: 100, max: 100, options: { reverse: false }, ...opts })

describe('RadialLogarithmicScale', () => {
    it('is registered under its own id with radial-linear defaults', () => {
        expect(RadialLogarithmicScale.id).toBe('radialLogarithmic')
    })

    it('places values logarithmically between the centre (1) and the edge (max)', () => {
        const s = scale()
        expect(s.getDistanceFromCenterForValue(1)).toBe(0)
        expect(s.getDistanceFromCenterForValue(10)).toBeCloseTo(50)
        expect(s.getDistanceFromCenterForValue(100)).toBeCloseTo(100)
    })

    it('clamps values below 1 to the centre and returns NaN for missing values', () => {
        const s = scale()
        expect(s.getDistanceFromCenterForValue(0)).toBe(0)
        expect(s.getDistanceFromCenterForValue(0.2)).toBe(0)
        expect(s.getDistanceFromCenterForValue(null)).toBeNaN()
        expect(s.getDistanceFromCenterForValue(undefined)).toBeNaN()
    })

    it('mirrors distances when reversed', () => {
        expect(scale({ options: { reverse: true } }).getDistanceFromCenterForValue(10)).toBeCloseTo(50)
        expect(scale({ options: { reverse: true } }).getDistanceFromCenterForValue(100)).toBeCloseTo(0)
    })

    it('uses fixed ticks (generating them loops forever on zero values)', () => {
        expect(scale().buildTicks().map(t => t.value)).toEqual([1, 2, 4, 10, 22, 50, 100])
    })
})

describe('bauBarOptions', () => {
    const opts = bauBarOptions(1.6)

    it('keeps the aspect ratio and hides the legend', () => {
        expect(opts.aspectRatio).toBe(1.6)
        expect(opts.plugins.legend.display).toBe(false)
    })

    it('draws only the zero grid line on the y axis', () => {
        const width = opts.scales.y.grid.lineWidth
        expect(width({ tick: { value: 0 } })).toBe(0.5)
        expect(width({ tick: { value: 10 } })).toBe(0)
        expect(width({})).toBe(0)
    })

    it('labels categories along the top with no x grid', () => {
        expect(opts.scales.x.position).toBe('top')
        expect(opts.scales.x.grid.display).toBe(false)
        expect(opts.scales.y.title.text).toBe('% change from BAU state')
    })
})
