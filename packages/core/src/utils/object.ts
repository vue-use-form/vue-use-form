export function set<T extends object, K extends keyof T>(
  obj: T,
  key: K,
  value: T[K] | any,
) {
  obj[key] = value

  return obj
}

export function get<T extends object, K extends keyof T>(
  obj: T,
  key: K,
): T[K] | undefined {
  return obj[key]
}

export function unset<T extends object, K extends keyof T>(
  obj: T,
  key: K,
) {
  delete obj[key]

  return obj
}

export const hasProp = <T extends object, K extends keyof T>(obj: T, key: K) => Reflect.has(obj, key)
