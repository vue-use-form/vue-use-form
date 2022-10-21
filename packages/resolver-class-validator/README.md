# @vue-use-form/class-validator

## 📦Install
```bash
# npm
npm i @vue-use-form/class-validator class-validator class-transformer
# yarn
yarn add @vue-use-form/class-validator class-validator class-transformer
#pnpm
pnpm i @vue-use-form/class-validator class-validator class-transformer
```

> ⚠️ Remember to add these options to your `tsconfig.json`!

```
"strictPropertyInitialization": false,
"experimentalDecorators": true
```

```vue
<script lang="ts" setup>
import { IsEmail, IsString, Length } from 'class-validator'
import { useClassValidator } from '@vue-use-form/class-validator'
import { useForm } from 'vue-use-form'

class LoginForm {
  @IsString()
  @Length(3, 10)
    username: string

  @IsEmail()
    email: string
}

const resolver = useClassValidator()

const { register } = useForm<LoginForm>({
  resolver,
  mode: 'onChange',
})
</script>

<template>
  <form @submit.prevent="handleSubmit(onSubmit, onError)()">
    <input :="register('username')">
    <input :="register('email')">
  </form>
</template>
```
