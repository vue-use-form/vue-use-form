import type { RegisterOptions } from './validator'

export interface FieldError {
  type: keyof RegisterOptions
  // types?: MultipleFieldErrors
  message?: string
}

export type FieldErrors<TFieldValues> = Partial<Record<keyof TFieldValues, FieldError>>
