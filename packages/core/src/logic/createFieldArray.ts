import { reactive } from 'vue'
import type {
  ArrayFieldRegisterOptions,
  UseFieldArrayAppend,
  UseFieldArrayField,
  UseFieldArrayInsert,
  UseFieldArrayPrepend,
  UseFieldArrayProps,
  UseFieldArrayRemove,
  UseFieldArraySwap,
} from '../types/fieldArray'
import type { FieldValues } from '../types/filed'
import type { IsString } from '../types/utils'
import { isArray } from '../utils'

export function createFieldArray<TFieldsValues extends FieldValues = FieldValues>(
  _options: UseFieldArrayProps<TFieldsValues>,
) {
  type TFields = UseFieldArrayField<TFieldsValues>

  const { control } = _options

  const { register } = control

  const _fields = reactive([]) as TFields[]

  const _createFields = (fieldName: string, options: Partial<ArrayFieldRegisterOptions<TFieldsValues, IsString<keyof TFieldsValues>>> = {}) => {
    const registeredItem = register(fieldName, options)

    return {
      index: _fields.length,
      name: fieldName,
      model: registeredItem[0],
      ref: registeredItem[1],
      type: options.type || 'text',
    } as TFields
  }

  const append: UseFieldArrayAppend<TFieldsValues> = (fields) => {
    Object.entries(fields).forEach(([fieldName, options]) => {
      _fields.push(_createFields(fieldName, options))
    })
  }

  const prepend: UseFieldArrayPrepend<TFieldsValues> = (fields) => {
    Object.entries(fields).forEach(([fieldName, options]) => {
      _fields.unshift(_createFields(fieldName, options))
    })
  }

  const remove: UseFieldArrayRemove = (index) => {
    if (!isArray(index)) {
      index = [index]
    }
    index.forEach((item, index) => {
      _fields.splice(item - index, 1)
    })
  }

  const insert: UseFieldArrayInsert<TFieldsValues> = (startIndex, fields) => {
    Object.entries(fields).forEach(([fieldName, options], index) => {
      _fields.splice(startIndex + index, 0, _createFields(fieldName, options))
    })
  }

  const swap: UseFieldArraySwap = (from, to) => {
    const temp = _fields[from]
    _fields[from] = _fields[to]
    _fields[to] = temp
  }

  return {
    append,
    prepend,
    remove,
    insert,
    swap,
    fields: _fields,
  }
}
