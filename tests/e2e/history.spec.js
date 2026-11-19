// History: model runs are recorded, posted to the server, and can be reloaded
import { test, expect, openApp, waitForIdle } from './support'

async function submitChange(page, label, delta) {
    const input = page.locator('li.variable-row').filter({ hasText: label }).locator('input[type=number]')
    await input.fill(String(Number(await input.inputValue()) + delta))
    await input.dispatchEvent('change')
    await page.getByRole('button', { name: 'Submit' }).click()
    await waitForIdle(page)
}

test('a model run adds a history entry tagged with what changed, and posts it', async ({ page, api }) => {
    await openApp(page)
    await submitChange(page, 'Oilseed Rape', 5000)
    await page.click('a[href="/landscape/101/history"]')

    await expect(page.locator('.history-card')).toHaveCount(2)
    await expect(page.getByText('There are currently 2 states in history.')).toBeVisible()
    // Newest first; auto-tagged with the changed crop (badge text comes from data-badge-caption)
    await expect(page.locator('.history-card').first().locator('[data-badge-caption]').first())
        .toHaveAttribute('data-badge-caption', /oilseed/i)

    const posts = api.requests.filter(r => r.method === 'POST' && r.path === '/api/state')
    expect(posts).toHaveLength(2)   // BAU on load, then the run
    expect(posts[1].body).toMatchObject({ index: 1 })
    expect(typeof posts[1].body.session_id).toBe('string')
    expect(typeof posts[1].body.user_id).toBe('string')
})

test('loading an earlier state restores its inputs', async ({ page }) => {
    await openApp(page)
    const input = page.locator('li.variable-row').filter({ hasText: 'Oilseed Rape' }).locator('input[type=number]')
    const bau = await input.inputValue()
    await submitChange(page, 'Oilseed Rape', 5000)
    await expect(input).not.toHaveValue(bau)

    await page.click('a[href="/landscape/101/history"]')
    await page.locator('.history-card').last().getByText('Load').click()
    await waitForIdle(page)
    await expect(input).toHaveValue(bau)
})

test('deleting a state moves it to the trash, and it can be restored', async ({ page }) => {
    await openApp(page)
    await submitChange(page, 'Oilseed Rape', 5000)
    await page.click('a[href="/landscape/101/history"]')

    // The older (inactive) state has the delete button
    await page.locator('.history-card').last().locator('a.red').click()
    await expect(page.locator('.history-card:visible')).toHaveCount(1)

    await page.locator('a.btn').filter({ hasText: 'Deleted States' }).click()
    const trash = page.locator('#modal-trash')
    await expect(trash).toBeVisible()
    await trash.getByText('Restore').click()
    await page.keyboard.press('Escape')
    await expect(page.locator('.history-card:visible')).toHaveCount(2)
})
