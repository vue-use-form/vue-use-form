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

## Try it online
🎮[play](https://stackblitz.com/edit/vitejs-vite-foumka?file=src%2FApp.vue,vite.config.ts,src%2Fmain.ts,package.json,src%2Fenv.d.ts&terminal=dev)

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

const { register, createSubmitHandler, createErrorHandler } = useForm<LoginForm>({
  resolver,
  mode: 'onChange',
})

const [usernameField] = register('username')
const [emailField] = register('email')

const onSubmit = createSubmitHandler((data) => {
  console.log(data)
})
const onError = createErrorHandler((errors) => {
  console.log(errors)
})
</script>

<template>
  <form @submit.prevent="handleSubmit(onSubmit, onError)()">
    <input v-model="usernameField">
    <input v-model="emailField">
  </form>
</template>
```
