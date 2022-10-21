import type { FieldValues, Fields } from './filed'
import type { Resolver } from './resolver'
import type { DeepMap, DeepPartial, DefaultValues, UnpackNestedValue } from './utils'
import type { FieldError, FieldErrors } from './errors'
import type { RegisterOptions } from './validator'

export type Mode = 'onSubmit' | 'onBlur' | 'onChange' | 'onTouched' | 'all'

export type CriteriaMode = 'firstError' | 'all'

export type FieldNamesMarkedBoolean<TFieldValues extends FieldValues> = DeepMap<DeepPartial<TFieldValues>, boolean>

export interface UseFormProps<TFieldValues extends object> {
  mode: Mode
  reValidateMode: Exclude<Mode, 'onTouched' | 'all'>
  defaultValues: DefaultValues<TFieldValues>
  resolver: Resolver<TFieldValues>
  shouldFocusError: boolean
  shouldUnregister: boolean
  criteriaMode: CriteriaMode
  delayError: number
}

export type KeepStateOptions = Partial<{
  keepDirtyValues: boolean
  keepErrors: boolean
  keepDirty: boolean
  keepValues: boolean
  keepDefaultValues: boolean
  keepIsSubmitted: boolean
  keepIsValid: boolean
  keepSubmitCount: boolean
}>

export type SubmitHandler<TFieldValues extends FieldValues> = (
  data: UnpackNestedValue<TFieldValues>,
  event?: Event,
) => any | Promise<any>

export type SubmitErrorHandler<TFieldValues extends FieldValues> = (
  errors: FieldErrors<TFieldValues>,
  event?: Event,
) => any | Promise<any>

export type UseFormHandleSubmit<TFieldValues extends FieldValues> = (
  onValid: SubmitHandler<TFieldValues>,
  onInvalid?: SubmitErrorHandler<TFieldValues>,
) => (e?: Event) => Promise<void>

export type UseFormClearErrors<FieldName> = (fieldName?: FieldName | FieldName[]) => void

export type GetValuesReturn<FieldValues, FieldVal = FieldValues[keyof FieldValues]> = {
  [K in keyof FieldValues]: FieldVal
}

export type UseFormGetValues<FieldValues, FieldKeys> = (fieldNames?: FieldKeys | FieldKeys[]) => GetValuesReturn<FieldValues>

export interface GetFieldStateReturn {
  isDirty: boolean
  isValid: boolean
  error?: FieldError
}

export type UseFormGetFieldState<FieldKeys> = (fieldName: FieldKeys) => GetFieldStateReturn

export type UseFormSetError<FieldName> = (name: FieldName, error: FieldError, config?: { shouldFocusError: boolean }) => void

export type UseFormSetValue<FieldValues, FieldName extends keyof FieldValues, Value = FieldValues[FieldName]> = (
  name: FieldName,
  value: Value,
  config?: {
    shouldValidate?: boolean
    shouldDirty?: boolean
  }
) => Promise<void>

export type UseFormTriggerValidate<FieldKeys> = (fieldNames?: FieldKeys | FieldKeys[]) => Promise<void>

export type UseFormReset<TFieldValues extends FieldValues> = (
  values?: DefaultValues<TFieldValues> | UnpackNestedValue<TFieldValues> | 'all',
  keepStateOptions?: KeepStateOptions,
) => void

export type UseFormUnregister<TFieldValues extends FieldValues> = (
  name?: keyof TFieldValues,
  options?: Omit<
  KeepStateOptions,
  | 'keepIsSubmitted'
  | 'keepSubmitCount'
  | 'keepValues'
  | 'keepDefaultValues'
  | 'keepErrors'
  | 'keepIsValid'
  | 'keepDirtyValues'

  > & { keepValue?: boolean; keepError?: boolean },
) => void

export interface UseFormRegisterReturn<T, BaseType = string | Date | number | T> {
  value: BaseType
  onInput: (e: InputEvent) => void
  modelValue: BaseType
  'onUpdate:modelValue': (input: any) => void
}

// TODO solve register returnType problem
export interface UseFormRegister<T extends FieldValues> {
  (name: keyof T, options?: RegisterOptions): any // UseFormRegisterReturn<T[K]>
  (name: string, options?: RegisterOptions): any // UseFormRegisterReturn<T[K]>
}

export type UseFormSetFocus<FieldValues> = (name: keyof FieldValues) => void

export type UseFormIsExistInErrors<FieldValues> = (name: keyof FieldValues) => boolean

export interface UseFormHandlers<
  TFieldValues,
  FieldName = keyof TFieldValues,
  > {
  getValues: UseFormGetValues<TFieldValues, FieldName>
  getFieldState: UseFormGetFieldState<FieldName>
  setError: UseFormSetError<FieldName>
  clearErrors: UseFormClearErrors<FieldName>
  setValue: UseFormSetValue<TFieldValues, keyof TFieldValues>
  triggerValidate: UseFormTriggerValidate<FieldName>
  reset: UseFormReset<TFieldValues>
  handleSubmit: UseFormHandleSubmit<TFieldValues>
  unregister: UseFormUnregister<TFieldValues>
  register: UseFormRegister<TFieldValues>
  setFocus: UseFormSetFocus<TFieldValues>
  isExistInErrors: UseFormIsExistInErrors<TFieldValues>
}

export type FieldArrayDefaultValues = Record<number, any>

export type UseFormControl<TFieldValues extends FieldValues> = {
  _formState: FormState<TFieldValues>
  _fieldArrayDefaultValues: FieldArrayDefaultValues
  _fields: Fields<TFieldValues, keyof TFieldValues>
} & UseFormHandlers<TFieldValues>

export type UseFormReturn<TFieldValues extends FieldValues> = {
  control: UseFormControl<TFieldValues>
  formState: FormState<TFieldValues>
} & UseFormHandlers<TFieldValues>

export interface FormState<TFieldValues> {
  isDirty: boolean
  dirtyFields: FieldNamesMarkedBoolean<TFieldValues>
  isSubmitted: boolean
  isSubmitSuccessful: boolean
  submitCount: number
  isSubmitting: boolean
  isValidating: boolean
  isValid: boolean
  defaultValues: Partial<DefaultValues<TFieldValues>>
  errors: FieldErrors<TFieldValues>
}
