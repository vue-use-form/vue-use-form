import type { Ref } from 'vue'
import type { DeepMap, DeepPartial, DefaultValues, UnpackNestedValue } from './utils'
import type { FieldErrors } from './errors'
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
  /*
  * Form Mode
  *
  * @default 'onSubmit'
  */
  mode: Mode
  reValidateMode: Exclude<Mode, 'onTouched' | 'all'>
  defaultValues: DefaultValues<TFieldValues>
  // resolver: Resolver<TFieldValues, TContext>
  context: TContext
  shouldFocusError: boolean | Ref<boolean>
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
  keepTouched: boolean
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

export type UseFormClearErrors<T> = T

export type UseFormGetValues<T> = T

export type UseFormGetFieldState<T> = T

export type UseFormSetError<T> = T

export type UseFormSetValue<T> = T

export type UseFormTrigger<T> = T

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
    > & { keepValue?: boolean; keepDefaultValue?: boolean; keepError?: boolean },
) => void

export type UseFormRegisterReturn<T> = Ref<T>

export type UseFormRegister<T extends FieldValues, K extends keyof T> = (name: K, options?: RegisterOptions) => UseFormRegisterReturn<T[K]>

export type UseFormSetFocus<T> = T

export type UseFormUseRegister<TFieldValues extends FieldValues> = (name: keyof TFieldValues, options: RegisterOptions) => UseFormRegister<TFieldValues, keyof TFieldValues>

export interface UseFormReturn<
  TFieldValues extends FieldValues = FieldValues,
  > {
  watch: UseFormWatch<TFieldValues>
  getValues: UseFormGetValues<TFieldValues>
  getFieldState: UseFormGetFieldState<TFieldValues>
  setError: UseFormSetError<TFieldValues>
  clearErrors: UseFormClearErrors<TFieldValues>
  setValue: UseFormSetValue<TFieldValues>
  trigger: UseFormTrigger<TFieldValues>
  formState: FormState<TFieldValues>
  resetField: UseFormResetField<TFieldValues>
  reset: UseFormReset<TFieldValues>
  handleSubmit: UseFormHandleSubmit<TFieldValues>
  unregister: UseFormUnregister<TFieldValues>
  register: UseFormRegister<TFieldValues, keyof TFieldValues>
  useRegister: UseFormUseRegister<TFieldValues>
  setFocus: UseFormSetFocus<TFieldValues>
}

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
  isTouched: boolean
  touchedFields: FieldNamesMarkedBoolean<TFieldValues>
}
