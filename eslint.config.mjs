import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['src/public/js/**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ['src/public/vender/**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        jQuery: 'readonly',
        window: 'readonly',
        document: 'readonly',
        Image: 'readonly',
        self: 'readonly',
        define: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off', // Tắt cảnh báo biến không sử dụng
      'no-cond-assign': 'off',
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
  },
  pluginJs.configs.recommended,
  {
    rules: {
      'no-unused-vars': ['warn', { vars: 'all', args: 'none' }],
    },
  },
];
