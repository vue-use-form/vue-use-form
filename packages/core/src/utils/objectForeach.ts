export function objectForeach<T extends object>(
  object: T,
  callback: ([key, val]: [key: keyof T, val: T[keyof T]], index: number, array: [string, any][]) => void,
) {
  Object.entries(object).forEach(callback as (value: [string, any], index: number, array: [string, any][]) => void)
}

