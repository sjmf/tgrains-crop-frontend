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
    }
})
