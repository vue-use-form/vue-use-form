import { isDateObject, isObject, isPrimitive } from './index'

export function deepEqual(obj1: any, obj2: any) {
  if (isPrimitive(obj1) || isPrimitive(obj2)) {
    return obj1 === obj2
  }

  if (isDateObject(obj1) && isDateObject(obj2)) {
    return obj1.getTime() === obj2.getTime()
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false
    }

    // avoid comparing HTMLElement
    if (key !== 'ref') {
      const val1 = obj1[key]
      const val2 = obj2[key]

      if (
        (isObject(val1) || isObject(val2))
        || (isObject(val1) && isObject(val2))
        || (isDateObject(val1) && isDateObject(val2))
          ? !deepEqual(val1, val2)
          : val1 !== val2
      ) {
        return false
      }
    }
  }

  return true
}
