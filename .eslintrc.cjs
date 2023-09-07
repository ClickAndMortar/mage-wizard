module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
  extends: [
    'plugin:sonarjs/recommended',
    'plugin:unicorn/recommended',
    '@nuxtjs/eslint-config-typescript',
    'plugin:prettier/recommended',
  ],
  rules: {
    'no-console': [process.env.NODE_ENV === 'production' ? 'error' : 'warn', {allow: ['error', 'warn']}],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'comma-dangle': ['error', 'always-multiline'],
    'object-shorthand': ['error', 'always'],
    // VUE
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'off',
    'vue/valid-v-slot': ['error', {
      allowModifiers: true,
    }],
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        registeredComponentsOnly: false,
        ignores: ['i18n-t'],
      },
    ],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'never',
          component: 'always',
        },
      },
    ],
    // TYPESCRIPT
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'all',
        argsIgnorePattern: '^_',
        vars: 'all',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    // UNICORN
    'unicorn/prefer-module': 'off',
    'unicorn/no-null': 'off',
    'unicorn/filename-case': [
      'error',
      {
        case: 'kebabCase',
        ignore: ['\\.vue$'],
      },
    ],
    'unicorn/prevent-abbreviations': [
      'error',
      {
        allowList: {
          props: true,
          attrs: true,
        },
      },
    ],
    // PRETTIER
    'prettier/prettier': ['error', {}, {usePrettierrc: true}],
    // SONAR
    'sonarjs/no-duplicate-string': 'off',
    'sonarjs/cognitive-complexity': 'off',
  }
}
