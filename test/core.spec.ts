import { mount } from '@vue/test-utils'
import { describe, expect, it, test } from 'vitest'
import { useForm } from 'vue-use-form'
import Login from './components/Login.vue'

describe('useForm', () => {
  it('should be defined', () => {
    expect(useForm).to.toBeDefined()
  })

  test('formState', () => {
    const wrapper = mount(Login)

    expect(wrapper.get('input').text()).toMatchInlineSnapshot('""')
  })
})
