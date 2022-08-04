import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
  ],
  clean: true,
  declaration: true,
  externals: [
    'vue-use-form',
    'yup',
  ],
  rollup: {
    emitCJS: true,
  },
})
