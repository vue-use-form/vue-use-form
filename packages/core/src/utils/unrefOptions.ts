import { unref } from 'vue'
import type { MaybeRefAll, UseFormProps } from '../types/form'

export function unrefOptions<T extends MaybeRefAll<Partial<UseFormProps<any, any>>>>(
  options: T,
) {
  const res = {} as T
  Object.entries(options).forEach(([key, value]) => {
    (res as any)[key] = unref(value)
  })

  return res
}

