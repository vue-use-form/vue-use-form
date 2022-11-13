import type { FieldElement } from '../types/filed'

export const isRadioInput = (el?: FieldElement): el is HTMLInputElement =>
  el?.type === 'radio'

export const isCheckBoxInput = (el?: FieldElement): el is HTMLInputElement =>
  el?.type === 'checkbox'

export const isRadioOrCheckboxInput = (
  el?: FieldElement
): el is HTMLInputElement => isRadioInput(el) || isCheckBoxInput(el)
