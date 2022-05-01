import type { FieldError } from '../types/errors'
import { isCheckBoxInput, isEmpty, isRadioInput, isString } from '../utils'
import type { Field } from '../types/filed'
import { transformMessage } from '../utils/transformMessage'

export function validateField(
  field: Field,
  validateAllFieldCriteria = false,
): Partial<FieldError> {
  const { inputValue, name } = field
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

  const el = field.ref
  const isRadio = isRadioInput(el)
  const isCheckBox = isCheckBoxInput(el)
  const isRadioOrCheckBox = isRadio || isCheckBox

  let error: FieldError = {}

  if (required && !isRadioOrCheckBox) {
    const { value, message } = transformMessage(required)

    if (isEmpty(inputValue) && value) {
      error = {
        type: 'required',
        message,
        ref: el,
      }

      if (!validateAllFieldCriteria)
        return error
    }
  }

  return error
}

