import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DataTable from '@/components/visualisations/DataTable.vue'

const row = (extra) => ({ label: 'Profit', value: 0, description: 'd', ...extra })
const cells = (values) => mount(DataTable, { props: { titles: ['a', 'b', 'c', 'd'], values } })
    .findAll('tbody td').map(td => td.text().replace(/\s+/g, ' ').trim())

describe('DataTable', () => {
    it('abbreviates large numbers to thousands, millions and billions', () => {
        expect(cells([row({ value: 1234 })])[1]).toBe('1.2 thousand')
        expect(cells([row({ value: 330712345 })])[1]).toBe('330.7 million')
        expect(cells([row({ value: 2.5e9 })])[1]).toBe('2.5 billion')
        expect(cells([row({ value: 999 })])[1]).toBe('999')
    })

    it('signs and colours changes, with no sign for zero', () => {
        const t = mount(DataTable, { props: { values: [
            row({ label: 'up', change: 5000 }), row({ label: 'down', change: -2e6 }), row({ label: 'same', change: 0 }),
        ] } })
        const change = t.findAll('tbody tr').map(tr => tr.findAll('td')[2])
        expect(change.map(td => td.text().replace(/\s+/g, ' ').trim())).toEqual(['+ 5 thousand', '- 2 million', '0'])
        expect(change[0].classes()).toContain('green-text')
        expect(change[1].classes()).toContain('red-text')
        expect(change[2].classes()).not.toContain('green-text')
    })

    it('places units before or after the value and change as configured', () => {
        expect(cells([row({ value: 5, change: 1, unit: { string: '£', loc: 'pre', which: 'value' } })]).slice(1, 3))
            .toEqual(['£ 5', '+ 1'])
        expect(cells([row({ value: 5, change: 1, unit: { string: '%', loc: 'post', which: 'both' } })]).slice(1, 3))
            .toEqual(['5 %', '+ 1 %'])
    })

    it('leaves the change cell empty when a row has no change', () => {
        expect(cells([row({ value: 1 })])[2]).toBe('')
    })
})
