import { set } from 'vue-use-form'
import type { FieldErrors } from 'vue-use-form/src/types/errors'
import type { FieldValues } from 'vue-use-form/src/types/filed'
import type { Resolver } from 'vue-use-form/src/types/resolver'
import type { AnyObjectSchema, ValidationError } from 'yup'
import type { ValidateOptions } from 'yup/es/types'

type TValues<T extends FieldValues> = Record<keyof T, any>

async function parseYupSchema<T extends FieldValues>(
  schema: AnyObjectSchema,
  values: TValues<T>,
  options: ValidateOptions,
) {
  const errors: FieldErrors<T> = {}
  try {
    await schema.validate(values, options)
  } catch (errs) {
    (errs as ValidationError).inner.forEach((err: ValidationError) => {
      set(errors, err.path as keyof T, err.message)
    })
  }

  return errors
}

export function useYupResolver<T extends FieldValues>(
  schema: AnyObjectSchema,
  options: ValidateOptions = {},
): Resolver<T> {
  return async (
    values: TValues<T>,
  ): Promise<FieldErrors<T>> => {
    return parseYupSchema(schema, values, { abortEarly: false, ...options })
  }
}
