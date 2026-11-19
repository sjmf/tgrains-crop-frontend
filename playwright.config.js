// playwright.config.js — end-to-end tests against the production build, with the API mocked
// from tests/e2e/fixtures (see TESTING.md). No backend is needed.

import { defineConfig, devices } from '@playwright/test'

const port = 4173

export default defineConfig({
    testDir: 'tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
    use: {
        baseURL: `http://localhost:${port}`,
        viewport: { width: 1400, height: 900 },
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1400, height: 900 } } },
    ],
    webServer: {
        command: `npm run build && npx vite preview --port ${port} --strictPort`,
        url: `http://localhost:${port}`,
        env: { VUE_APP_GIT_HASH: 'e2e' },
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
})
