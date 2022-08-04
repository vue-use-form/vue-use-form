import { resolve } from 'path'

const r = (p: string) => resolve(__dirname, p)

export const alias: Record<string, string> = {
  '@vue-use-form/core': r('./packages/core/src/'),
}
