import { VALIDATION_MODE } from '../shared/constant'
import type { Mode } from '../types/form'

export function getValidationMode(mode: Mode): {
  isOnSubmit: boolean
  isOnBlur: boolean
  isOnChange: boolean
  isOnAll: boolean
  isOnTouch: boolean
} {
  return {
    isOnSubmit: !mode || mode === VALIDATION_MODE.onSubmit,
    isOnBlur: mode === VALIDATION_MODE.onBlur,
    isOnChange: mode === VALIDATION_MODE.onChange,
    isOnAll: mode === VALIDATION_MODE.all,
    isOnTouch: mode === VALIDATION_MODE.onTouched,
  }
}

