import type { FieldErrors } from './errors'

export type ResolverResult<T> = FieldErrors<T>

export type Resolver<FieldValues extends object> = (
  values: Record<keyof FieldValues, any>,
) => Promise<ResolverResult<FieldValues>>
