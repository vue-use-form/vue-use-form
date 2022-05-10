import type { RegisterOptions } from './validator'
import type { FieldError } from './errors'

export type FieldValues = Record<string, any>

export type FieldElement = HTMLInputElement| HTMLSelectElement | HTMLTextAreaElement

export interface Field {
  inputValue: any
  rule: RegisterOptions
  ref: FieldElement
  name: string
  resetVal: any
}

export interface FieldState {
  isDirty: boolean
  isTouched: boolean
  invalid: boolean
  error?: FieldError
}
