import type { RegisterOptions, ValidateResult } from '../types/validator'
import type { FieldError } from '../types/errors'
import { isBoolean, isString } from './index'

export function getValidatorError(
  result: ValidateResult,
  type = 'validate'
): FieldError | undefined {
  if (isBoolean(result) && !result) {
    return {
      type: type as keyof RegisterOptions,
      message: isString(result) ? result : '',
    }
  } else if (isString(result)) {
    return {
      type: type as keyof RegisterOptions,
      message: result,
    }
  }
}
