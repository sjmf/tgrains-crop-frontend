// First and returning visits: welcome terms, persisted state, landscape switching, version reset
import { test, expect, openApp, waitForIdle } from './support'

test('a first visit shows the welcome terms, which stay accepted after reload', async ({ page }) => {
    await page.goto('/landscape/101/production')
    const modal = page.locator('#modal-welcome')
    await expect(modal).toBeVisible()
    await modal.getByText('Agree and Continue').click()
    await expect(modal).toBeHidden()

    await page.reload()
    await waitForIdle(page)
    await expect(modal).toBeHidden()
})

test('the welcome terms are not shown over the ethics statement', async ({ page }) => {
    await page.goto('/ethics')
    await expect(page.getByText('TGRAINS Ethics and Site Usage Statement')).toBeVisible()
    await expect(page.locator('#modal-welcome')).toBeHidden()
})

test('a returning visitor keeps their history and changed values across reloads', async ({ page }) => {
    // Regression: SidebarMenu read history[i].changes.distance on mount and crashed when it was unset
    await openApp(page)
    const input = page.locator('li.variable-row').filter({ hasText: 'Oilseed Rape' }).locator('input[type=number]')
    const changed = String(Number(await input.inputValue()) + 5000)
    await input.fill(changed)
    await input.dispatchEvent('change')
    await page.getByRole('button', { name: 'Submit' }).click()
    await waitForIdle(page)

    await page.goto('/landscape/101/history')
    await waitForIdle(page)
    await expect(page.locator('.history-card:visible')).toHaveCount(2)
    await expect(input).toHaveValue(changed)
    await expect(page.getByRole('button', { name: 'Reset' })).not.toHaveClass(/disabled/)
})

test('choosing another land area loads that landscape', async ({ page, api }) => {
    await openApp(page)
    await page.locator('#slide-out .select-wrapper input.select-dropdown').first().click()
    await page.locator('ul.dropdown-content li').filter({ hasText: 'South Wales' }).first().click()
    await waitForIdle(page)

    await expect(page).toHaveURL(/\/landscape\/102\//)
    await expect(page.locator('#area-header')).toHaveText('South Wales')
    expect(api.requests.some(r => r.path === '/api/model' && r.query.landscape_id === '102')).toBe(true)
})

test('a new deploy (version hash change) resets persisted state', async ({ page }) => {
    await openApp(page)
    // Simulate state saved by an older build
    await page.evaluate(() => {
        const s = JSON.parse(localStorage.getItem('vuex'))
        s.versionHash = 'an-older-build'
        s.landscapeName = 'Stale Name'
        localStorage.setItem('vuex', JSON.stringify(s))
    })
    await page.reload()
    await waitForIdle(page)

    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('vuex')))
    expect(saved.versionHash).toBe('e2e')
    await expect(page.locator('#area-header')).toHaveText('East Anglia')
})
