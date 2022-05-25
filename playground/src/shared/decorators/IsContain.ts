import type { ValidationOptions } from 'class-validator'
import { isString, registerDecorator } from 'class-validator'
import { isRegex } from './IsNotContain'

export function IsContain(code: string | RegExp, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isContain',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (isString(value)) {
            if (isRegex(code)) {
              return code.test(value)
            } else {
              return value.includes(code)
            }
          }
          return false
        },
      },
    })
  }
}
