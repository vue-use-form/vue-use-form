import type { Ref } from 'vue'
import { nextTick, reactive, ref, unref } from 'vue'
import type { Field, FieldElement, FieldValues, Fields } from '../types/filed'
import type {
  FieldNamesMarkedBoolean,
  FormState,
  GetValuesReturn,
  SubmitErrorHandler,
  SubmitHandler,
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
import type { FieldError, FieldErrors } from '../types/errors'
import {
  get,
  isArray,
  isEmptyObject,
  isFunction,
  isNullOrUndefined,
  isString,
  isUndefined,
  set,
  unset,
} from '../utils'
import { isRadioOrCheckboxInput } from '../utils/fieldElement'
import { isFieldElement } from '../utils/isFieldElement'
import type { DefaultValues, UnpackNestedValue } from '../types/utils'
import { getValidationMode } from '../utils/getValidationMode'

import {
  createErrorHandler as createErrorHandlerUtil,
  createSubmitHandler as createSubmitHandlerUtil,
} from '../utils/createHandler'

import { VALIDATION_MODE } from '../shared/constant'
import { getFormEl } from '../utils/getFormEl'

import { deepEqual } from '../utils/deepEqual'
import { handleValidateError, validateField } from './validate'

export function creatFormControl<TFieldValues extends FieldValues = FieldValues>(
  _options: Partial<UseFormProps<TFieldValues>>,
): UseFormReturn<TFieldValues> {
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
    errors: {} as FieldErrors<TFieldValues>,
  }) as FormState<TFieldValues>

  const _defaultValues = _options.defaultValues || {} as DefaultValues<TFieldValues>

  const validationModeBeforeSubmit = getValidationMode(_options.mode!)
  const shouldDisplayAllAssociatedErrors
    = _options.criteriaMode === VALIDATION_MODE.all

  const _setFormState = (props: { [K in TFormStateKey]?: TFormState[TFormStateKey] }) => {
    Object.entries(props).forEach(([key, val]) => {
      set(_formState, key as TFormStateKey, val)
    })
  }

  const _setFormStateError = (fieldName: FieldsKey, error: FieldError) => {
    set(_formState.errors, fieldName, error)
  }

  const _getFormStateError = (fieldName?: FieldsKey) => fieldName ? get(_formState.errors, fieldName) : _formState.errors

  const _removeFormStateError = (fieldName: FieldsKey) => {
    unset(_formState.errors, fieldName)
  }

  const _setFields = (name: FieldsKey, fieldOptions: Partial<Field>) => {
    // init field
    const field = get(_fields, name)
    if (isNullOrUndefined(field)) {
      set(_fields, name, {})
    }

    set(_fields, name, { ...field, ...fieldOptions })
  }

  const _setValidating = (isValidating: boolean) => _setFormState({ isValidating })

  const _getFieldProp = (name: FieldsKey, prop: keyof Field) => {
    return get(_fields[name], prop)
  }

  const _getFieldDom = (name: FieldsKey) => {
    return _getFieldProp(name, 'el') as Ref<FieldElement> | undefined
  }

  const _getDirtyFields = () => {
    const dirtyFields = {} as TFormState['dirtyFields']

    Object.entries(_fields).forEach(([key, val]) => {
      if (val.isDirty) {
        set(dirtyFields, key, true)
      }
    })

    return dirtyFields
  }

  const _handleDirtyField = (fieldName: FieldsKey) => {
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

  // validate field the `isDirty` prop must via this function
  const _handleAllDirtyFieldsOperate = (fieldNames?: FieldsKey | FieldsKey[]) => {
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

  const _validate = async (fieldName: FieldsKey, isValidateAllFields = false) => {
    if (isEmptyObject(_fields) || isNullOrUndefined(_fields[fieldName])) {
      return
    }

    const setValidating = (payload: boolean) => !isValidateAllFields && _setValidating(payload)

    const resolver = _options.resolver

    setValidating(true)
    let res: FieldError = {}
    if (isFunction(resolver)) {
      const values = Object.fromEntries(Object.entries(_fields).map(([key, val]) => [key, val.inputValue.value]))
      const errors = await resolver(values as Record<keyof TFieldValues, any>)
      if (!isEmptyObject(errors)) {
        res = errors[fieldName] as FieldError
      }
    } else {
      res = await validateField(_fields[fieldName], unref(_options.shouldFocusError!), shouldDisplayAllAssociatedErrors)
    }

    // Additional validation when using resolver
    if (isFunction(resolver) && isEmptyObject(res) && !isEmptyObject(_fields[fieldName].rule)) {
      res = await validateField(_fields[fieldName], unref(_options.shouldFocusError!), shouldDisplayAllAssociatedErrors)
    }
    setValidating(false)
    if (Object.keys(res || {}).length) {
      _setFormStateError(fieldName, res)
    } else {
      _removeFormStateError(fieldName)
    }
  }

  const _validateAllFields = async () => {
    _setValidating(true)
    for (const fieldName of Object.keys(_fields)) {
      await _validate(fieldName, true)
    }
    _setValidating(false)
  }

  const trigger = async (name?: FieldsKey) => {
    await (isString(name) ? _validate(name) : _validateAllFields())
  }

  const _onChange = async (name?: FieldsKey) => {
    await trigger(name)

    _handleIsValidFields()
  }

  const triggerValidate: UseFormTriggerValidate<FieldsKey> = async (fieldNames) => {
    if (isUndefined(fieldNames)) {
      await _validateAllFields()
    } else {
      if (!isArray(fieldNames)) {
        fieldNames = [fieldNames]
      }

      await Promise.all(fieldNames.map(name => _validate(name)))
    }
  }

  const reset: UseFormReset<TFieldValues> = (values, keepStateOptions?) => {
    if (!keepStateOptions) {
      keepStateOptions = {} as any
    }

    if (!values) {
      values = {} as DefaultValues<TFieldValues>
    }

    const setFormState = () => {
      const dirtyFields = _getDirtyFields()

      _setFormState({
        isSubmitted: keepStateOptions!.keepIsSubmitted ? _formState.isSubmitted : false,
        submitCount: keepStateOptions!.keepSubmitCount ? _formState.submitCount : 0,
        errors: keepStateOptions!.keepErrors ? _formState.errors : {},
        isDirty: keepStateOptions!.keepDirty ? _formState.isDirty : !isEmptyObject(dirtyFields),
        dirtyFields: keepStateOptions!.keepDirty ? _formState.dirtyFields : dirtyFields,
        isSubmitting: false,
        isSubmitSuccessful: false,
        isValid: keepStateOptions!.keepIsValid ? _formState.isValid : false,
      })
    }

    Object.entries(values).forEach(([key, val]) => {
      _fields[key].inputValue.value = val
    })

    setFormState()
  }

  const handleSubmit: UseFormHandleSubmit<TFieldValues> = (onSubmit, onError?) => {
    _setFormState({
      isSubmitting: true,
    })
    _formState.submitCount++
    return async (e) => {
      // validate all fields
      await _onChange()
      _handleAllDirtyFieldsOperate()
      if (!isEmptyObject(_formState.errors)) {
        if (isFunction(onError)) {
          await onError(_formState.errors, e)
          _setFormState({
            isSubmitting: false,
            isSubmitted: true,
          })
        }

        return
      }
      const res: Record<string, any> = {}
      for (const fieldName in _fields) {
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

  const createErrorHandler = (fn: SubmitErrorHandler<TFieldValues>) => createErrorHandlerUtil<TFieldValues>(fn)
  const createSubmitHandler = (fn: SubmitHandler<TFieldValues>) => createSubmitHandlerUtil<TFieldValues>(fn)

  const setError: UseFormSetError<FieldsKey> = (fieldName, error, config) => {
    if (!config) {
      config = {
        shouldFocusError: true,
      }
    }

    _setFormStateError(fieldName, error)

    if (config.shouldFocusError) {
      handleValidateError(error, true, _getFieldDom(fieldName)?.value)
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

  const setValue: UseFormSetValue<TFieldValues, FieldsKey> = async (name, value, config) => {
    config = {
      shouldValidate: false,
      shouldDirty: false,
      ...(config || {}),
    }

    _setFieldsValue(name, value)

    if (config.shouldDirty) {
      _handleAllDirtyFieldsOperate(name)
    }
    if (config.shouldValidate) {
      await trigger(name)
    }
  }

  const setFocus: UseFormSetFocus<TFieldValues> = name => nextTick(() => {
    const el = unref(_getFieldDom(name))

    if (el) {
      el.focus()
    }
  })

  const getValues: UseFormGetValues<FieldValues, FieldsKey> = (fieldNames) => {
    const res: GetValuesReturn<FieldValues, FieldsKey> = {}

    if (isUndefined(fieldNames)) {
      Object.entries(_fields).forEach(([name, field]) => {
        set(res, name, field.inputValue.value)
      })
    } else {
      if (!isArray(fieldNames)) {
        fieldNames = [fieldNames]
      }

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

  const register: UseFormRegister<TFieldValues, FieldsKey> = (fieldName, options) => {
    if (isUndefined(options)) {
      options = {}
    }

    let isModelValue = false
    let field = get(_fields, fieldName)

    const defaultVal = options?.value || get(_defaultValues, fieldName as string) || ''

    if (!field) {
      _setFields(fieldName, {
        inputValue: ref(defaultVal),
        rule: options,
        isDirty: false,
        isUnregistered: false,
        el: ref(null),
      })

      field = get(_fields, fieldName)
    }

    function addEventListenerToElement() {
      if (!isFieldElement(field.el.value)) {
        if (_fields[fieldName].isUnregistered) {
          return
        }
        const el = getFormEl(field.el)
        _setFields(fieldName, { ..._fields[fieldName], el })

        if (isRadioOrCheckboxInput(el)) {
          set(_defaultValues, fieldName as string, !!defaultVal)
        }
        set(_defaultValues, fieldName as string, defaultVal)

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
    }

    return {
      value: field.inputValue.value,
      ref: field.el,
      onInput: async (e: InputEvent) => {
        if (_fields[fieldName].isUnregistered) {
          return
        }

        addEventListenerToElement()

        // make sure that only trigger onInput or onUpdate:modelValue
        queueMicrotask(async () => {
          if (!isModelValue) {
            field.inputValue.value = (e?.target as any)?.value || ''

            _handleAllDirtyFieldsOperate(fieldName)
            if (validationModeBeforeSubmit.isOnChange) {
              await _onChange(fieldName)
            }
          }
        })
      },
      'modelValue': field.inputValue.value,
      'onUpdate:modelValue': async (input: any) => {
        if (_fields[fieldName].isUnregistered) {
          return
        }

        addEventListenerToElement()

        isModelValue = true
        field.inputValue.value = input

        _handleAllDirtyFieldsOperate(fieldName)
        if (validationModeBeforeSubmit.isOnChange) {
          await _onChange(fieldName)
        }
      },
    }
  }

  const unregister: UseFormUnregister<TFieldValues> = (fieldName, options) => {
    options = {
      keepDirty: false,
      keepError: false,
      keepValue: false,
      ...({} || options),
    }

    if (!options.keepDirty) {
      unset(_formState.dirtyFields, fieldName as string)
    }

    if (!options.keepError) {
      unset(_formState.errors, fieldName as string)
    }

    if (!options.keepValue) {
      _setFieldsValue(fieldName as string, _defaultValues[fieldName as string])
    }

    _fields[fieldName as string].isUnregistered = true
  }

  const isExistInErrors = (fieldName: keyof TFieldValues) => Object.keys(_formState.errors).includes(fieldName as string)

  return reactive({
    control: {
      _fields,
      _formState,
      handleSubmit,
      createErrorHandler,
      createSubmitHandler,
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
    formState: _formState,
    handleSubmit,
    createErrorHandler,
    createSubmitHandler,
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
  }) as unknown as UseFormReturn<TFieldValues>
}
