import type { ToRefs } from 'vue'
import type { FieldValues, Fields } from './filed'
import type { Resolver } from './resolver'
import type {
  DeepMap,
  DeepPartial,
  DefaultValues,
  UnpackNestedValue,
} from './utils'
import type { FieldError, FieldErrors } from './errors'
import type { RegisterOptions } from './validator'
import type { FieldPath, FieldPathValue } from './path'

export type Mode = 'onSubmit' | 'onBlur' | 'onChange' | 'onTouched' | 'all'

export type CriteriaMode = 'firstError' | 'all'

export type FieldNamesMarkedBoolean<TFieldValues extends FieldValues> = DeepMap<
  DeepPartial<TFieldValues>,
  boolean
>

declare const $NestedValue: unique symbol

export type NestedValue<TValue extends object = object> = {
  [$NestedValue]: never
} & TValue

export interface UseFormProps<TFieldValues extends object> {
  mode: Mode
  reValidateMode: Exclude<Mode, 'onTouched' | 'all'>
  defaultValues: Partial<DefaultValues<TFieldValues>>
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
  event?: Event
) => any | Promise<any>

export type SubmitErrorHandler<TFieldValues extends FieldValues> = (
  errors: FieldErrors<TFieldValues>,
  event?: Event
) => any | Promise<any>

export type UseFormHandleSubmit<TFieldValues extends FieldValues> = (
  onValid: SubmitHandler<TFieldValues>,
  onInvalid?: SubmitErrorHandler<TFieldValues>
) => (e?: Event) => Promise<void>

export type UseFormClearErrors<FieldName> = (
  fieldName?: FieldName | FieldName[]
) => void

export type GetValuesReturn<TFieldValues extends FieldValues> = {
  [K in keyof TFieldValues]: TFieldValues[K] extends NestedValue<infer U>
    ? U
    : TFieldValues[K]
}

export type UseFormGetValues<FieldValues, FieldKeys> = (
  fieldNames?: FieldKeys | FieldKeys[]
) => GetValuesReturn<FieldValues>

export interface GetFieldStateReturn {
  isDirty: boolean
  isValid: boolean
  error?: FieldError
}

export type UseFormGetFieldState<FieldKeys> = (
  fieldName: FieldKeys
) => GetFieldStateReturn

export type UseFormSetError<FieldName> = (
  name: FieldName,
  error: FieldError,
  config?: { shouldFocusError: boolean }
) => void

export type UseFormSetValue<TFieldValues extends FieldValues> = <
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  name: TFieldName,
  value: FieldPathValue<TFieldValues, TFieldName>,
  options?: {
    shouldValidate?: boolean
    shouldDirty?: boolean
  }
) => Promise<void>

export type UseFormTriggerValidateOptions = {
  shouldFocus?: boolean
}

export type UseFormTriggerValidate<
  TFieldValues extends FieldValues,
  FieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = (
  fieldNames?: FieldName | FieldName[],
  options?: UseFormTriggerValidateOptions
) => Promise<void>

export type UseFormResetField<TFieldValues extends FieldValues> = <
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  name: TFieldName,
  options?: Partial<{
    keepDirty: boolean
    keepTouched: boolean
    keepError: boolean
    defaultValue: any
  }>
) => void

export type UseFormReset<TFieldValues extends FieldValues> = (
  values?:
    | DefaultValues<TFieldValues>
    | UnpackNestedValue<TFieldValues>
    | 'all',
  keepStateOptions?: KeepStateOptions
) => void

export type UseFormUnregister<TFieldValues extends FieldValues> = <
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  name?: TFieldName,
  options?: Omit<
    KeepStateOptions,
    | 'keepIsSubmitted'
    | 'keepSubmitCount'
    | 'keepValues'
    | 'keepDefaultValues'
    | 'keepErrors'
    | 'keepIsValid'
    | 'keepDirtyValues'
  > & { keepValue?: boolean; keepError?: boolean }
) => void

export interface UseFormRegisterReturn<
  T,
  BaseType = string | Date | number | T
> {
  value: BaseType
  onInput: (e: InputEvent) => void
  modelValue: BaseType
  'onUpdate:modelValue': (input: any) => void
}

// TODO solve register returnType problem
export type UseFormRegister<TFieldValues extends FieldValues> = <
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  name: TFieldName,
  options?: RegisterOptions<TFieldValues>
) => any // UseFormRegisterReturn<TFieldName>

export type UseFormSetFocus<
  TFieldValues extends FieldValues,
  FieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = (name: FieldName) => void

export type UseFormIsExistInErrors<
  TFieldValues extends FieldValues,
  FieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = (name: FieldName) => boolean

export interface UseFormHandlers<
  TFieldValues extends FieldValues,
  FieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  getValues: UseFormGetValues<TFieldValues, FieldName>
  getFieldState: UseFormGetFieldState<FieldName>
  setError: UseFormSetError<FieldName>
  clearErrors: UseFormClearErrors<FieldName>
  setValue: UseFormSetValue<TFieldValues>
  triggerValidate: UseFormTriggerValidate<FieldName>
  reset: UseFormReset<TFieldValues>
  handleSubmit: UseFormHandleSubmit<TFieldValues>
  unregister: UseFormUnregister<TFieldValues>
  register: UseFormRegister<TFieldValues>
  setFocus: UseFormSetFocus<FieldName>
  isExistInErrors: UseFormIsExistInErrors<FieldName>
}

export type FieldArrayDefaultValues = Record<number, any>

export type UseFormControl<TFieldValues extends FieldValues> = {
  _formState: ToRefs<FormState<TFieldValues>>
  _fieldArrayDefaultValues: FieldArrayDefaultValues
  _fields: Fields<TFieldValues, keyof TFieldValues>
} & UseFormHandlers<TFieldValues>

export type UseFormReturn<TFieldValues extends FieldValues> = {
  control: UseFormControl<TFieldValues>
  formState: ToRefs<FormState<TFieldValues>>
  fields: Fields<TFieldValues, keyof TFieldValues>
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
  defaultValues: DefaultValues<TFieldValues>
  errors: FieldErrors<TFieldValues>
}
