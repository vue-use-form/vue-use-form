import type { RegisterOptions } from '../types/validator'

import { isBoolean, isDateObject, isNumber, isString, isUndefined } from './index'

export function getValueAndMessage(field: RegisterOptions[keyof RegisterOptions]) {
  if (isUndefined(field))
    return { value: undefined, message: '' }

  if (isString(field))
    return { value: true, message: field }

  if (isBoolean(field))
    return { value: field, message: '' }

  if (isNumber(field))
    return { value: field, message: '' }

  if (isDateObject(field)) {
    return { value: field, message: '' }
  }
  return field
}
