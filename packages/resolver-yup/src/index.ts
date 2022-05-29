import type { FieldError } from 'vue-use-form/src/types/errors'
import type { AnySchema, SchemaOptions } from 'yup'

export function useYupResolver(
  schema: AnySchema,
  options: SchemaOptions<any>,
): FieldError {
  return async (): Promise<FieldError> => {}
}
