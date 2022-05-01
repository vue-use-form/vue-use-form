import type { RegisterOptions, ValidateResult } from '../types/validator'
import type { FieldElement } from '../types/filed'
import type { FieldError } from '../types/errors'
import { isBoolean, isString } from './index'

export function getValidatorError(
  result: ValidateResult,
  ref: FieldElement,
  type = 'validate',
): FieldError | undefined {
  if (
    (isBoolean(result) && !result)
  ) {
    return {
      type: type as keyof RegisterOptions,
      message: isString(result) ? result : '',
      ref,
    }
  }
}
