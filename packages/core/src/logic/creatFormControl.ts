import { computed, reactive, ref, unref, watch } from 'vue'
import type { Field, FieldValues } from '../types/filed'
import type { FieldNamesMarkedBoolean, FormState, UseFormProps, UseFormRegister, UseFormUnregister } from '../types/form'
import type { FieldErrors } from '../types/errors'
import { isEmptyObject } from '../utils'
import { get, set } from '../utils/object'
import type { DefaultValues } from '../types/utils'

export function creatFormControl<TFieldValues extends FieldValues = FieldValues,
  TContext = any,
>(
  _options: Partial<UseFormProps<TFieldValues, TContext>>,
) {
  type FieldsKey = keyof TFieldValues

  const _fields = {} as Record<FieldsKey, Field>

  const _formState = reactive<FormState<TFieldValues>>({
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

  const _validate = () => {}

  const trigger = () => {}

  const _onChange = (name: FieldsKey) => {
    console.log(_fields)
  }

  const register: UseFormRegister<TFieldValues, FieldsKey> = (fieldName, options) => {
    const defaultVal = get(_defaultValues, fieldName as string) || options?.value
    const model = ref(defaultVal)

    set(_fields, fieldName, {})

    _fields[fieldName].inputValue = model

    watch(model, (newModel) => {
      console.log(newModel)
    })

    return model
  }

  const unregister: UseFormUnregister<TFieldValues> = (fieldName, options) => {

  }

  return reactive({
    control: {
      _fields,
      _formState,
      register,
      trigger,
      unregister,
    },
    register,
  })
}

