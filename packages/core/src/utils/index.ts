export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'

export const isNumber = (val: unknown): val is number => typeof val === 'number' && !isNaN(val)

export const isString = (val: unknown): val is string => typeof val === 'string'

export const isBoolean = (val: unknown): val is Boolean => typeof val === 'boolean'

export const isObject = (val: unknown) =>
  val !== null && typeof val === 'object'

export const isArray = (val: unknown): val is Array<unknown> => Array.isArray(val)

export const isEmptyObject = (val: unknown) =>
  isObject(val) && Object.keys(val as object).length === 0

export const isUndefined = (val: unknown): val is undefined => typeof val === 'undefined'

export const isNull = (val: unknown): val is null => val === null

export const isNullOrUndefined = (val: unknown) =>
  isNull(val) || isUndefined(val)

export const isHTMLElement = (val: unknown): val is HTMLElement => val instanceof HTMLElement

export const isEmpty = (val: unknown) => val === '' || val === null || val === undefined

export const isRegex = (val: unknown): val is RegExp => val instanceof RegExp

export const isObjectType = (val: unknown) => typeof val === 'object'

export const isPrimitive = (val: unknown) =>
  isNullOrUndefined(val) || !isObjectType(val)

export const isDateObject = (val: unknown): val is Date => val instanceof Date

export * from './createHandler'
export * from './object'
