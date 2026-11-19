// eslint.config.js

import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
    js.configs.recommended,
    ...pluginVue.configs['flat/essential'],
    {
        languageOptions: {
            globals: { ...globals.browser }
        },
        rules: {
            'vue/multi-word-component-names': 'off'
        }
    },
    {
        // Playwright specs, fixtures and the fixture recorder run in Node
        files: ['tests/e2e/**/*.{js,mjs}'],
        languageOptions: {
            globals: { ...globals.node }
        }
    }
]
