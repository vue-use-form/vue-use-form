export type FieldPathValue<FieldValues, FiledName extends keyof FieldValues> = FieldValues[FiledName]

declare const $NestedValue: unique symbol

export type NestedValue<TValue extends object = object> = {
  [$NestedValue]: never
} & TValue

export type DefaultValues<TFieldValues> = UnpackNestedValue<
  DeepPartial<TFieldValues>
  >

export type UnpackNestedValue<T> = T extends NestedValue<infer U>
  ? U
  : T extends Date | FileList | File | Blob
    ? T
    : T extends object
      ? { [K in keyof T]: UnpackNestedValue<T[K]> }
      : T

export type DeepPartial<T> = T extends Date | FileList | File | NestedValue
  ? T
  : { [K in keyof T]?: DeepPartial<T[K]> }

export type Keys<T> = keyof T
