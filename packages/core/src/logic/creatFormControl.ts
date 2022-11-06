import { nextTick, reactive, ref, toRefs, unref } from 'vue'
import setWith from 'lodash.setwith'
import toPath from 'lodash.topath'
import { VALIDATION_MODE } from '../shared/constant'
import {
  get,
  isArray,
  isEmptyObject,
  isFunction,
  isNullOrUndefined,
  isNumber,
  isString,
  isUndefined,
  set,
  unset,
} from '../utils'
import { InvalidDate } from '../utils/constant'

import { deepEqual } from '../utils/deepEqual'
import { isRadioOrCheckboxInput } from '../utils/fieldElement'
import { getFormEl } from '../utils/getFormEl'
import { getValidationMode } from '../utils/getValidationMode'
import { isFieldElement } from '../utils/isFieldElement'

import { warn } from '../utils/warn'
import { handleValidateError, validateField } from './validate'
import type { RegisterOptions } from '../types/validator'
import type { DefaultValues, UnpackNestedValue } from '../types/utils'
import type {
  FieldNamesMarkedBoolean,
  FormState,
  GetValuesReturn,
  UseFormClearErrors,
  UseFormGetFieldState,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormProps,
  UseFormRegister,
  UseFormReset,
  UseFormReturn,
  UseFormSetError,
  UseFormSetFocus,
  UseFormSetValue,
  UseFormTriggerValidate,
  UseFormUnregister,
} from '../types/form'
import type { Field, FieldElement, FieldValues, Fields } from '../types/filed'
import type { FieldError, FieldErrors } from '../types/errors'

export function creatFormControl<
  TFieldValues extends FieldValues = FieldValues
