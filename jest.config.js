module.exports = {
  globals: {
    __BROWSER__: true,
    __USE_PREFIX_IDENTIFIERS__: true,
    'ts-jest': {
      babelConfig: true,
    },
  },
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\js$': 'babel-jest',
  },
  moduleFileExtensions: ['vue', 'js', 'json', 'jsx', 'ts', 'tsx', 'node'],
}
