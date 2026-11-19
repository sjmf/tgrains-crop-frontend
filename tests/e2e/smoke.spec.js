// Every page renders, with charts, and without console errors (checked by the `errors` fixture)
import { test, expect, openApp } from './support'

const charts = { production: 1, environment: 1, nutrition: 3 }

for (const landscape of [101, 102]) {
    for (const [tab, count] of Object.entries(charts)) {
        test(`landscape ${landscape} ${tab} tab renders ${count} chart(s)`, async ({ page }) => {
            await openApp(page, `/landscape/${landscape}/${tab}`)
            await expect(page.locator('#area-header')).toHaveText(landscape === 101 ? 'East Anglia' : 'South Wales')
            await expect(page.locator(`a[href="/landscape/${landscape}/${tab}"]`)).toHaveClass(/active|router-link-active/)
            const canvases = page.locator('main canvas:visible')
            await expect(canvases).toHaveCount(count)
            // Chart.js has drawn something: the canvas has a real size
            const box = await canvases.first().boundingBox()
            expect(box.width).toBeGreaterThan(100)
            expect(box.height).toBeGreaterThan(50)
        })
    }
}

test('landscape heading and available area come from the loaded data', async ({ page }) => {
    await openApp(page, '/landscape/101/production')
    await expect(page.locator('#area-header')).toHaveText('East Anglia')
    await expect(page.getByText(/\d+\/406kha \(thousand hectares\) in lowland/)).toBeVisible()
    await openApp(page, '/landscape/102/production')
    await expect(page.locator('#area-header')).toHaveText('South Wales')
    await expect(page.getByText(/in upland areas/)).toBeVisible()
})

test('history tab starts with the business-as-usual state', async ({ page }) => {
    await openApp(page, '/landscape/101/history')
    await expect(page.locator('.history-card')).toHaveCount(1)
    // Badge labels are drawn from data-badge-caption by CSS, so check the attribute
    await expect(page.locator('.history-card [data-badge-caption="Business-as-usual"]')).toHaveCount(1)
})

test('ethics statement renders', async ({ page }) => {
    await openApp(page, '/ethics')
    await expect(page.getByText('TGRAINS Ethics and Site Usage Statement')).toBeVisible()
})

test('unknown paths show the not-found page with the layout intact', async ({ page }) => {
    await openApp(page, '/no/such/page')
    await expect(page.getByText('Page Not Found')).toBeVisible()
    // Sticky footer: the footer sits at the bottom of the viewport on a short page
    const footer = await page.locator('footer').last().boundingBox()
    expect(footer.y + footer.height).toBeGreaterThanOrEqual(page.viewportSize().height - 2)
})

test('/ redirects to the first landscape', async ({ page }) => {
    await openApp(page, '/')
    await expect(page).toHaveURL(/\/landscape\/101\/production$/)
})
