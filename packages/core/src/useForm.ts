import type { UseFormProps } from './types/form'
import type { FieldValues } from './types/filed'
import { createForm } from './logic/createForm'

export function useForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  >(
  props?: UseFormProps<TFieldValues, TContext>,
) {
  return {
    ...createForm<TFieldValues, TContext>(props),
  }
}
