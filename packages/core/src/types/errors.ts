import type { RegisterOptions } from './validator'
import type { FieldElement } from './filed'

export type FieldError = Partial<{
  type: keyof RegisterOptions | string
  // types?: MultipleFieldErrors
  message?: string
  ref?: FieldElement
}>

export type FieldErrors<TFieldValues> = Partial<Record<keyof TFieldValues, FieldError>>
