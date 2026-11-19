// Comments: listing, posting (with the session reference the WAF must allow), and escaping
import { test, expect, openApp, waitForIdle } from './support'

async function openForm(page) {
    await page.locator('a.btn, button').filter({ hasText: /add comment/i }).first().click()
    await expect(page.locator('#comment-body')).toBeVisible()
}

test('lists comments from the server', async ({ page }) => {
    await openApp(page)
    const card = page.locator('.comment-card').first()
    await expect(card.locator('.username')).toHaveText('Test Author')
    await expect(card.locator('.comment-text')).toContainText('Comment posted by the Vue 3 migration check')
})

test('posting a comment sends the author, text and current session, and shows it', async ({ page, api }) => {
    await openApp(page)
    await openForm(page)
    await page.fill('#name', 'E2E Tester')
    await page.fill('#email', 'e2e@example.org')
    await page.fill('#comment-body', 'Looks good <script>alert(1)</script>')
    await page.locator('#add-comment button').filter({ hasText: 'Post' }).click()
    await waitForIdle(page)

    const post = api.requests.find(r => r.method === 'POST' && r.path === '/api/comment')
    expect(post.body).toMatchObject({
        author: 'E2E Tester', email: 'e2e@example.org', text: 'Looks good <script>alert(1)</script>', landscape_id: 101,
    })
    expect(typeof post.body.session_id).toBe('string')
    expect(post.body.session_id.length).toBeGreaterThan(0)

    // Shown as text, not markup (the errors fixture would also catch an executed alert's side effects)
    const card = page.locator('.comment-card').filter({ hasText: 'E2E Tester' })
    await expect(card.locator('.comment-text')).toHaveText('Looks good <script>alert(1)</script>')
    await expect(card.locator('.comment-text script')).toHaveCount(0)
})

test('the form validates required fields before posting', async ({ page, api }) => {
    await openApp(page)
    await openForm(page)
    await page.fill('#comment-body', 'No name or email')
    await expect(page.locator('#add-comment button').filter({ hasText: 'Post' })).toBeDisabled()
    expect(api.requests.some(r => r.method === 'POST' && r.path === '/api/comment')).toBe(false)
})

test('toggling the local-area filter reloads comments', async ({ page, api }) => {
    await openApp(page)
    await page.locator('a.btn, button').filter({ hasText: /sort\/filter/i }).first().click()
    await expect(page.getByText('Filtering Options')).toBeVisible()

    const before = api.requests.filter(r => r.path === '/api/comment').length
    await page.getByText('Include only comments from local area').click()   // Materialize hides the real checkbox
    await expect.poll(() => api.requests.filter(r => r.path === '/api/comment').length).toBeGreaterThan(before)
})
