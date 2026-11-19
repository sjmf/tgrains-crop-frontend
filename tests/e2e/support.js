// Shared fixtures for the e2e tests: a mocked API built from recorded fixtures, and a guard
// that fails any test which logs a console error or throws an uncaught page error.

import { test as base, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'

const fixture = (name) => JSON.parse(readFileSync(new URL(`./fixtures/${name}.json`, import.meta.url)))

/**
 * Install the mocked API on a page. It mimics the real flow: strings and model runs reply 303 to
 * /api/status/<id>, which reports PENDING once before SUCCESS; BAU comes straight from the cache.
 * Returns an object recording every API request, for assertions.
 */
export async function mockApi(page) {
    const api = { requests: [], comments: structuredClone(fixture('comments-101').comments) }
    const tasks = {}       // task id -> { polls, body }
    let nextTask = 0

    const json = (route, body, status = 200, headers = {}) =>
        route.fulfill({ status, headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) })
    const deferred = (route, body) => {
        const id = `task-${nextTask++}`
        tasks[id] = { polls: 0, body }
        return json(route, { task_id: id }, 303, { Location: `/api/status/${id}` })
    }
    const commentList = (url) => ({
        comments: api.comments, filter: 0, length: api.comments.length,
        page: Number(url.searchParams.get('page') || 1), size: Number(url.searchParams.get('size') || 4), sort: 0,
    })

    await page.route('**/api/**', async (route) => {
        const req = route.request()
        const url = new URL(req.url())
        const path = url.pathname
        const landscape = Number(url.searchParams.get('landscape_id')) || 101
        let body
        try { body = req.postDataJSON() } catch { body = req.postData() }
        api.requests.push({ method: req.method(), path, query: Object.fromEntries(url.searchParams), body })

        if (req.method() === 'GET' && path === '/api/strings') return deferred(route, fixture(`strings-${landscape}`))
        if (req.method() === 'GET' && path === '/api/model') return json(route, fixture(`bau-${landscape}`))
        if (req.method() === 'POST' && path === '/api/model') return deferred(route, fixture(`model-${body.landscape_id}`))
        if (req.method() === 'GET' && path.startsWith('/api/status/')) {
            const task = tasks[path.split('/').pop()]
            if (!task) return json(route, { state: 'FAILURE', status: 'unknown task' })
            return json(route, task.polls++ === 0 ? { state: 'PENDING', status: '' } : task.body)
        }
        if (req.method() === 'GET' && path === '/api/tags') return json(route, fixture('tags'))
        if (req.method() === 'GET' && path === '/api/comment') return json(route, commentList(url))
        if (req.method() === 'POST' && path === '/api/comment') {
            api.comments.unshift({
                id: 1000 + api.comments.length, author: body.author, text: body.text, user_id: body.user_id,
                hash: '00112233445566778899aabbccddeeff', landscape_id: body.landscape_id, reply: null,
                reply_id: body.reply_id ?? null, session: null, session_id: body.session_id,
                state_index: body.index, tags: body.tags, distance: body.distance,
                timestamp: Math.floor(Date.now() / 1000),
            })
            return json(route, commentList(url))
        }
        if (req.method() === 'POST' && (path === '/api/state' || path === '/api/fork'))
            return route.fulfill({ status: 200, contentType: 'text/plain', body: 'OK' })

        api.unexpected = `${req.method()} ${path}`
        return route.fulfill({ status: 404, body: 'Not mocked' })
    })
    return api
}

export const test = base.extend({
    // Collect console errors and page errors; the test fails if there are any
    errors: [async ({ page }, use) => {
        const errors = []
        page.on('console', m => { if (m.type() === 'error') errors.push(`console: ${m.text().split('\n')[0]}`) })
        page.on('pageerror', e => errors.push(`pageerror: ${e.message}`))
        await use(errors)
        expect(errors, 'console or page errors').toEqual([])
    }, { auto: true }],

    api: [async ({ page }, use) => {
        const api = await mockApi(page)
        await use(api)
        expect(api.unexpected, 'request to an unmocked API route').toBeUndefined()
    }, { auto: true }],
})

/** Wait for the loading overlay (shown after a 200 ms delay) to appear, if it does, and clear. */
export async function waitForIdle(page) {
    await page.waitForSelector('.loading', { timeout: 1000 }).catch(() => {})
    await expect(page.locator('.loading')).toHaveCount(0, { timeout: 15_000 })
}

/** Open a page as a new visitor: accept the welcome terms and wait for data to load. */
export async function openApp(page, path = '/landscape/101/production') {
    await page.goto(path)
    const accept = page.locator('#modal-welcome .modal-close')
    await accept.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {})
    if (await accept.isVisible()) await accept.click()
    await waitForIdle(page)
}

/** The "Available area" text, e.g. "370/406kha (thousand hectares) in lowland". */
export const areaText = (page) => page.getByText(/kha \(thousand hectares\) in lowland/).first()

export { expect }
