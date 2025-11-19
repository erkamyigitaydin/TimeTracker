// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {

      'react/react-in-jsx-scope': 'off', 
      'react/no-unescaped-entities': 'off', 
      'react/prop-types': 'off', 
      'no-undef': 'off', 
    },
  },
  {
    ignores: ['dist/*', '.expo/*', 'node_modules/*'],
  },
]);
