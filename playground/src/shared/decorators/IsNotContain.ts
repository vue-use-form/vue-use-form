import type { ValidationOptions } from 'class-validator'
import { isString, registerDecorator } from 'class-validator'

export const isRegex = (val: unknown): val is RegExp => val instanceof RegExp

export function IsNotContain(code: string | RegExp, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNotContain',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (isString(value)) {
            if (isRegex(code)) {
              return !code.test(value)
            } else {
              return !value.includes(code)
            }
          }
          return true
        },
      },
    })
  }
}
