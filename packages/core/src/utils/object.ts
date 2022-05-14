export function set<T extends object, K extends keyof T>(
  obj: T,
  key: K,
  value: T[K] | any,
) {
  obj[key] = value

  return Reflect.set(obj, key, value)
}

export function get<T extends object, K extends keyof T>(
  obj: T,
  key: K,
): T[K] | undefined {
  return Reflect.get(obj, key)
}

export function unset<T extends object, K extends keyof T>(
  obj: T,
  key: K,
) {
  return Reflect.deleteProperty(obj, key)
}

export const hasProp = <T extends object, K extends keyof T>(obj: T, key: K) => Reflect.has(obj, key)
