import type { FieldElement } from '../types/filed'

export const deleteProperty = <T extends object>(obj: T, prop: keyof T) => delete obj[prop]

export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'
export const isString = (val: unknown): val is string => typeof val === 'string'

export const isBoolean = (val: unknown): val is Boolean => typeof val === 'boolean'

export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'

export const isHTMLElement = (val: unknown): val is HTMLElement => val instanceof HTMLElement

export const isRadioInput = (el: FieldElement) => el.type === 'radio'

export const isCheckBoxInput = (el: FieldElement) => el.type === 'checkbox'

export const isEmpty = (val: unknown) => val === '' || val === null || val === undefined

