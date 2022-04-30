import type { RegisterOptions, ValidationValueMessage } from '../types/validator'

import { isString } from './index'

export function transformMessage(field: RegisterOptions[keyof RegisterOptions]): ValidationValueMessage {
  if (isString(field))
    return { value: field, message: '' }

  return field
}
