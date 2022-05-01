export type DefaultValues<Value> = Value

export type FieldPathValue<FieldValues, FiledName extends keyof FieldValues> = FieldValues[FiledName]

export type Keys<T> = keyof T
