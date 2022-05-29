import type { Ref } from 'vue'

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

export type NonUndefined<T> = T extends undefined ? never : T

export type IsAny<T> = 0 extends 1 & T ? true : false

export type DeepMap<T, TValue> = IsAny<T> extends true
  ? any
  : T extends Date | FileList | File | NestedValue
    ? TValue
    : T extends object
      ? { [K in keyof T]: DeepMap<NonUndefined<T[K]>, TValue> }
      : TValue

export type MaybeRef<T> = T | Ref<T>

export type IsString<Val> = Val extends string ? Val: never
