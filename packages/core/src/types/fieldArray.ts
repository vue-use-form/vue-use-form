import type { FieldValues } from './filed'
import type { UseFormControl } from './form'

export interface UseFieldArrayField<
  TFieldValues extends FieldValues = FieldValues,
  > {
  index: number
  name: keyof TFieldValues
}

export interface UseFieldArrayProps<TFieldValues extends FieldValues> {
  control: UseFormControl<TFieldValues>
  name: keyof TFieldValues
}

export type FieldPayload<
  TFieldValues extends FieldValues[] = FieldValues[],
  FieldNames extends string = TFieldValues extends (infer R)[] ? keyof R : '',
  > = {
    [K in FieldNames]?: TFieldValues extends (infer R)[] ? R[keyof R]: never
  }

export type UseFieldArrayInsert<TFieldValues extends FieldValues[]> = (startIndex: number, field: FieldPayload<TFieldValues>) => void

export type UseFieldArrayAppend<TFieldValues extends FieldValues[]> = (field: FieldPayload<TFieldValues>) => void

export type UseFieldArrayPrepend<TFieldValues extends FieldValues[]> = (field: FieldPayload<TFieldValues>) => void

export type UseFieldArrayRemove = (id: number | number[]) => void

export type UseFieldArraySwap = (from: number, to: number) => void

export interface UseFieldArrayReturn<FieldValues> {
  insert: UseFieldArrayInsert<FieldValues[]>
  remove: UseFieldArrayRemove
  prepend: UseFieldArrayPrepend<FieldValues[]>
  append: UseFieldArrayAppend<FieldValues[]>
  swap: UseFieldArraySwap
  fields: UseFieldArrayField<FieldValues>[]
}
