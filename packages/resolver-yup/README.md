# @vue-use-form/yup

## 📦Install
```bash
# npm
npm i @vue-use-form/yup yup
```


```vue
<script lang="ts" setup>
import { useForm } from 'vue-use-form'
import * as yup from 'yup'
import { useYupResolver } from '@vue-use-form/yup'

const schema = yup.object().shape({
  name: yup.string().required(),
  age: yup.number().required().positive().integer(),
  email: yup.string().email(),
  website: yup.string().url(),
  createdOn: yup.date().default(() => {
    return new Date()
  }),
})

const resolver = useYupResolver(schema)

const {
  register,
  formState: { errors },
} = useForm({
  resolver,
  mode: 'onChange',
})

const [emailField] = register('email')
</script>

<template>
  <input v-model="emailField" />
  <input v-model="age" />
  <input v-model="email" />
  <input v-model="website" />
  <input v-model="createdOn" />
</template>

```
