import type { FieldValues } from '../types/filed'
import type { SubmitErrorHandler, SubmitHandler } from '../types/form'

export function createSubmitHandler<T extends FieldValues = FieldValues>(fn: SubmitHandler<T>) {
  return fn
}

export function createErrorHandler<T extends FieldValues = FieldValues>(fn: SubmitErrorHandler<T>) {
  return fn
}
