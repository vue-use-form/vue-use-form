import type { RegisterOptions } from '../types/validator'

import { isBoolean, isString, isUndefined } from './index'

export function getValueAndMessage(field: RegisterOptions[keyof RegisterOptions]) {
  if (isUndefined(field))
    return { value: undefined, message: '' }

  if (isString(field))
    return { value: true, message: field }

  if (isBoolean(field))
    return { value: field, message: '' }

  return field
}
