module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'no-unused-vars': 'off',
      },
    },
  ],
};
