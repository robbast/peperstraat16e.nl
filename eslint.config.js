import js from '@eslint/js'
import globals from 'globals'

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: globals.browser,
    },
  },
  {
    // Config files run in Node, not the browser
    files: ['*.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
]
