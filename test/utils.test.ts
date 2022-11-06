import setWith from 'lodash.setwith'
import { expect, test } from 'vitest'
import { getPath } from '../packages/core/src/utils/getPath'

test('getPath', () => {
  const obj = {}
  const key = 'user[0].name'
  setWith(obj, key, {
    inputValue: '',
  })

  expect(obj).toMatchInlineSnapshot(`
    {
      "user": [
        {
          "name": {
            "inputValue": "",
          },
        },
      ],
    }
  `)

  expect(getPath(key, obj)).toMatchInlineSnapshot(`
    {
      "inputValue": "",
    }
  `)
})
