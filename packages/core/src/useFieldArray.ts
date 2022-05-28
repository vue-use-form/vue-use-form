import { createFieldArray } from './logic/createFieldArray'
import type { UseFieldArrayProps } from './types/fieldArray'
import type { FieldValues } from './types/filed'

export function useFieldArray<TFieldsValues extends FieldValues = FieldValues>(
  props: UseFieldArrayProps<TFieldsValues>,
) {
  return {
    ...createFieldArray(props),
  }
}
