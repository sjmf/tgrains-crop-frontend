import { describe, it, expect } from 'vitest'
import router from '@/router'
import RouteError from '@/components/RouteError.vue'
import EthicsStatement from '@/components/EthicsStatement.vue'
import TabNutrition from '@/components/tabs/TabNutrition.vue'

const matched = (path) => router.resolve(path).matched.map(r => r.components.default)

describe('router', () => {
    it('redirects / to the first landscape production tab', async () => {
        await router.push('/')
        expect(router.currentRoute.value.fullPath).toBe('/landscape/101/production')
    })

    it('redirects a bare landscape to its production tab, keeping the id', async () => {
        await router.push('/landscape/102')
        expect(router.currentRoute.value.fullPath).toBe('/landscape/102/production')
        expect(router.currentRoute.value.params.id).toBe('102')
    })

    it('resolves tabs as children of the landscape route', () => {
        expect(matched('/landscape/101/nutrition').at(-1)).toBe(TabNutrition)
    })

    it('serves the ethics statement', () => {
        expect(matched('/ethics')).toEqual([EthicsStatement])
    })

    it('sends unknown paths to the error page', () => {
        expect(matched('/no/such/page')).toEqual([RouteError])
    })
})
