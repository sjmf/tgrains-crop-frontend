// vite.config.js

import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],

    // Keep the VUE_APP_ prefix so VUE_APP_GIT_HASH (Dockerfile, CI) reaches import.meta.env
    envPrefix: ['VITE_', 'VUE_APP_'],

    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },

    server: {
        port: 8080,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8000'
            }
        }
    },

    // Unit and component tests (Vitest). The Playwright e2e tests live in tests/e2e.
    test: {
        environment: 'jsdom',
        include: ['tests/unit/**/*.spec.js'],
        env: { VUE_APP_GIT_HASH: 'testing' },
        coverage: {
            provider: 'v8',
            include: ['src/**/*.{js,vue}'],
            reporter: ['text-summary', 'html']
        }
    }
})
