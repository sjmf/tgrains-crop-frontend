import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import VariableRow from '@/components/sidebar/VariableRow.vue'

const mountRow = (props = {}) => mount(VariableRow, {
    props: { name: 'wheat', label: 'Wheat', modelValue: 100, bauValue: 100, remainingArea: 300, ...props },
})

describe('VariableRow', () => {
    it('renders the label, slider and number input from the model value', () => {
        const row = mountRow()
        expect(row.text()).toContain('Wheat')
        expect(row.find('input[type=range]').element.value).toBe('100')
        expect(row.find('input[type=range]').attributes('max')).toBe('400')   // value + remaining
        expect(row.find('input[type=number]').element.value).toBe('100')
    })

    it('emits change on every slider movement, not only on release', async () => {
        // Regression: after the Vue 3 migration the store only updated when the drag ended
        const row = mountRow()
        const range = row.find('input[type=range]')
        for (const v of [120, 140, 160]) {
            // Only 'input' fires mid-drag; 'change' comes on release. (setValue() fires both.)
            range.element.value = String(v)
            await range.trigger('input')
        }
        expect(row.emitted('change')).toEqual([
            [{ name: 'wheat', value: 120 }],
            [{ name: 'wheat', value: 140 }],
            [{ name: 'wheat', value: 160 }],
        ])
        expect(row.emitted('update:modelValue').map(e => e[0])).toEqual([120, 140, 160])
    })

    it('emits change from the number input when it is committed', async () => {
        const row = mountRow()
        const input = row.find('input[type=number]')
        input.element.value = '250'
        await input.trigger('change')
        expect(row.emitted('change')).toEqual([[{ name: 'wheat', value: 250 }]])
    })

    it('fills the track green at BAU, purple when changed, and honours a colour override', () => {
        const fill = row => row.find('input[type=range]').attributes('style')
        expect(fill(mountRow())).toMatch(/linear-gradient\(to right, (#43A047|rgb\(67, 160, 71\)) 25%/)
        expect(fill(mountRow({ modelValue: 200 }))).toMatch(/(#673ab7|rgb\(103, 58, 183\))/)
        expect(fill(mountRow({ colourOverride: '#607D8B' }))).toMatch(/(#607D8B|rgb\(96, 125, 139\))/)
    })

    it('disables both inputs when read-only and can hide the number input', () => {
        const row = mountRow({ readonly: true })
        expect(row.find('input[type=range]').attributes('disabled')).toBeDefined()
        expect(row.find('input[type=number]').attributes('disabled')).toBeDefined()
        expect(mountRow({ hideInput: true }).find('input[type=number]').exists()).toBe(false)
    })

    it('shows a validation message', () => {
        const row = mountRow({ errorMessage: 'Too big' })
        expect(row.find('.error').text()).toBe('Too big')
        expect(row.find('input[type=number]').classes()).toContain('invalid')
    })
})
