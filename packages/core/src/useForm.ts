import type { UseFormProps } from './types/form'
import type { FieldValues } from './types/filed'
import { createForm } from './logic/createForm'

export function useForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  >(
  props: Partial<UseFormProps<TFieldValues, TContext>> = {},
) {
  props = {
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {} as UseFormProps<TFieldValues, TContext>['defaultValues'],
    criteriaMode: 'firstError',
    shouldFocusError: true,
    shouldUnregister: false,
    shouldUseNativeValidation: false,
    delayError: undefined,
    ...props,
  }
  return {
    ...createForm<TFieldValues, TContext>(props as UseFormProps<TFieldValues, TContext>),
  }
}
