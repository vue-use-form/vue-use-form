import type { RegisterOptions } from './validator'

export type FieldValues = Record<string, any>

export type FieldElement = HTMLInputElement| HTMLSelectElement | HTMLTextAreaElement

export interface Field {
  inputValue: any
  rule: RegisterOptions
  ref: FieldElement
  name: string
  resetVal: any
}
