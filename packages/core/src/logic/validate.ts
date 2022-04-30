import type { Field, FieldError } from '../types/errors'
import { isFunction, isObject, isString } from '../utils'

type Rule = Field['rule']

export function validateField(
  field: Field,
): Record<string, FieldError> {
  const {
    required,
    min,
    max,
    maxLength,
    minLength,
    pattern,
    validate,
    valueAsNumber,
    valueAsDate,
    value,
    setValueAs,
    shouldUnregister,
    onChange,
    onBlur,
    disabled,
    defaultValue,
  } = field.rule
}
