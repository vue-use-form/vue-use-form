import { deepEqual } from '../src/utils/deepEqual'

describe('utils', () => {
  test('deepEqual', () => {
    const obj1 = { foo: { value: 2, date: new Date() } }
    const obj2 = { foo: { value: 2, date: new Date() } }

    expect(deepEqual(obj1, obj2)).toBe(true)
    expect(deepEqual(obj1, obj2)).toBe(true)
    obj2.foo.date = new Date(obj2.foo.date.getTime() + 1)
    expect(deepEqual(obj1, obj2)).toBe(false)
  })
})
