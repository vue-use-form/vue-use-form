import type { Ref } from 'vue'
import { computed, reactive, ref, unref, watch, watchEffect } from 'vue'
import type {
  FieldNamesMarkedBoolean,

  FormState,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormHandleSubmit, UseFormProps,
  UseFormRegister,
  UseFormReset,
  UseFormReturn,
} from '../types/form'
import type { Field, FieldElement, FieldState, FieldValues } from '../types/filed'
import type { FieldError, FieldErrors } from '../types/errors'
import type { RegisterOptions } from '../types/validator'
import {
  isArray, isCheckBoxInput,
  isEmptyObject,
  isFunction,
  isHTMLElement,
  isNullOrUndefined,
  isRadioInput,
  isString,
} from '../utils'
import { VALIDATION_MODE } from '../shared/constant'
import { getValidationMode } from '../utils/getValidationMode'
import type { DefaultValues, UnpackNestedValue } from '../types/utils'
import { createErrorHandler as createErrorHandlerUtil, createSubmitHandler as createSubmitHandlerUtil } from '../utils/createHandler'
import { get, hasProp, set, unset } from '../utils/object'
import { deepEqual } from '../utils/deepEqual'

import { validateField } from './validate'

const onModelValueUpdate = 'onUpdate:modelValue'

