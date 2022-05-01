import type { FieldError } from '../types/errors'
import {
  isCheckBoxInput,
  isEmpty,
  isFunction,
  isNullOrUndefined,
  isObject,
  isRadioInput,
  isRegex,
  isString,
} from '../utils'
import type { Field } from '../types/filed'
import { getValueAndMessage } from '../utils/transformMessage'
import { getValidatorError } from '../utils/getValidatorError'

export async function validateField(
  field: Field,
  validateAllFieldCriteria: boolean,
): Promise<FieldError> {
  const { inputValue } = field

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
  const isEmptyValue = isEmpty(inputValue)

  let error: FieldError = {}

  if (required && !isRadioOrCheckBox) {
    const { value, message } = getValueAndMessage(required)

    if (isEmptyValue && value) {
      error = {
        type: 'required',
        message,
        ref: el,
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

    if (!isNaN(inputValue)) {
      const inputNumber = (el as HTMLInputElement).valueAsNumber || +inputValue
      if (minValue && inputNumber < minValue)
        exceedMin = true
      if (maxValue && inputNumber > maxValue)
        exceedMax = true
    }
    else {
      if (isString(inputValue)) {
        const valueDate
          = (el as HTMLInputElement).valueAsDate || new Date(inputValue as string)

        if (minValue && valueDate < minValue)
          exceedMin = true
        if (maxValue && valueDate > maxValue)
          exceedMax = true
      }
    }

    if (exceedMax || exceedMin) {
      error = {
        type: exceedMax ? 'max' : 'min',
        message: exceedMax ? maxMsg : minMsg,
        ref: el,
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
        ref: el,
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
        ref: el,
      }

      if (!validateAllFieldCriteria)
        return error
    }
  }

  if (validate) {
    if (isFunction(validate)) {
      const result = await validate(inputValue)
      const validateResult = getValidatorError(result, el)

      if (validateResult)
        error = validateResult

      if (!validateAllFieldCriteria)
        return error
    } else if (isObject(validate)) {
      for (const key in validate) {
        const result = await validate[key](inputValue)
        const validateResult = getValidatorError(result, el, key)

        if (validateResult)
          error = validateResult

        if (!validateAllFieldCriteria)
          return error
      }
    }
  }

  return error
}

