import type { ValidationError, ValidatorOptions } from 'class-validator'
import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'

async function getErrors(
  instance: object,
  options: ValidatorOptions,
) {
  const errors = await validate(instance, options) as ValidationError[]

  const res = {} as any

  errors.forEach((error) => {
    const validateErrors = error.constraints || {}
    const errName = Object.keys(validateErrors as any)[0]
    const errMessage = validateErrors[errName]
    res[error.property] = { type: errName, message: errMessage }
  })

  return res
}

export function useClassValidator(
  ClassResolver: new () => any,
  resolverOptions: ValidatorOptions = {},
) {
  return async (
    values: Record<string, any>,
  ) => {
    const schema = plainToClass(ClassResolver, values)

    const errors = await getErrors(schema, resolverOptions)

    return errors || {}
  }
}
