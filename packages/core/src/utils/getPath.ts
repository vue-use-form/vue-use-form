import toPath from 'lodash.topath'
import { isUndefined } from '.'

export function getPath(
  path: string,
  obj: Record<string, any>,
  endIndex?: number
) {
  const paths = toPath(path)

  let res = obj

  for (const key of paths.slice(
    0,
    isUndefined(endIndex) ? paths.length : endIndex
  )) {
    res = res?.[key]
    if (!res) {
      return
    }
  }

  return res
}
