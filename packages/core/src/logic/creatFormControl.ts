import type { Ref } from 'vue'
import { reactive, ref, unref, watch } from 'vue'
import type { Field, FieldValues } from '../types/filed'
import type {
  FieldNamesMarkedBoolean,
  FormState,
  MaybeRefAll,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormProps, UseFormRegister, UseFormReturn,
  UseFormUnregister,
} from '../types/form'
import type { FieldErrors } from '../types/errors'
import { isEmptyObject, isFunction, isNullOrUndefined } from '../utils'
import { get, set, unset } from '../utils/object'
import type { DefaultValues, UnpackNestedValue } from '../types/utils'
import { getValidationMode } from '../utils/getValidationMode'

import {
  createErrorHandler as createErrorHandlerUtil,
  createSubmitHandler as createSubmitHandlerUtil,
} from '../utils/createHandler'

import { VALIDATION_MODE } from '../shared/constant'
import { getFormEl } from '../utils/getFormEl'
import { unrefOptions } from '../utils/unrefOptions'
import { validateField } from './validate'

export function creatFormControl<TFieldValues extends FieldValues = FieldValues,
  TContext = any,
>(
  _props: Partial<MaybeRefAll<UseFormProps<TFieldValues, TContext>>>,
) {
  type FieldsKey = keyof TFieldValues
  type TFormState = FormState<TFieldValues>
  type TFormStateKey = keyof TFormState

  const _options = unrefOptions(_props) as UseFormProps<TFieldValues, TContext>

  const _fields = {} as Record<FieldsKey, Field>

  const _formState = reactive<TFormState>({
    isDirty: false,
    isValidating: false,
    dirtyFields: {} as FieldNamesMarkedBoolean<TFieldValues>,
    isSubmitted: false,
    submitCount: 0,
    isSubmitting: false,
    isSubmitSuccessful: false,
    isValid: false,
    isTouched: false,
    errors: {} as FieldErrors<TFieldValues>,
    touchedFields: {} as FieldNamesMarkedBoolean<TFieldValues>,
  }) as FormState<TFieldValues>

  const _defaultValues = _options.defaultValues || {} as DefaultValues<TFieldValues>

  const validationModeBeforeSubmit = getValidationMode(_options.mode!)
  const validationModeAfterSubmit = getValidationMode(_options.reValidateMode!)
  const shouldDisplayAllAssociatedErrors
    = _options.criteriaMode === VALIDATION_MODE.all

  const _setFormState = (props: { [K in TFormStateKey]?: TFormState[TFormStateKey] }) => {
    Object.entries(props).forEach(([key, val]) => {
      set(_formState, key as TFormStateKey, val)
    })
  }

  const _setFields = (name: FieldsKey, fieldOptions: Partial<Field>) => {
    const field = get(_fields, name)
    if (isNullOrUndefined(field)) {
      set(_fields, name, {})
    }
    set(_fields, name, { ...field, ...fieldOptions })
  }

  const _setValidating = (isValidating: boolean) => _setFormState({ isValidating })

  const _getDirtyFields = () => {}

  const _handleDirtyFields = () => {}

  const _validate = async (fieldName: FieldsKey, isValidateAllFields = false) => {
    if (isEmptyObject(_fields) || isNullOrUndefined(_fields[fieldName])) {
      return
    }

    const setValidating = (payload: boolean) => !isValidateAllFields && _setValidating(payload)

    setValidating(true)
    const res = await validateField(_fields[fieldName], unref(_options.shouldFocusError!), shouldDisplayAllAssociatedErrors)
    setValidating(false)
    if (Object.keys(res).length) {
      set(_formState.errors, fieldName, res)
    } else {
      unset(_formState.errors, fieldName as string)
    }
  }

  const _validateAllFields = async () => {
    _setValidating(true)
    for (const fieldName of Object.keys(_fields)) {
      await _validate(fieldName, true)
    }
    _setValidating(false)
  }

  const trigger = async (name: FieldsKey) => {
    await _validate(name)
  }

  const _onChange = async (name: FieldsKey) => {
    await trigger(name)
  }

  const register: UseFormRegister<TFieldValues, FieldsKey> = (fieldName, options) => {
    const defaultVal = get(_defaultValues, fieldName as string) || options?.value
    const model = ref(defaultVal)
    const elRef = ref<HTMLElement>()

    _setFields(fieldName, {
      inputValue: model,
      rule: options,
    })

    watch(model, async () => {
      _handleDirtyFields()
      if (validationModeBeforeSubmit.isOnChange) {
        await _onChange(fieldName)
      }
    })

    watch(elRef, (newRef) => {
      set(_fields, fieldName, { ..._fields[fieldName], el: getFormEl(newRef) })
    })

    return [model, elRef as Ref<HTMLElement>]
  }

  const unregister: UseFormUnregister<TFieldValues> = (fieldName, options) => {

  }

  const handleSubmit: UseFormHandleSubmit<TFieldValues> = (onSubmit, onError?) => {
    _setFormState({
      isSubmitting: true,
    })
    _formState.submitCount++
    return async (e) => {
      await _validateAllFields()
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

  return reactive({
    control: {
      _fields,
      _formState,
      register,
      trigger,
      unregister,
    },
    handleSubmit,
    createErrorHandler,
    createSubmitHandler,
    register,
    unregister,
    formState: _formState,
  })
}

