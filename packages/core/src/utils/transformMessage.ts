import type { RegisterOptions } from '../types/validator'

import { isBoolean, isString } from './index'

export function transformMessage(field: RegisterOptions[keyof RegisterOptions]) {
  if (isString(field) || isBoolean(field))
    return { value: field, message: '' }

  return field
}
