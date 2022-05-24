import type { Ref } from 'vue'
import type { DeepMap, DeepPartial, DefaultValues, UnpackNestedValue } from './utils'
import type { FieldError, FieldErrors } from './errors'
import type { FieldValues } from './filed'
import type { RegisterOptions } from './validator'

export type Mode = 'onSubmit' | 'onBlur' | 'onChange' | 'onTouched' | 'all'

export type CriteriaMode = 'firstError' | 'all'

export type TFiledValue = Record<string, any>

export type FieldNamesMarkedBoolean<TFieldValues extends FieldValues> = DeepMap<
  DeepPartial<TFieldValues>,
  boolean
  >

export interface UseFormProps<TFieldValues, TContext> {
  mode: Mode
  reValidateMode: Exclude<Mode, 'onTouched' | 'all'>
  defaultValues: DefaultValues<TFieldValues>
  // resolver: Resolver<TFieldValues, TContext>
  context: TContext
  shouldFocusError: boolean
  shouldUnregister: boolean
  shouldUseNativeValidation: boolean
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

export type UseFormWatch<T> = T

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

export type UseFormResetField<T> = T

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

export type UseFormRegisterReturn<T> = [Ref<T>, Ref<HTMLElement>]

export type UseFormRegister<T extends FieldValues, K extends keyof T> = (name: K, options?: RegisterOptions) => UseFormRegisterReturn<T[K]>

export type UseFormSetFocus<FieldValues> = (name: keyof FieldValues) => void

export type UseFormUseRegister<TFieldValues extends FieldValues> = (name: keyof TFieldValues, options: RegisterOptions) => UseFormRegister<TFieldValues, keyof TFieldValues>

// export interface UseFormReturn<
//   TFieldValues extends FieldValues = FieldValues,
//   > {
//   watch: UseFormWatch<TFieldValues>
//   getValues: UseFormGetValues<TFieldValues>
//   getFieldState: UseFormGetFieldState<TFieldValues>
//   setError: UseFormSetError<TFieldValues>
//   clearErrors: UseFormClearErrors<TFieldValues>
//   setValue: UseFormSetValue<TFieldValues>
//   trigger: UseFormTrigger<TFieldValues>
//   formState: FormState<TFieldValues>
//   resetField: UseFormResetField<TFieldValues>
//   reset: UseFormReset<TFieldValues>
//   handleSubmit: UseFormHandleSubmit<TFieldValues>
//   unregister: UseFormUnregister<TFieldValues>
//   register: UseFormRegister<TFieldValues, keyof TFieldValues>
//   useRegister: UseFormUseRegister<TFieldValues>
//   setFocus: UseFormSetFocus<TFieldValues>
// }

export interface FormState<TFieldValues> {
  isDirty: boolean
  dirtyFields: FieldNamesMarkedBoolean<TFieldValues>
  isSubmitted: boolean
  isSubmitSuccessful: boolean
  submitCount: number
  isSubmitting: boolean
  isValidating: boolean
  isValid: boolean
  errors: FieldErrors<TFieldValues>
}
