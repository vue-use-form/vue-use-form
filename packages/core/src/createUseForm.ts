import type { Plugin } from '@vue/runtime-core'
import { formDirective } from './directive/formDirective'

export function createUseForm(): Plugin {
  const install: Plugin['install'] = (app, options = {}) => {
    app.directive('form', formDirective)
  }

  return {
    install,
  }
}
