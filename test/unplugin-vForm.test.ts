import type { PropsExpression } from '@vue/compiler-core'
import MagicString from 'magic-string'
import { expect, test } from 'vitest'
import vForm from '@vue-use-form/v-form/src/index'
import { parse } from '@vue/compiler-sfc'

const code = `
<script lang="ts" setup>
import { useForm } from 'vue-use-form'
import * as yup from 'yup'
import { useYupResolver } from '@vue-use-form/yup'

const schema = yup.object().shape({
  name: yup.string().required(),
  age: yup.number().required().positive().integer(),
  email: yup.string().email(),
  website: yup.string().url(),
  createdOn: yup.date().default(() => {
    return new Date()
  }),
})

const resolver = useYupResolver(schema)

const {
    register,
    formState: { errors },
} = useForm({
      resolver,
      mode: 'onChange',
 })
</script>

<template>
  {{ errors }}
  <input v-form="register('age', {
    required: true
  })" disabled>
  <input v-form="register('email', {
    required: true
  })" disabled>
</template>
`

test('v-form', () => {
  const transform = vForm.vite().transform

  const magicCode = new MagicString(code)

  const sfc = parse(code.toString()).descriptor

  const parseResult = sfc.template.ast.children.map((child) => {
    const props = (child as any).props as PropsExpression[]
    if (props) {
      return props.map((prop) => {
        const loc = prop.loc
        const source = loc.source

        if (source.includes('v-form')) {
          const fieldName = (/register\(['|"|`](.*)['|"|`],/.exec(source)[1] || '').trim()
          const replacedCode = `\nconst ${fieldName} = ${(prop as any).exp.loc.source}\n`

          return {
            remove: { start: loc.start.offset, end: loc.end.offset },
            append: { start: sfc.scriptSetup.loc.end.offset, code: replacedCode },
          }
        }

        return null
      }).filter(item => item)
    }

    return null
  }).filter(item => item)

  expect(parseResult).toMatchInlineSnapshot(`
    [
      [
        {
          "append": {
            "code": "
    const age = register('age', {
        required: true
      })
    ",
            "start": 548,
          },
          "remove": {
            "end": 644,
            "start": 594,
          },
        },
      ],
      [
        {
          "append": {
            "code": "
    const email = register('email', {
        required: true
      })
    ",
            "start": 548,
          },
          "remove": {
            "end": 716,
            "start": 664,
          },
        },
      ],
    ]
  `)
})
