// eslint.config.js
import js from '@eslint/js'
import ts from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // تجاهل مجلدات البناء والتوزيع
  globalIgnores(['dist', 'build', 'node_modules']),

  {
    files: ['**/*.{ts,tsx}'],
    parserOptions: {
      project: ['./tsconfig.json'], // ضع هنا tsconfig المناسب لكل حزمة
      tsconfigRootDir: __dirname,   // يحل مشكلة multiple TSConfigRootDirs
    },
    extends: [
      js.configs.recommended,
      ts.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    rules: {
      // تجاهل مشاكل Fast Refresh عند تصدير غير Components
      'react-refresh/only-export-components': 'off',

      // قواعد TypeScript زائدة عن الحاجة
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // قواعد React Hooks اختيارية
      'react-hooks/exhaustive-deps': 'warn',
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])