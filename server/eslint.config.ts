import eslintRecommended from '@eslint/js';
import tseslint from 'typescript-eslint';
import boundaries from 'eslint-plugin-boundaries';
import importPlugin from 'eslint-plugin-import';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  // STOP ESLINT FROM ENTERING THESE FOLDERS
  globalIgnores([
    '**/node_modules/',
    '**/dist/',
    '**/coverage/',
    '**/logs/',
    '**/prisma/generated/',
    '**/src/generated/',
  ]),

  // Extended recommended configs
  eslintRecommended.configs.recommended,
  tseslint.configs.recommended,

  {
    files: ['src/**/*.{ts,tsx,js,mjs,cjs}'],

    plugins: {
      boundaries,
      import: importPlugin,
    },

    settings: {
      // Use only TypeScript resolver for proper .ts mapping
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },

      // Boundaries plugin settings
      'boundaries/resolveOptions': {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      },
      'boundaries/elements': [
        { type: 'controllers', pattern: 'src/controllers/**/*', mode: 'full' },
        { type: 'config', pattern: 'src/config/**/*', mode: 'full' },
        { type: 'middleware', pattern: 'src/middleware/**/*', mode: 'full' },
        {
          type: 'repositories',
          pattern: 'src/repositories/**/*',
          mode: 'full',
        },
        { type: 'routes', pattern: 'src/routes/**/*', mode: 'full' },
        { type: 'schemas', pattern: 'src/schemas/**/*', mode: 'full' },
        { type: 'services', pattern: 'src/services/**/*', mode: 'full' },
        { type: 'utils', pattern: 'src/utils/**/*', mode: 'full' },
      ],
    },

    rules: {
      // TypeScript unused vars
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],

      // Prevent relative imports outside module
      'no-restricted-imports': ['error', { patterns: ['../**'] }],

      // Boundaries / layered architecture enforcement
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: 'routes',
              allow: [
                'routes',
                'controllers',
                'middleware',
                'utils',
                'schemas',
              ],
            },
            {
              from: 'controllers',
              allow: ['controllers', 'services', 'utils', 'schemas'],
            },
            {
              from: 'middleware',
              allow: ['middleware', 'services', 'utils', 'config'],
            },
            {
              from: 'services',
              allow: ['services', 'repositories', 'utils', 'config', 'schemas'],
            },
            {
              from: 'repositories',
              allow: ['repositories', 'utils', 'config'],
            },
            { from: 'schemas', allow: ['schemas', 'utils'] },
            { from: 'config', allow: ['utils'] },
          ],
        },
      ],

      // Disable import ordering if not needed
      'import/order': 'off',
    },
  },
]);
