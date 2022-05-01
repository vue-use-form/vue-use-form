import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import Form from './components/Form.vue'

describe('useForm', () => {
  test('base', () => {
    const wrapper = mount(Form)
    expect(1).toBe(1)
  })
})
