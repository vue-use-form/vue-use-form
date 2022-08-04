import type { PropsExpression } from '@vue/compiler-core'
import { parse } from '@vue/compiler-sfc'
import type MagicString from 'magic-string'

export function transform(code: MagicString, id: string) {
  const { descriptor } = parse(code.toString(), {
    filename: id,
  })

  const parseResult = {
    remove: [] as (Record<'start' | 'end', number> & { fieldName: string })[],
    append: {
      code: '',
      start: descriptor.scriptSetup?.loc.end.offset || 0,
    },
  }

  descriptor.template?.ast.children.forEach((child) => {
    const props = (child as any).props as PropsExpression[]

    if (props) {
      props.forEach((prop) => {
        const loc = prop.loc
        const source = loc.source

        if (source.includes('v-form')) {
          const fieldName = ((/register\(['|"|`]?([a-zA-Z]+)['|"|`]?,?/.exec(source) || [])[1] || '').trim()
          const replacedCode = `const [${fieldName}Field, ${fieldName}Ref] = ${(prop as any).exp.loc.source}`

          parseResult.remove.push({
            start: loc.start.offset,
            end: loc.end.offset,
            fieldName,
          })

          parseResult.append.code += `\n${replacedCode}`
        }
      })
    }
  })
  code.overwrite(parseResult.append.start - 1, parseResult.append.start, `${parseResult.append.code}\n`)

  parseResult.remove.forEach((item) => {
    code.overwrite(item.start, item.end, `v-model="${item.fieldName}Field" ref="${item.fieldName}Ref"`)
  })
}
