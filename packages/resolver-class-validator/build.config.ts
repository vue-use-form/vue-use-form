import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
  ],
  clean: true,
  declaration: true,
  externals: [
    'vue-use-form',
    'class-validator',
    'class-transformer',
  ],
  rollup: {
    emitCJS: true,
  },
})
