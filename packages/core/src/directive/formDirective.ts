import type { FunctionDirective, Ref } from 'vue'
import { isFieldElement } from '../utils/isFieldElement'

// TODO rewrite v-model
export const formDirective: FunctionDirective = (el, binding, vnode) => {
  const formEl = isFieldElement(el) ? el : el.querySelectorAll('input,select,textarea')[0] as HTMLInputElement
  if (!formEl) {
    return
  }
}
