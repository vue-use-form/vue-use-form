import { resolve } from 'path'

const r = (p: string) => resolve(__dirname, p)

export const alias: Record<string, string> = {
  'vue-use-form': r('./packages/core/src/'),
  '@vue-use-form/yup': r('./packages/resolver-yup/src/index.ts'),
  '@vue-use-form/class-validator': r('./packages/resolver-class-validator/src/index.ts'),
}
