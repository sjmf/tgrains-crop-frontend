import { describe, it, expect } from 'vitest'
import {
    difference, sumArea, formatData, distanceFromBAU, calcPeopleFed, createUniqueID, setUndef
} from '@/store/helpers'

describe('difference', () => {
    it('gives the percentage change from BAU, rounded to 2dp', () => {
        const bau = { production: [100, 200], environmentImpacts: [50], nutritionaldelivery: [1], eatLancetPlate: [2] }
        const now = { production: [110, 150], environmentImpacts: [50.0001], nutritionaldelivery: [3], eatLancetPlate: [4] }
        expect(difference(bau, now)).toEqual({
            production: [10, -25],
            environmentImpacts: [0],
            nutritionaldelivery: [3],   // not diffed
            eatLancetPlate: [4],        // not diffed
        })
    })
})

describe('sumArea', () => {
    it('adds crop and livestock areas', () => {
        expect(sumArea({ cropAreas: [1, 2, 3], livestockAreas: [10, 20] })).toBe(36)
    })
})

describe('formatData', () => {
    it('shapes a model result for the charts', () => {
        const state = { landscape_id: 101, data: { 101: { eatLancetPlate: [0.5, 0.5] } } }
        const result = {
            profit: 1000, production: 2000, cropAreas: [5, 5], livestockAreas: [10],
            greenhouseGasEmissions: 3, nLeach: 4, pesticideImpacts: [5, 6], nutritionaldelivery: [0.7, 0.3],
        }
        expect(formatData(state, result)).toEqual({
            production: [1000, 2000, 20],
            environmentImpacts: [3, 4, 5, 6],
            nutritionaldelivery: [0.7, 0.3],
            eatLancetPlate: [0.5, 0.5],
        })
    })
})

describe('distanceFromBAU', () => {
    const state = (crops, livestock = {}) => ({ landscape_id: 101, landscapes: { 101: { crops, livestock } } })

    it('is zero with no changes for a BAU state', () => {
        expect(distanceFromBAU(state({ wheat: { bau: 10, value: 10 } }))).toEqual({ distance: 0, changes: [] })
    })

    it('sums absolute changes and lists them largest first, ignoring changes under 1ha', () => {
        const s = state(
            { wheat: { bau: 10, value: 15 }, barley: { bau: 10, value: 30 }, oats: { bau: 10, value: 10.5 } },
            { pigs: { bau: 5, value: 2 } },
        )
        expect(distanceFromBAU(s)).toEqual({
            distance: 28.5,
            changes: [{ name: 'barley', dist: 20 }, { name: 'wheat', dist: 5 }, { name: 'pigs', dist: 3 }],
        })
    })
})

describe('calcPeopleFed', () => {
    it('returns 0 without food group data', () => {
        expect(calcPeopleFed(100, undefined, [1])).toBe(0)
    })

    it('finds the limiting food group', () => {
        // Group 1 supplies half of what EAT-Lancet asks for, so it limits
        const fed = calcPeopleFed(1, [0.5, 0.25], [0.5, 0.5])
        expect(fed.lim).toBe(1)
        expect(fed.qty).toBe(Math.floor(1e6 * 0.5 / (2500 * 365.2425)))
    })
})

describe('createUniqueID', () => {
    it('makes seven colon-separated hex groups, and differs each time', () => {
        const id = createUniqueID()
        expect(id).toMatch(/^[0-9a-f]{1,4}(:[0-9a-f]{1,4}){6}$/)
        expect(createUniqueID()).not.toBe(id)
    })
})

describe('setUndef', () => {
    it('clears own properties only', () => {
        const proto = { inherited: 1 }
        const obj = Object.assign(Object.create(proto), { a: 1, b: 2 })
        setUndef(obj)
        expect(obj).toEqual({ a: undefined, b: undefined })
        expect(obj.inherited).toBe(1)
    })
})
