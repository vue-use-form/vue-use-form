import type { Ref } from 'vue'
import type { RegisterOptions } from './validator'
import type { FieldError } from './errors'

export type FieldValues = Record<string, any>

export type FieldElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement

export interface Field {
  inputValue: Ref
  el: Ref<FieldElement>
  rule: RegisterOptions
  isDirty: boolean
  isUnregistered: boolean
}

export interface FieldState {
  isDirty: boolean
  isTouched: boolean
  invalid: boolean
  error?: FieldError
}

export type Fields<
  FieldValues extends object,
  FieldKeys extends keyof FieldValues
> = Record<FieldKeys, Field>
