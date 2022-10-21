import type { UseFormProps } from './types/form'
import type { FieldValues } from './types/filed'

import { creatFormControl } from './logic/creatFormControl'

export function useForm<TFieldValues extends FieldValues = FieldValues>(
  props: Partial<UseFormProps<TFieldValues>> = {},
) {
  props = {
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {} as UseFormProps<TFieldValues>['defaultValues'],
    criteriaMode: 'firstError',
    shouldFocusError: true,
    delayError: 0,
    ...props,
  }
  return {
    ...creatFormControl<TFieldValues>(props as UseFormProps<TFieldValues>),
  }
}
