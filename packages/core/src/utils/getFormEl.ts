import type { MaybeRef } from '../types/utils'
import type { FieldElement } from '../types/filed'
import { isFieldElement } from './isFieldElement'
import { isHTMLElement } from './index'

export function getFormEl(ref: MaybeRef<any>): FieldElement | undefined {
  if (isFieldElement(ref)) {
    return ref
  }
  if (isHTMLElement(ref)) {
    return ref.querySelectorAll('input, textarea, select')[0] as FieldElement
  }

  // element-plus
  if (ref && isFieldElement(ref.ref)) {
    return ref.ref
  }
}
