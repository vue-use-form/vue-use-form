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
})

const resolver = useYupResolver(schema)

const {
  register,
  formState: { errors },
} = useForm({
  resolver,
  mode: 'onChange',
})
</script>

<template>
  <input :="register('name')">
</template>

```
