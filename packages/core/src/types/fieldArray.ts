import type { Field } from './filed'
import type { UseFormControl } from './form'

export type UseFieldArrayField = {
  id: number
} & Field

export interface UseFieldArrayProps<FieldValues> {
  control: UseFormControl<FieldValues>
}

export type FieldPayload<FieldValues> = {
  [K in keyof FieldValues]: FieldValues[K]
}

export type UseFieldArrayInsert<FieldValues> = (index: number, field: FieldPayload<FieldValues>) => void

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
  fields: UseFieldArrayField
}
