import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import dts from 'rollup-plugin-dts'
import babel from '@rollup/plugin-babel'

const corePath = './packages/core/src'

const outputPath = './packages/core/dist'

export default [
  {
    input: `${corePath}/index.ts`,
    plugins: [typescript(), resolve(), babel({ babelHelpers: 'bundled' })],
    external: ['vue'],
    globals: {
      vue: 'vue',
    },
    output: [
      {
        file: `${outputPath}/index.cjs`,
        plugins: [commonjs()],
        format: 'cjs',
      },
      {
        file: `${outputPath}/index.esm.js`,
        format: 'esm',
      },
    ],
  },
  {
    input: `${corePath}/index.ts`,
    plugins: [dts()],
    external: ['vue'],
    globals: {
      vue: 'vue',
    },
    output: {
      file: `${outputPath}/index.d.ts`,
      format: 'esm',
    },
  },
]
