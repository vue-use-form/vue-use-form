import type { UseFormControl } from './form'
import type { RegisterOptions } from './validator'

export type UseFieldArrayField<TFieldValues> = {
  index: number
  name: keyof TFieldValues
} & {
  [FieldName in keyof TFieldValues]: RegisterOptions<TFieldValues, FieldName extends string ? FieldName : never>
}

export interface UseFieldArrayProps<FieldValues> {
  control: UseFormControl<FieldValues>
}

export type FieldPayload<FieldValues> = Omit<UseFieldArrayField<FieldValues>, 'index' | 'name'>

export type UseFieldArrayInsert<FieldValues> = (startIndex: number, field: FieldPayload<FieldValues>) => void

export type UseFieldArrayAppend<FieldValues> = (obj: FieldPayload<FieldValues>) => void

export type UseFieldArrayPrepend<FieldValues> = (obj: FieldPayload<FieldValues>) => void

export type UseFieldArrayRemove = (id: number | number[]) => void

export type UseFieldArrayMove = (from: number, to: number) => void

export type UseFieldArraySwap = (from: number, to: number) => void

export interface UseFieldArrayReturn<FieldValues> {
  move: UseFieldArrayMove
  insert: UseFieldArrayInsert<FieldValues>
  remove: UseFieldArrayRemove
  prepend: UseFieldArrayPrepend<FieldValues>
  append: UseFieldArrayAppend<FieldValues>
  swap: UseFieldArraySwap
  fields: UseFieldArrayField<FieldValues>[]
}
