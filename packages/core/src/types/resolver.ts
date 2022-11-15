import type { FieldValues } from './filed'
import type { FieldPath } from './path'
import type { FieldErrors } from './errors'

export type ResolverResult<T> = FieldErrors<T>

export type ResolverValues<
  TFieldName extends FieldPath<FieldValues> = FieldPath<FieldValues>
> = Record<TFieldName, any>

export type Resolver<TFieldValues extends FieldValues> = <
  FieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  values: ResolverValues<FieldName>
) => Promise<ResolverResult<FieldValues>>
