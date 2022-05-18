import type { Ref } from 'vue'
import type { RegisterOptions } from './validator'
import type { FieldError } from './errors'

export type FieldValues = Record<string, any>

export type FieldElement = HTMLInputElement| HTMLSelectElement | HTMLTextAreaElement

export interface Field {
  inputValue: Ref
  rule: RegisterOptions
  name: string
  resetVal: any
  resetCount: number
}

export interface FieldState {
  isDirty: boolean
  isTouched: boolean
  invalid: boolean
  error?: FieldError
}
