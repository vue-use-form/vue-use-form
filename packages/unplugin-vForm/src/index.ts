import MagicString from 'magic-string'
import { createUnplugin } from 'unplugin'
import { transform } from './core/transform'
import type { Options } from './types'

const VForm = createUnplugin<Options>(() => ({
  name: 'unplugin-starter',
  transformInclude(id) {
    return id.endsWith('.vue')
  },
  transform(code, id) {
    const magicString = new MagicString(code)

    transform(magicString, id)

    return magicString.toString()
  },
}))

export default VForm
