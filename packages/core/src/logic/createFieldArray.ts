import { reactive } from 'vue'
import type {
  UseFieldArrayAppend,
  UseFieldArrayField,
  UseFieldArrayInsert,
  UseFieldArrayPrepend,
  UseFieldArrayProps,
  UseFieldArrayRemove,
  UseFieldArraySwap,
} from '../types/fieldArray'
import type { FieldValues } from '../types/filed'
import { isArray, set } from '../utils'

export function createFieldArray<TFieldsValues extends FieldValues = FieldValues>(
  _options: UseFieldArrayProps<TFieldsValues>,
) {
  type TFields = UseFieldArrayField<TFieldsValues>
  type TArrayField = TFieldsValues[typeof name] extends [infer R] ? R extends FieldValues ? R[] : FieldValues[] : FieldValues[]

  const { name, control } = _options

  const _fields = reactive([]) as TFields[]

  let fieldIndex = 0

  const _createFields = (
    fieldName: string,
    defaultVal: unknown,
  ) => {
    let index = fieldIndex
    fieldIndex++

    set(control._fieldArrayDefaultValues, index, defaultVal)

    return {
      index,
      name: fieldName,
    } as TFields
  }

  const append: UseFieldArrayAppend<TArrayField> = (fields) => {
    Object.entries(fields).forEach(([fieldName, defaultVal]) => {
      _fields.push(_createFields(fieldName, defaultVal))
    })
  }

  const prepend: UseFieldArrayPrepend<TArrayField> = (fields) => {
    Object.entries(fields).forEach(([fieldName, defaultVal]) => {
      _fields.unshift(_createFields(fieldName, defaultVal))
    })
  }

  const remove: UseFieldArrayRemove = (indexes) => {
    if (!isArray(indexes)) {
      indexes = [indexes]
    }
    for (const index of indexes) {
      const targetIndex = _fields.findIndex(field => field.index === index)

      if (targetIndex >= 0) {
        _fields.splice(targetIndex, 1)
      }
    }
  }

  const insert: UseFieldArrayInsert<TArrayField> = (startIndex, fields) => {
    const fieldsMap = Object.entries(fields).map(([fieldName, options]) => _createFields(fieldName, options))

    _fields.splice(startIndex, 0, ...fieldsMap)
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
