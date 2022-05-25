import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import dts from 'rollup-plugin-dts'
import babel from '@rollup/plugin-babel'

const buildCore = () => {
  const corePath = './packages/core/src'

  const outputPath = './packages/core/dist'

  return [
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
}

const buildClassValidatorResolver = () => {
  const path = './packages/resolver-class-validator'
  const outpath = `${path}/dist`

  return [
    {
      input: `${path}/src/index.ts`,
      plugins: [typescript(), resolve(), babel({ babelHelpers: 'bundled' })],
      external: ['class-validator', 'class-transformer'],
      globals: {
        'class-validator': 'classValidator',
        'class-transformer': 'classTransformer',
      },
      output: [
        {
          file: `${outpath}/index.cjs`,
          plugins: [commonjs()],
          format: 'cjs',
        },
        {
          file: `${outpath}/index.esm.js`,
          format: 'esm',
        },
      ],
    },
    {
      input: `${path}/src/index.ts`,
      plugins: [dts()],
      output: {
        file: `${outpath}/index.d.ts`,
        format: 'esm',
      },
    },
  ]
}

export default [
  ...buildCore(),
  ...buildClassValidatorResolver(),
]
