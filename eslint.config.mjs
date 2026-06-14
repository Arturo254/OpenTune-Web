import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    rules: {
      // Allow console.warn() and console.error()
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],

      // Prevent == and !=
      eqeqeq: ['error', 'always'],

      // Always require braces
      curly: ['error', 'all'],

      // Catch unused variables
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^\\$',
          varsIgnorePattern: '^\\$',
          caughtErrorsIgnorePattern: '^\\$',
        },
      ],

      // Discourage unnecessary state updates inside useEffect
      'react-hooks/set-state-in-effect': 'warn',

      // Prefer const when variable isn't reassigned
      'prefer-const': 'error',
    },
  },

  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', '.local/**']),
]);
