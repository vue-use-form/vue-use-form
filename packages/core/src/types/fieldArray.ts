import type { FieldValues } from './filed'
import type { UseFormControl } from './form'
import type { IsString } from './utils'
import type { RegisterOptions } from './validator'

export type ArrayFieldRegisterOptions<
  TFieldValues extends FieldValues = FieldValues,
  FieldNames extends string = IsString<keyof TFieldValues>,
  > = RegisterOptions<TFieldValues, FieldNames> & { type: string }

export interface UseFieldArrayField<
  TFieldValues extends FieldValues = FieldValues,
  > {
  index: number
  name: keyof TFieldValues
}

export interface UseFieldArrayProps<FieldValues> {
  control: UseFormControl<FieldValues>
}

export type FieldPayload<
  TFieldValues extends FieldValues = FieldValues,
  FieldNames extends string = IsString<keyof TFieldValues>,
  > = {
    [K in FieldNames]?: ArrayFieldRegisterOptions<TFieldValues, FieldNames>
  }

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
