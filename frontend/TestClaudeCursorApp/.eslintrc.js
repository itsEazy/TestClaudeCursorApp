module.exports = {
  root: true,
  extends: '@react-native',
  env: {
    jest: true,
  },
  overrides: [
    {
      files: ['**/__tests__/**/*', '**/*.test.*', '**/jest-setup.js'],
      env: {
        jest: true,
      },
      globals: {
        jest: 'readonly',
      },
    },
  ],
};
