import { unref } from 'vue'
import type { MaybeRef } from '../types/utils'
import type { FieldElement } from '../types/filed'
import { isFieldElement } from './isFieldElement'
import { isHTMLElement, isObject } from './index'

const getValidFormElement = (el: HTMLElement) => el.querySelectorAll('input, textarea, select')[0] as FieldElement

export function getFormEl(elRef: MaybeRef<any> | InputEvent): FieldElement | undefined {
  elRef = unref(elRef)

  if (isFieldElement(elRef)) {
    return elRef
  } else if (isHTMLElement(elRef)) {
    return getValidFormElement(elRef)
  } else if (isObject(elRef)) {
    const keys = Reflect.ownKeys(elRef)
    for (const key of keys) {
      const val = unref(elRef[key])
      if (isFieldElement(val)) {
        return val
      } else if (isHTMLElement(val)) {
        return val.querySelectorAll('input, textarea, select')[0] as FieldElement
      }
    }
  }
}