// TODO: Refactor with v-model bind, i made a mistake, it don't need the dom necessary
export function createForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  >(
  _options: UseFormProps<TFieldValues, TContext>,
) {
  type FieldsKey = keyof TFieldValues
  type TFormState = FormState<TFieldValues>
  type TFormStateKey = keyof TFormState

  const fields = reactive<Partial<Record<keyof TFieldValues, Field>>>({}) as Record<keyof TFieldValues, Field>

  const fieldsState = {} as Partial<Record<FieldsKey, FieldState>>

  const _fields = new Map<FieldsKey, Field>()

  const _formState = reactive<FormState<TFieldValues>>({
    isDirty: false,
    isValidating: false,
    dirtyFields: {} as FieldNamesMarkedBoolean<TFieldValues>,
    isSubmitted: false,
    submitCount: 0,
    isSubmitting: false,
    isSubmitSuccessful: false,
    isValid: false,
    isTouched: unref(computed(() => !isEmptyObject(_formState.touchedFields))),
    errors: {} as FieldErrors<TFieldValues>,
    touchedFields: {} as FieldNamesMarkedBoolean<TFieldValues>,
  }) as FormState<TFieldValues>

  const _defaultValues = _options.defaultValues!

  const validationModeBeforeSubmit = getValidationMode(_options.mode!)
  const validationModeAfterSubmit = getValidationMode(_options.reValidateMode!)
  const shouldDisplayAllAssociatedErrors
    = _options.criteriaMode === VALIDATION_MODE.all

  const _setFormState = (props: { [K in TFormStateKey]?: TFormState[TFormStateKey] }) => {
    (Object.keys(props) as TFormStateKey[]).forEach((key) => {
      set(_formState, key, props[key])
    })
  }

  const _getDefaultVal = (name: keyof TFieldValues) => {
    return get(_options.defaultValues, name as string) ?? ''
  }

  const _transformRef = (ref: Ref<FieldElement | any>) => {
    const unwrap = unref(ref)
    let el

    if (isHTMLElement(unwrap)) {
      el = unwrap
    }
    else if (isHTMLElement(unwrap?.$el)) {
      el = unwrap.$el
    }
    else if (isHTMLElement(unwrap?.ref?.value)) {
      el = unwrap.ref.value
    }

    if ((el as FieldElement)?.tagName === 'INPUT' || (el as FieldElement)?.tagName === 'SELECT' || (el as FieldElement)?.tagName === 'TEXTAREA')
      return el

    return el.querySelectorAll('input, select, textarea')[0]
  }

  const _validateFieldByName = async (fieldName: keyof TFieldValues, isValidateAllFields = false) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    cleanupUnRegister()
    if (isEmptyObject(fields) || isNullOrUndefined(fields[fieldName])) {
      return
    }
    !isValidateAllFields && set(_formState, 'isValidating', true)
    const res = await validateField(fields[fieldName], shouldDisplayAllAssociatedErrors, unref(_options.shouldFocusError)!)
    !isValidateAllFields && set(_formState, 'isValidating', false)
    if (Object.keys(res).length) {
      (_formState.errors[fieldName] as FieldError) = res
    } else {
      unset(_formState.errors, fieldName as string)
    }
  }

  const _validateFields = async () => {
    for (const fieldName of Object.keys(fields)) {
      set(_formState, 'isValidating', true)
      await _validateFieldByName(fieldName, true)
      set(_formState, 'isValidating', false)
    }
  }

  const _resetFields = (fieldsName: FieldsKey | FieldsKey[], keepDirty = false) => {
    if (!isArray(fieldsName)) {
      fieldsName = [fieldsName]
    }

    for (const name of fieldsName) {
      const defaultVal = get(_options.defaultValues, name as string)
      const field = get(fields, name as string)
      const el = field?.ref
      let inputVal = get(field!, 'resetVal') || defaultVal

      if (!el) {
        return
      }

      if (isCheckBoxInput(el)) {
        inputVal = el.checked
      }

      set(fields[name as string], 'inputValue', inputVal)
      set(fields[name as string], 'resetVal', inputVal)
      set(fields[name as string], 'resetCount', (get(fields[name as string], 'resetCount') || 0) + 1)

      if (!keepDirty && deepEqual(inputVal, defaultVal)) {
        unset(_formState.dirtyFields, name as string)
      }
    }
  }

  const _getInputValues = (names: FieldsKey | FieldsKey[]) => {
    if (!isArray(names)) {
      names = [names]
    }

    const res: Record<FieldsKey, any> = {} as any

    names.forEach((name) => {
      set(res, name, get(fields[name], 'inputValue'))
    })

    return res
  }

  const _getDirtyFields = () => {
    const inputValues = _getInputValues(Object.keys(fields) as TFormStateKey[])

    function getPureFieldsOnInputValues() {
      const res: Record<keyof TFieldValues, any> = {} as any

      Object.entries(inputValues).forEach(([field, value]) => {
        if (!hasProp(_formState.dirtyFields, field)) {
          set(res, field, value)
        }
      })

      return res
    }

    const pureValues = getPureFieldsOnInputValues()

    const dirtyFields: TFormState['dirtyFields'] = {} as any

    Object.keys(inputValues).forEach((field) => {
      if (!hasProp(pureValues, field)) {
        set(dirtyFields, field, true)
      }
    })

    return dirtyFields
  }

  const _handleDirtyFields = (name: keyof TFieldValues, evt: InputEvent | string) => {
    const inputVal = isString(evt) ? evt : (evt.target as FieldElement).value
    const defaultVal = _getDefaultVal(name)

    if (defaultVal === inputVal) {
      set(_formState, 'isDirty', false)
      unset(_formState.dirtyFields, name as string)
    } else {
      set(_formState, 'isDirty', true)
      set(_formState.dirtyFields, name as string, true)
    }
  }

  const _handleTouchedFields = (name: keyof TFieldValues) => {
    set(_formState, 'touchedFields', { ...get(_formState, 'touchedFields'), [name]: true })
  }

  const reset: UseFormReset<TFieldValues> = (values, keepStateOptions?) => {
    if (!keepStateOptions) {
      keepStateOptions = {} as any
    }

    const setFormState = () => {
      const dirtyFields = _getDirtyFields()

      _setFormState({
        isSubmitted: !!keepStateOptions!.keepIsSubmitted,
        submitCount: keepStateOptions!.keepSubmitCount ? _formState.submitCount : 0,
        errors: keepStateOptions!.keepErrors ? _formState.errors : {},
        isDirty: keepStateOptions!.keepDirty ? _formState.isDirty : Object.keys(dirtyFields).length > 0,
        dirtyFields: keepStateOptions!.keepDirty ? _formState.dirtyFields : dirtyFields,
        isSubmitting: false,
        isSubmitSuccessful: false,
      })
    }

    if (!values || values === 'all') {
      _resetFields(Object.keys(fields))
      setFormState()
      return
    }

    const keys: string[] = []
    ;(Object.keys(values) as (keyof TFieldValues)[]).forEach((key) => {
      set(fields[key], 'resetVal', (values as TFieldValues)[key])
      keys.push(key as string)
    })

    _resetFields(keys, !!keepStateOptions?.keepDirty)
    setFormState()
  }

  const getValues = (fields: keyof TFieldValues | (keyof TFieldValues)[]) => {
    if (isArray(fields)) {
      return fields.map(field => _getInputValues(field as string))
    }

    return _getInputValues(fields as string)
  }

  const onChange = async (name: keyof TFieldValues) => {
    _handleDirtyFields(name, fields[name].inputValue)
    _handleTouchedFields(name)
    set(_formState, 'isValidating', true)
    await _validateFieldByName(name)
    set(_formState, 'isValidating', false)

    if (isEmptyObject(_formState.errors)) {
      set(_formState, 'isValid', true)
    } else {
      set(_formState, 'isValid', false)
    }
  }

  const handleSubmit: UseFormHandleSubmit<TFieldValues> = (onSubmit, onError?) => {
    set(_formState, 'isSubmitting', true)
    _formState.submitCount++
    return async (e) => {
      await _validateFields()
      if (!isEmptyObject(_formState.errors)) {
        if (isFunction(onError)) {
          await onError(_formState.errors, e)
          set(_formState, 'isSubmitting', false)
          set(_formState, 'isSubmitted', true)
        }

        return
      }
      const res: Record<string, any> = {}
      for (const fieldName in fields) {
        res[fieldName] = fields[fieldName].inputValue
      }
      await onSubmit(fields as UnpackNestedValue<TFieldValues>, e)
      set(_formState, 'isSubmitting', false)
      set(_formState, 'isSubmitted', true)
      set(_formState, 'isSubmitSuccessful', true)
    }
  }

  const createErrorHandler = (fn: SubmitErrorHandler<TFieldValues>) => createErrorHandlerUtil<TFieldValues>(fn)
  const createSubmitHandler = (fn: SubmitHandler<TFieldValues>) => createSubmitHandlerUtil<TFieldValues>(fn)

  const unRegisterSet = new Set<keyof TFieldValues>()

  const register: UseFormRegister<TFieldValues, FieldsKey> = (fieldName, options) => {
    const defaultVal = get(_defaultValues, fieldName as string) || options?.value
    const model = ref(defaultVal)

    _fields[fieldName].inputValue = model

    watch(model, () => {
      _onChange()
    })

    return model
  }

  const unregister = (fieldsName: keyof TFieldValues | (keyof TFieldValues)[]) => {
    if (!isArray(fieldsName)) {
      fieldsName = [fieldsName]
    }

    fieldsName.forEach(fieldName => unRegisterSet.add(fieldName))
  }

  const useField = (name: keyof TFieldValues, options: RegisterOptions & { ref?: Ref<FieldElement> }) => {
    const modelVal = ref(_getDefaultVal(name) || options.value || (fields[name] || {}).inputValue || '') as Ref
    set(fields, name, {} as Field)
    set(fields[name], 'ref', options.ref || null)
    unset(options, 'ref')
    set(fields[name], 'rule', options)

    watch(modelVal, (newVal) => {
      set(fields[name], 'inputValue', newVal)
      if (validationModeBeforeSubmit.isOnChange) {
        onChange(name)
      }
    })

    watchEffect(() => {
      if (fields[name].resetCount) {
        modelVal.value = get(fields, 'resetVal') || ''
      }
    })

    return modelVal
  }

  const useRegister = (name: keyof TFieldValues, options: RegisterOptions) => () => register(name, options)

  const cleanupUnRegister = () => {
    for (const fieldName of unRegisterSet) {
      unset(_formState.errors, fieldName as string)
      unset(fields, fieldName as string)
      unset(_formState.dirtyFields, fieldName as string)
    }
  }

  return reactive({
    _formState,
    register,
    unregister,
    useField,
    useRegister,
    handleSubmit,
    createSubmitHandler,
    createErrorHandler,
    reset,
    getValues,
  })
}