>(_options: Partial<UseFormProps<TFieldValues>>): UseFormReturn<TFieldValues> {
  type FieldsKey = keyof TFieldValues
  type TFormState = FormState<TFieldValues>
  type TFormStateKey = keyof TFormState

  const _fields = {} as Fields<TFieldValues, FieldsKey>

  const _formState = reactive<TFormState>({
    isDirty: false,
    isValidating: false,
    dirtyFields: {} as FieldNamesMarkedBoolean<TFieldValues>,
    isSubmitted: false,
    submitCount: 0,
    isSubmitting: false,
    isSubmitSuccessful: false,
    isValid: false,
    defaultValues: _options.defaultValues || {},
    errors: {} as FieldErrors<TFieldValues>,
  }) as TFormState

  const _defaultValues =
    _options.defaultValues || ({} as DefaultValues<TFieldValues>)
  const _fieldArrayDefaultValues = {} as DefaultValues<TFieldValues>

  const validationModeBeforeSubmit = getValidationMode(_options.mode!)
  const shouldDisplayAllAssociatedErrors =
    _options.criteriaMode === VALIDATION_MODE.all

  const _setFormState = (props: { [K in TFormStateKey]?: TFormState[K] }) => {
    Object.entries(props).forEach(([key, val]) => {
      _formState[key] = val
    })
  }

  const _setFormStateError = (fieldName: FieldsKey, error: FieldError) => {
    setWith(_formState.errors, fieldName, error)
  }

  const _getFormStateError = (fieldName?: FieldsKey) =>
    fieldName ? get(_formState.errors, fieldName) : _formState.errors

  const _removeFormStateError = (fieldName: FieldsKey) => {
    if (isEmptyObject(_formState.errors)) {
      return
    }

    const paths = toPath(fieldName)

    if (paths.length !== 1) {
      let error: any = _formState.errors
      for (const path of paths.slice(0, -1)) {
        error = error[path]
      }
      unset(error, paths.at(-1))
    } else {
      unset(_formState.errors, fieldName)
    }
  }

  const _setFields = (name: FieldsKey, fieldOptions: Partial<Field>) => {
    // init field
    const field = get(_fields, name)
    if (isNullOrUndefined(field)) set(_fields, name, {})

    set(_fields, name, { ...field, ...fieldOptions })
  }

  const _getDefaultValue = (field: FieldsKey) => {
    return _defaultValues[field]
  }

  const _setValidating = (isValidating: boolean) =>
    _setFormState({ isValidating })

  const _getFieldDom = (name: FieldsKey) => {
    return _fields[name].el.value as FieldElement | undefined
  }

  const _isDirtyField = (fieldName: FieldsKey) => {
    const field = _fields[fieldName]

    if (!field) {
      return false
    }

    const inputVal = field.inputValue.value
    const defaultVal = _getDefaultValue(fieldName)
    const el = field.el.value

    if (!isUndefined(defaultVal)) {
      if (isRadioOrCheckboxInput(el)) {
        return inputVal !== defaultVal && el.checked !== defaultVal
      } else {
        return inputVal !== defaultVal
      }
    }

    if (isRadioOrCheckboxInput(el)) {
      return inputVal !== el.checked
    } else {
      return inputVal !== ''
    }
  }

  const _getDirtyFields = (handleIsDirty = true) => {
    const dirtyFields = {} as TFormState['dirtyFields']

    Object.keys(_fields).forEach((key) => {
      if (_isDirtyField(key)) {
        set(dirtyFields, key, true)
      } else {
        unset(dirtyFields, key)
        _fields[key].isDirty = false
      }
    })

    if (handleIsDirty) {
      _setFormState({
        isDirty: !isEmptyObject(dirtyFields),
      })
    }

    return dirtyFields
  }

  const _handleDirtyField = (fieldName: FieldsKey) => {
    if (_fields[fieldName].isUnregistered) return

    const defaultVal = get(_defaultValues, fieldName as string)
    const val = _fields[fieldName].inputValue.value

    if (deepEqual(defaultVal, val)) {
      _setFields(fieldName, {
        isDirty: false,
      })
    } else {
      _setFields(fieldName, {
        isDirty: true,
      })
    }
  }

  // validate `isDirty` must via this function
  const _handleAllDirtyFieldsOperate = (
    fieldNames?: FieldsKey | FieldsKey[]
  ) => {
    if (isUndefined(fieldNames)) {
      Object.keys(_fields).forEach((fieldName) => {
        _handleDirtyField(fieldName)
      })
    } else if (!isArray(fieldNames)) {
      fieldNames = [fieldNames]

      fieldNames.forEach((fieldName) => {
        _handleDirtyField(fieldName)
      })
    }

    // update dirtyFields
    _setFormState({
      dirtyFields: _getDirtyFields(),
    })
  }

  const _handleIsValidFields = () => {
    _setFormState({
      isValid: isEmptyObject(_formState.errors),
    })
  }

  const _validate = async (
    fieldName: FieldsKey,
    isValidateAllFields = false
  ) => {
    const field = _fields[fieldName]

    if (isEmptyObject(_fields) || isNullOrUndefined(field)) {
      return
    }

    if (field.rule.disabled) {
      field.inputValue.value = ''
      return
    }

    const setValidating = (payload: boolean) =>
      !isValidateAllFields && _setValidating(payload)
    const resolver = _options.resolver
    const el = unref(field.el)
    let res: FieldError = {}
    const { valueAsNumber, valueAsDate, setValueAs } = field.rule

    setValidating(true)

    if (isFieldElement(el)) {
      if (valueAsNumber) {
        const elVal = (el as HTMLInputElement).value
        set(
          field,
          'inputValue',
          ref(
            (el as HTMLInputElement).valueAsNumber || elVal === ''
              ? elVal
              : Number.parseFloat(elVal)
          )
        )
      } else if (valueAsDate) {
        set(
          field,
          'inputValue',
          ref((el as HTMLInputElement).valueAsDate || InvalidDate)
        )
      } else if (setValueAs) {
        const inputVal = unref(field.inputValue)
        set(field, 'inputValue', ref(inputVal))
      }

      if (isRadioOrCheckboxInput(el)) {
        set(field, 'inputValue', ref(el.checked))
      }
    }
    // resolver
    if (isFunction(resolver)) {
      const values = Object.fromEntries(
        Object.entries(_fields).map(([key, val]) => [key, val.inputValue.value])
      )
      const errors = await resolver(values as Record<keyof TFieldValues, any>)
      if (!isEmptyObject(errors)) res = errors[fieldName] as FieldError
    } else {
      res = await validateField(
        field,
        unref(_options.shouldFocusError!),
        shouldDisplayAllAssociatedErrors
      )
    }

    // Additional validation when using resolver
    if (
      isFunction(resolver) &&
      isEmptyObject(res) &&
      !isEmptyObject(_fields[fieldName].rule)
    )
      res = await validateField(
        field,
        unref(_options.shouldFocusError!),
        shouldDisplayAllAssociatedErrors
      )

    setValidating(false)

    // delayError
    if (_options.delayError && _options.delayError > 0) {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, _options.delayError)
      })
    }

    if (Object.keys(res || {}).length > 0) {
      _setFormStateError(fieldName, res)
    } else {
      _removeFormStateError(fieldName)
    }
  }

  const _validateAllFields = async () => {
    _setValidating(true)
    for (const fieldName of Object.keys(_fields))
      await _validate(fieldName, true)

    _setValidating(false)
  }

  const trigger = async (name?: FieldsKey) => {
    await (isString(name) ? _validate(name) : _validateAllFields())
  }

  const _onChange = async (name?: FieldsKey) => {
    _getDirtyFields()
    await trigger(name)

    _handleIsValidFields()
  }

  const triggerValidate: UseFormTriggerValidate<FieldsKey> = async (
    fieldNames
  ) => {
    if (isUndefined(fieldNames)) {
      await _validateAllFields()
    } else {
      if (!isArray(fieldNames)) {
        fieldNames = [fieldNames]
      }

      await Promise.all(fieldNames.map((name) => _validate(name)))
    }
  }

  const reset: UseFormReset<TFieldValues> = (values, keepStateOptions?) => {
    if (!values) {
      values = {} as DefaultValues<TFieldValues>
    }

    Object.entries(values).forEach(([key, val]) => {
      const el = _fields[key].el.value

      if (!keepStateOptions.keepDefaultValues) {
        _formState.defaultValues[key as keyof TFieldValues] = val
      }
      if (!keepStateOptions.keepValues) {
        _fields[key].inputValue.value = val
      }
      if (isRadioOrCheckboxInput(el)) {
        el.checked = val
      }
    })

    const dirtyFields = _getDirtyFields(false)

    if (!keepStateOptions) {
      keepStateOptions = {}
    }

    _setFormState({
      isSubmitted: keepStateOptions!.keepIsSubmitted
        ? _formState.isSubmitted
        : false,
      submitCount: keepStateOptions!.keepSubmitCount
        ? _formState.submitCount
        : 0,
      errors: keepStateOptions!.keepErrors ? _formState.errors : {},
      isDirty: keepStateOptions.keepDirtyValues
        ? _formState.isDirty
        : !isEmptyObject(dirtyFields),
      dirtyFields:
        keepStateOptions!.keepDirty || keepStateOptions.keepDirtyValues
          ? _formState.dirtyFields
          : dirtyFields,
      isSubmitting: false,
      isSubmitSuccessful: false,
      isValid: keepStateOptions!.keepIsValid ? _formState.isValid : false,
    })
  }

  const handleSubmit: UseFormHandleSubmit<TFieldValues> = (
    onSubmit,
    onError?
  ) => {
    _setFormState({
      isSubmitting: true,
    })
    _formState.submitCount++
    return async (e) => {
      // validate all fields
      await _onChange()
      _handleAllDirtyFieldsOperate()

      if (!isEmptyObject(_formState.errors) && isFunction(onError)) {
        await onError(_formState.errors, e)
        _setFormState({
          isSubmitting: false,
          isSubmitted: true,
        })

        return
      }

      const res: Record<string, any> = {}
      for (const fieldName of Object.keys(_fields)) {
        res[fieldName] = _fields[fieldName].inputValue
      }

      await onSubmit(_fields as UnpackNestedValue<TFieldValues>, e)
      _setFormState({
        isSubmitting: false,
        isSubmitted: true,
        isSubmitSuccessful: true,
      })
    }
  }

  const setError: UseFormSetError<FieldsKey> = (
    fieldName,
    error,
    config = { shouldFocusError: true }
  ) => {
    _setFormStateError(fieldName, {
      message: '',
      ...error,
      el: _fields[fieldName].el,
    } as FieldError)

    _setFormState({
      isValid: false,
    })

    if (config.shouldFocusError) {
      handleValidateError(error, true, _getFieldDom(fieldName))
    }
  }

  const clearErrors: UseFormClearErrors<FieldsKey> = (fieldName) => {
    if (isUndefined(fieldName)) {
      set(_formState, 'errors', {})
    } else {
      if (!isArray(fieldName)) {
        fieldName = [fieldName]
      }

      fieldName.forEach((name) => {
        _removeFormStateError(name)
      })
    }
  }

  const _setFieldsValue = (name: FieldsKey, value: TFieldValues[FieldsKey]) => {
    _fields[name].inputValue.value = value
  }

  const setValue: UseFormSetValue<TFieldValues, FieldsKey> = async (
    name,
    value,
    config = {}
  ) => {
    if (isNullOrUndefined(_fields[name])) {
      warn(`setValue cannot set not exist field #${name as string}`)
      return
    }

    config = {
      shouldValidate: true,
      shouldDirty: true,
      ...config,
    }

    _setFieldsValue(name, value)

    if (config.shouldDirty) _handleAllDirtyFieldsOperate(name)

    if (config.shouldValidate) await trigger(name)
  }

  const setFocus: UseFormSetFocus<TFieldValues> = (name) =>
    nextTick(() => {
      const el = _getFieldDom(name)

      if (el) el.focus()
    })

  const getValues: UseFormGetValues<FieldValues, FieldsKey> = (fieldNames) => {
    const res: GetValuesReturn<FieldValues, FieldsKey> = {}

    if (isUndefined(fieldNames)) {
      Object.entries(_fields).forEach(([name, field]) => {
        set(res, name, field.inputValue.value)
      })
    } else {
      if (!isArray(fieldNames)) fieldNames = [fieldNames]

      fieldNames.forEach((name) => {
        set(res, name as string, _fields[name].inputValue.value)
      })
    }

    return res
  }

  const getFieldState: UseFormGetFieldState<FieldsKey> = (fieldName) => {
    return {
      isValid: !isEmptyObject(_getFormStateError(fieldName)),
      isDirty: !isUndefined(_formState.dirtyFields[fieldName as string]),
      error: _getFormStateError(fieldName) || {},
    }
  }

  const register: UseFormRegister<TFieldValues> = (
    fieldName,
    options?: RegisterOptions
  ) => {
    if (isUndefined(options)) {
      options = {}
    }

    let isModelValue = false
    let field = get(_fields, fieldName)

    const { vModelBinding = 'modelValue' } = options

    const defaultVal =
      options?.value ||
      get(_defaultValues, fieldName as string) ||
      get(
        _fieldArrayDefaultValues,
        (fieldName as string)
          .split('.')
          .find((item) => isNumber(Number.parseInt(item)))
      ) ||
      ''

    if (!field) {
      _setFields(fieldName, {
        inputValue: ref(defaultVal),
        rule: options,
        isDirty: false,
        isUnregistered: false,
        el: ref(null),
      })
      field = get(_fields, fieldName)

      nextTick(() => {
        const el = field.el.value
        if (el instanceof HTMLElement && isRadioOrCheckboxInput(el)) {
          el.checked = defaultVal === '' ? false : defaultVal
        }
      })
    }

    const addEventListenerToElement = () => {
      if (isFieldElement(field.el) || _fields[fieldName].isUnregistered) {
        return
      }

      const el = getFormEl(field.el)
      _fields[fieldName].el.value = el

      if (isRadioOrCheckboxInput(el)) {
        set(_defaultValues, fieldName as string, !!defaultVal)
      }

      // bind validate mode
      if (isFieldElement(el)) {
        if (validationModeBeforeSubmit.isOnBlur) {
          el.addEventListener('blur', async () => {
            await _onChange(fieldName)
          })
        } else if (validationModeBeforeSubmit.isOnTouch) {
          el.addEventListener('click', async () => {
            await _onChange(fieldName)
          })
        }
      }
    }

    const handleValueChange = (input: InputEvent | any) => {
      field.inputValue.value = (input?.target as any)?.value || input || ''

      _handleAllDirtyFieldsOperate(fieldName)
      if (validationModeBeforeSubmit.isOnChange) {
        _onChange(fieldName)
      }
    }

    return {
      // avoid rebinding ref
      ...(!isFieldElement(field.el) && { ref: _fields[fieldName].el }),

      ...(vModelBinding === 'modelValue' && {
        value: field.inputValue.value,
        onInput: (e) => {
          if (_fields[fieldName].isUnregistered) return

          addEventListenerToElement()
          queueMicrotask(() => {
            if (!isModelValue) {
              handleValueChange(e.target?.value)
            }
          })
        },
      }),

      [vModelBinding]: field.inputValue.value,
      [`onUpdate:${vModelBinding}`]: (input: any) => {
        if (_fields[fieldName].isUnregistered) return

        isModelValue = true
        addEventListenerToElement()
        handleValueChange(input)
      },
    }
  }

  const unregister: UseFormUnregister<TFieldValues> = (
    fieldName,
    options = {}
  ) => {
    if (isNullOrUndefined(_fields[fieldName])) {
      warn(`cannot unregister not exist field #${fieldName as string}`)
      return
    }

    options = {
      keepDirty: false,
      keepError: false,
      keepValue: false,
      ...options,
    }

    if (!options.keepDirty) {
      unset(_formState.dirtyFields, fieldName as string)
    }

    if (!options.keepError) {
      unset(_formState.errors, fieldName as string)
    }

    if (!options.keepValue) {
      _setFieldsValue(
        fieldName as string,
        _defaultValues[fieldName] || ('' as any)
      )
    }

    set(_fields[fieldName as string], 'isUnregistered', true)
  }

  const isExistInErrors = (fieldName: keyof TFieldValues) =>
    Object.keys(_formState.errors).includes(fieldName as string)

  return {
    control: {
      _fields,
      _formState: toRefs(_formState),
      _fieldArrayDefaultValues,
      handleSubmit,
      register,
      unregister,
      reset,
      setError,
      clearErrors,
      setValue,
      setFocus,
      getValues,
      getFieldState,
      triggerValidate,
    },
    formState: toRefs(_formState),
    fields: _fields,
    handleSubmit,
    register,
    unregister,
    reset,
    setError,
    clearErrors,
    setValue,
    setFocus,
    getValues,
    getFieldState,
    triggerValidate,
    isExistInErrors,
  } as unknown as UseFormReturn<TFieldValues>
}
