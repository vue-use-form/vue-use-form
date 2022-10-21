import { ref, unref } from 'vue'
import type { FieldError } from '../types/errors'
import {
  isEmpty, isEmptyObject,
  isFunction,
  isNullOrUndefined,
  isObject,
  isRegex,
  isString,
  set,
} from '../utils'
import type { Field, FieldElement } from '../types/filed'
import { isCheckBoxInput, isRadioInput } from '../utils/fieldElement'
import { getValueAndMessage } from '../utils/transformMessage'
import { getValidatorError } from '../utils/getValidatorError'

import { isFieldElement } from '../utils/isFieldElement'
import { InvalidDate } from '../utils/constant'

export function handleValidateError(error: FieldError, shouldFocusOnError: boolean, el?: FieldElement) {
  if (!isFieldElement(el)) {
    return
  }
  if (!isEmptyObject(error) && shouldFocusOnError) {
    el.focus()
  }
}

export async function validateField(
  field: Field,
  shouldFocusOnError: boolean,
  validateAllFieldCriteria: boolean,
): Promise<FieldError> {
  const inputValue = unref(field.inputValue)

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
    setValueAs,
    disabled = false,
  } = field.rule

  const el = unref(field.el)

  const isRadio = isRadioInput(el)
  const isCheckbox = isCheckBoxInput(el)
  const isRadioOrCheckBox = isRadio || isCheckbox

  const unrefInputVal = unref(inputValue)
  const isEmptyValue = isEmpty(unrefInputVal)

  let error: FieldError = {}

  try {
    if (isFieldElement(el)) {
      if (valueAsNumber) {
        const elVal = (el as HTMLInputElement).value
        set(field, 'inputValue', ref((el as HTMLInputElement).valueAsNumber || elVal === '' ? elVal : parseFloat(elVal)))
      } else if (valueAsDate) {
        set(field, 'inputValue', ref((el as HTMLInputElement).valueAsDate || InvalidDate))
      } else if (setValueAs) {
        set(field, 'inputValue', ref(setValueAs(unrefInputVal)))
      }
    }

    if (required && !isRadioOrCheckBox) {
      const { value, message } = getValueAndMessage(required)

      if (isEmptyValue && value) {
        error = {
          type: 'required',
          message,
        }

        if (!validateAllFieldCriteria)
          return error
      }
    }

    if (!isEmptyValue && (!isNullOrUndefined(max) || !isNullOrUndefined(min))) {
      let exceedMax
      let exceedMin
      const { value: maxValue, message: maxMsg } = getValueAndMessage(max)
      const { value: minValue, message: minMsg } = getValueAndMessage(min)

      if (!isNaN(unrefInputVal)) {
        if (minValue && unrefInputVal < minValue)
          exceedMin = true
        if (maxValue && unrefInputVal > maxValue)
          exceedMax = true
      }
      else {
        if (minValue && unrefInputVal < minValue)
          exceedMin = true
        if (maxValue && unrefInputVal > maxValue)
          exceedMax = true
      }

      if (exceedMax || exceedMin) {
        error = {
          type: exceedMax ? 'max' : 'min',
          message: exceedMax ? maxMsg : minMsg,
        }

        if (!validateAllFieldCriteria)
          return error
      }
    }

    if ((maxLength || minLength) && !isEmptyValue && isString(inputValue)) {
      let exceedMax
      let exceedMin
      const { value: maxValue, message: maxMsg } = getValueAndMessage(maxLength)
      const { value: minValue, message: minMsg } = getValueAndMessage(minLength)

      if (minValue && inputValue.length <= minValue)
        exceedMin = true

      if (maxValue && inputValue.length >= maxValue)
        exceedMax = true

      if (exceedMax || exceedMin) {
        error = {
          type: exceedMax ? 'maxLength' : 'minLength',
          message: exceedMax ? maxMsg : minMsg,
        }

        return error
      }
    }

    if (pattern && !isEmptyValue && isString(inputValue)) {
      const { value: patternValue, message } = getValueAndMessage(pattern)

      if (isRegex(patternValue) && !inputValue.match(patternValue)) {
        error = {
          type: 'pattern',
          message,
        }

        if (!validateAllFieldCriteria)
          return error
      }
    }

    if (disabled && isFieldElement(el)) {
      el.setAttribute('disabled', '')
    } else if (!disabled && isFieldElement(el)) {
      el.removeAttribute('disabled')
    }

    if (validate) {
      if (isFunction(validate)) {
        const result = await validate(unrefInputVal)

        const validateResult = getValidatorError(result)

        if (validateResult)
          error = validateResult

        if (!validateAllFieldCriteria)
          return error
      } else if (isObject(validate)) {
        for (const key in validate) {
          const result = await validate[key](unrefInputVal)

          const validateResult = getValidatorError(result, key)

          if (validateResult)
            error = validateResult

          if (!validateAllFieldCriteria)
            return error
        }
      }
    }
  } finally {
    handleValidateError(error, shouldFocusOnError, el)
  }

  return error
}

