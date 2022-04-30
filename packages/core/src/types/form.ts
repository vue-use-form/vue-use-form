import type { DefaultValues } from './utils'
import type { FieldErrors } from './errors'
import type { FieldValues } from './filed'

export type Mode = 'onSubmit' | 'onBlur' | 'onChange' | 'onTouched' | 'all'

export type CriteriaMode = 'firstError' | 'all'

export type TFiledValue = Record<string, any>

export type UseFormProps<TFieldValues, TContext> = Partial<{
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
  shouldFocusError: boolean
  shouldUnregister: boolean
  shouldUseNativeValidation: boolean
  criteriaMode: CriteriaMode
  delayError: number
}>

export type UseFormWatch<T> = T

export type UseFormClearErrors<T> = T

export type UseFormGetValues<T> = T

export type UseFormGetFieldState<T> = T

export type UseFormSetError<T> = T

export type UseFormSetValue<T> = T

export type UseFormTrigger<T> = T

export type UseFormResetField<T> = T

export type UseFormReset<T> = T

export type UseFormHandleSubmit<T> = T

export type UseFormUnregister<T> = T

export type UseFormRegister<T> = T

export type UseFormSetFocus<T> = T

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
  register: UseFormRegister<TFieldValues>
  setFocus: UseFormSetFocus<TFieldValues>
}

export interface FormState<TFieldValues> {
  isDirty: boolean
  // dirtyFields: FieldNamesMarkedBoolean<TFieldValues>
  isSubmitted: boolean
  isSubmitSuccessful: boolean
  submitCount: number
  // touchedFields: FieldNamesMarkedBoolean<TFieldValues>
  isSubmitting: boolean
  isValidating: boolean
  isValid: boolean
  errors: FieldErrors<TFieldValues>
}
