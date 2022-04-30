export const deleteProperty = <T extends object>(obj: T, prop: keyof T) => delete obj[prop]

export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'
export const isString = (val: unknown): val is string => typeof val === 'string'

export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'

export const isHTMLElement = (val: unknown): val is HTMLElement => val instanceof HTMLElement
