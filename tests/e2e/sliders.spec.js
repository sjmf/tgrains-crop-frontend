// Area sliders: live updates while dragging, and submitting a model run
import { test, expect, openApp, waitForIdle, areaText } from './support'

const row = (page, label) => page.locator('li.variable-row').filter({ hasText: label })

/** Press the mouse on a slider's left edge and move it to `fraction` of its width, without releasing */
async function dragTo(page, slider, fraction) {
    const box = await slider.boundingBox()
    const y = box.y + box.height / 2
    await page.mouse.move(box.x + 3, y)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width * fraction, y, { steps: 10 })
}

test('dragging a slider updates the area total and the number input before release', async ({ page }) => {
    // Regression: after the Vue 3 migration these only updated when the mouse was released
    await openApp(page)
    const oilseed = row(page, 'Oilseed Rape')
    const before = await areaText(page).innerText()
    const valueBefore = await oilseed.locator('input[type=number]').inputValue()

    await dragTo(page, oilseed.locator('input[type=range]'), 0.7)

    // Still holding the mouse button
    await expect(areaText(page)).not.toHaveText(before)
    await expect(oilseed.locator('input[type=number]')).not.toHaveValue(valueBefore)
    await expect(oilseed.locator('input[type=range]')).toHaveAttribute('style', /103, 58, 183|#673ab7/) // changed: purple

    await page.mouse.up()
})

test('dragging a group total scales its crops live', async ({ page }) => {
    await openApp(page)
    const before = await areaText(page).innerText()
    await dragTo(page, row(page, 'Cereals').locator('input[type=range]').first(), 0.3)
    await expect(areaText(page)).not.toHaveText(before)
    await page.mouse.up()
})

test('typing an area and submitting runs the model with that value', async ({ page, api }) => {
    await openApp(page)
    const input = row(page, 'Oilseed Rape').locator('input[type=number]')
    const original = Number(await input.inputValue())
    await input.fill(String(original + 5000))
    await input.dispatchEvent('change')
    await page.getByRole('button', { name: 'Submit' }).click()
    await waitForIdle(page)

    const run = api.requests.find(r => r.method === 'POST' && r.path === '/api/model')
    expect(run.body.landscape_id).toBe(101)
    expect(run.body.osr_winter).toBe(original + 5000)

    // The model result replaces BAU: the production table now shows changes
    const changes = page.locator('table').first().locator('tbody tr td:nth-child(3)')
    await expect(changes.first()).not.toHaveText(/^\s*0\s*$/)
    await expect(page.locator('table').first()).toContainText(/[+-] [\d.]+ (thousand|million)/)
})

test('an area over the landscape maximum blocks submit with an error', async ({ page }) => {
    await openApp(page)
    const input = row(page, 'Oilseed Rape').locator('input[type=number]')
    await input.fill('900000')
    await input.dispatchEvent('change')
    await expect(page.getByText('Area exceeded!')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled()
})

test('reset returns to business-as-usual values', async ({ page }) => {
    await openApp(page)
    const input = row(page, 'Oilseed Rape').locator('input[type=number]')
    const original = await input.inputValue()
    await input.fill('1000')
    await input.dispatchEvent('change')
    await page.getByRole('button', { name: 'Reset' }).click()
    await waitForIdle(page)
    await expect(input).toHaveValue(original)
})
