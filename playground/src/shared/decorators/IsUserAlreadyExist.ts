import type { ValidationOptions } from 'class-validator'
import { isString, registerDecorator } from 'class-validator'
import { checkUserIsAlreadyExist } from '../../service/api/user'

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsUserAlreadyExist',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate: async (value: any) => {
          if (isString(value)) {
            return await checkUserIsAlreadyExist()
          }
          return false
        },
      },
    })
  }
}
