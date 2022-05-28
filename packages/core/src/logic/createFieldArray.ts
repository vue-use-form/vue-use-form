import { computed, reactive } from 'vue'
import type {
  UseFieldArrayAppend,
  UseFieldArrayField, UseFieldArrayInsert,
  UseFieldArrayPrepend,
  UseFieldArrayProps, UseFieldArrayRemove, UseFieldArraySwap,
} from '../types/fieldArray'
import type { FieldValues } from '../types/filed'
import { isArray } from '../utils'

export function createFieldArray<TFieldsValues extends FieldValues>(
  _options: UseFieldArrayProps<TFieldsValues>,
) {
  const { control } = _options

  const { register } = control

  const _fields = reactive([]) as UseFieldArrayField<TFieldsValues>[]
  const registeredFields = computed(() => _fields.map(field => register(field.name, field.options)))

  const append: UseFieldArrayAppend<TFieldsValues> = (fields) => {
    Object.entries(fields).forEach(([fieldName, options]) => {
      _fields.push({
        index: _fields.length,
        name: fieldName,
        [fieldName]: options,
      } as any)
    })
  }

  const prepend: UseFieldArrayPrepend<TFieldsValues> = (fields) => {
    Object.entries(fields).forEach(([fieldName, options]) => {
      _fields.unshift({
        index: _fields.length,
        name: fieldName,
        options,
      })
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
      _fields.splice(startIndex + index, 0, {
        index: startIndex,
        name: fieldName,
        options,
      })
    })
  }

  const swap: UseFieldArraySwap = (from, to) => {
    const temp = _fields[from]
    _fields[from] = _fields[to]
    _fields[to] = temp
  }

  return reactive({
    append,
    prepend,
    remove,
    insert,
    swap,
    fields: _fields,
    registeredFields,
  })
}
