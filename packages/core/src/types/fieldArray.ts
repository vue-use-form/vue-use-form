import type { FieldArrayPathValue } from './path/path';
import type { FieldArrayPath , FieldPath } from './path'
import type { FieldValues } from './filed'
import type { UseFormControl } from './form'

export interface UseFieldArrayField<
  TFieldValues extends FieldValues = FieldValues,
  FieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  index: number
  name: FieldName
}

export type UseFieldArrayProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
  TKeyName extends string = 'id',
> = {
  name: TFieldArrayName;
  keyName?: TKeyName;
  control?: UseFormControl<TFieldValues>;
  shouldUnregister?: boolean;
};

export type FieldArray<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
> = FieldArrayPathValue<TFieldValues, TFieldArrayName> extends
  | ReadonlyArray<infer U>
  | null
  | undefined
  ? U
  : never;


export type FieldPayload<
  TFieldValues extends FieldValues[] = FieldValues[],
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = TFieldName

export interface FieldArrayMethodOptions { 
  /**
   * should focus when field update
   * 
   * @default false
   */
  shouldFocus?: boolean 
}

export type UseFieldArrayInsert<TFieldValues extends FieldValues[]> = (
  startIndex: number,
  field: FieldPayload<TFieldValues>
) => void

export type UseFieldArrayAppend<TFieldValues extends FieldValues[]> = (
  field: FieldPayload<TFieldValues>,
  options?: FieldArrayMethodOptions,
) => void

export type UseFieldArrayPrepend<TFieldValues extends FieldValues[]> = (
  field: FieldPayload<TFieldValues>,
  options?: FieldArrayMethodOptions,
) => void

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
