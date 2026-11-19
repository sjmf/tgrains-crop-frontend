import { describe, it, expect, beforeEach } from 'vitest'
import mutations from '@/store/mutations'
import { initial_state } from '@/store/state'

// A state with one landscape loaded: two crops, one livestock, and tags for them
function loadedState() {
    const state = initial_state()
    state.landscapes[101] = {
        crops: {
            wheat: { name: 'wheat', label: 'Wheat', value: 100, bau: 100 },
            barley: { name: 'barley', label: 'Barley', value: 50, bau: 50 },
        },
        livestock: {
            pigs: { name: 'pigs', label: 'Pigs', value: 10, bau: 10 },
        },
    }
    state.data[101] = { production: [0, 0, 0] }
    state.data.raw[101] = { profit: 1 }
    state.tags = {
        groups: [[], [2, 3, 4]],
        tags: {
            1: { name: 'Business-as-usual', group: 0, selected: false },
            2: { name: 'Wheat', group: 1, selected: false },
            3: { name: 'Barley', group: 1, selected: false },
            4: { name: 'Pigs', group: 1, selected: false },
        },
        mapping: { wheat: 2, barley: 3, pigs: 4 },
    }
    state.history = []
    return state
}

describe('setLandscapeId', () => {
    it('sets the id and name', () => {
        const state = initial_state()
        mutations.setLandscapeId(state, 102)
        expect(state.landscape_id).toBe(102)
        expect(state.landscapeName).toBe('South Wales')
    })

    it('ignores NaN and out-of-range ids (e.g. before the route resolves)', () => {
        const state = initial_state()
        mutations.setLandscapeId(state, NaN)
        mutations.setLandscapeId(state, 5)
        expect(state.landscape_id).toBe(101)
    })
})

describe('setFormValue', () => {
    it('updates a known crop and ignores unknown names', () => {
        const state = loadedState()
        mutations.setFormValue(state, { type: 'crops', name: 'wheat', value: 120 })
        mutations.setFormValue(state, { type: 'crops', name: 'nope', value: 1 })
        expect(state.landscapes[101].crops.wheat.value).toBe(120)
        expect(state.landscapes[101].crops.nope).toBeUndefined()
    })
})

describe('pushHistory', () => {
    let state
    beforeEach(() => { state = loadedState() })

    it('records changes and auto-tags the changed variables, largest change first', () => {
        state.landscapes[101].crops.barley.value = 80   // +30
        state.landscapes[101].livestock.pigs.value = 20 // +10
        mutations.pushHistory(state)

        expect(state.history).toHaveLength(1)
        expect(state.historyIndex).toBe(0)
        expect(state.history[0].changes.distance).toBe(40)
        expect(state.history[0].tags).toEqual([3, 4])
    })

    it('always sets changes, including for a business-as-usual push', () => {
        // Regression: a `tags !== [1]` fix once left `changes` undefined for BAU states,
        // and SidebarMenu reads history[i].changes.distance on mount.
        mutations.pushHistory(state, [1])
        expect(state.history[0].changes).toEqual({ distance: 0, changes: [] })
        expect(state.history[0].tags).toEqual([1])
    })

    it('snapshots inputs so later edits do not change history', () => {
        mutations.pushHistory(state)
        state.landscapes[101].crops.wheat.value = 999
        expect(state.history[0].inputs.crops.wheat.value).toBe(100)
    })
})

describe('activateTags', () => {
    it('does nothing before tags have loaded', () => {
        // Regression: threw "state.tags.groups[1] is not iterable" on a first visit
        const state = initial_state()
        state.tags = { groups: [], tags: {}, mapping: {} }
        expect(() => mutations.activateTags(state, 0)).not.toThrow()
    })

    it('selects the group-1 tags of a history entry and clears the rest', () => {
        const state = loadedState()
        state.tags.tags[4].selected = true
        state.history = [{ tags: [1, 2] }]
        mutations.activateTags(state, 0)

        expect(state.tags.tags[2].selected).toBe(true)
        expect(state.tags.tags[3].selected).toBe(false)
        expect(state.tags.tags[4].selected).toBe(false)
        expect(state.tags.tags[1].selected).toBe(false) // group 0 is never auto-selected
    })
})

describe('setTagSelected', () => {
    it('sets selection on a tag that arrived after load', () => {
        const state = loadedState()
        mutations.setTagSelected(state, { id: 3, value: true })
        expect(state.tags.tags[3].selected).toBe(true)
    })
})
