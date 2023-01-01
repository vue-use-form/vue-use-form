import { reactive } from 'vue'
import set from 'lodash.setwith'
import type { FieldArray } from '../types/fieldArray';
import type { FieldArrayPath } from '../types/path/path';
import type { FieldValues } from '../types/filed';


// _options: UseFieldArrayProps<TFieldValues, TFieldArrayName>
export function createFieldArray<
TFieldValues extends FieldValues = FieldValues,
TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
>() {
  // const { control, name } = _options

  const fields = reactive([])

  const updateField = (
    value: 
    Partial<FieldArray<TFieldValues, TFieldArrayName>>
    | Partial<FieldArray<TFieldValues, TFieldArrayName>>[],
    cb: (obj: any) => void
    ) => {
      if (!Array.isArray(value)) {
        value = [value]
      }
  
      value.forEach(v => {
        const obj = Object.create(null)
        Object.entries(v).forEach(([key, val]) => {
          set(obj, key, val)
        })
        cb(obj)
      })
    }

  const append = (
    value: 
      Partial<FieldArray<TFieldValues, TFieldArrayName>>
      | Partial<FieldArray<TFieldValues, TFieldArrayName>>[],
  ) => {
    updateField(value, (obj) => fields.push(obj))
  }

  const prepend = (
    value: 
    |  Partial<FieldArray<TFieldValues, TFieldArrayName>>
      | Partial<FieldArray<TFieldValues, TFieldArrayName>>[],
  ) => {
    updateField(value, (obj) => fields.unshift(obj))
  }

  const insert = (
    index: number, value: Partial<FieldArray<TFieldValues, TFieldArrayName>>
    | Partial<FieldArray<TFieldValues, TFieldArrayName>>[],
  ) => {
    updateField(value, (obj) => fields.splice(index, 0, obj))
  }

  const swap = (from: number, to: number) => {
    const temp = fields[from]
    fields[from] = fields[to]
    fields[to] = temp
  }

  const remove = (index?: number | number[]) => {
    if (!index) {
      fields.splice(0, fields.length)
      return
    }
    if (!Array.isArray(index)) {
      index = [index]
    }

    index.forEach(i => {
      fields.splice(i, 1)
    })
  }

  return {
    append,
    prepend,
    insert,
    swap,
    remove,
    fields,
  }
}
