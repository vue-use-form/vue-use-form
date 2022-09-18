<h1 align="center">
vue-use-form(WIP)
</h1>


## 🎉Thanks [logaretm](https://github.com/logaretm) for giving us the name of lib

## Document

The usage is almost the same as that of the react book form. you can go [react-hook-form](https://react-hook-form.com/) to check.

## Install

```bash
# npm
npm i vue-use-form

# pnpm
pnpm i vue-use-form

# yarn
yarn add vue-use-form
```

## 🚀Features
- 🦾 Type Strong: Written in TypeScript
- 🏆 No Component: No need to import any components to use, you can use it in all UI framework
- 😍 Easy to use: Just 3 main hooks: useForm, useFormState, useFieldArray

## TODO

- [ ] 🐵Main features
    - [x] 🍉`useForm`
    - [ ] 🍊`useFormState`
    - [ ] 🍋`useFieldArray`
    - [x] 🥝directive: `v-form`
    - [ ] 🍎schema
        - [x] 🍵 class-validator
        - [x] 🍶 Yup
- [ ] Test
    - [ ] 🐯Unit test
- [ ] 🐼 Community(WIP...)
  - [ ] 🎋中文文档
  - [ ] 📖Documentation .


## 🎁Try it online
🎮[play with element-plus](https://stackblitz.com/edit/vitejs-vite-typsyz?file=src%2Fmain.ts,src%2FApp.vue,package.json&terminal=dev) by default way.

🎮[play with class-validator](https://stackblitz.com/edit/vitejs-vite-foumka?file=src%2FApp.vue,vite.config.ts,src%2Fmain.ts,package.json,src%2Fenv.d.ts&terminal=dev) by using `class-validator` resolver

## 🚣playground
you can fork/download this repo, and then just 3 steps can make playground run
```bash
# 1. open this repo folder in your local
# 2. init dependencies
pnpm i
# 3. open the playground folder and run `dev` script or
pnpm run dev
```

## Quick Start

```vue
<script setup lang="ts">
import { useForm } from 'vue-use-form'

interface Inputs {
  username: string
  password: string
  age: number
}

const {
  formState,
  register,
  createSubmitHandler,
  createErrorHandler,
} = useForm<Inputs>({
  mode: 'onChange',
  shouldFocusError: true,
})

const [usernameField, usernameRef] = register('username', {
  required: 'Username is required!',
  minLength: { value: 3, message: 'Username must be at least 3 characters' },
  maxLength: { value: 10, message: 'Username must be at most 10 characters' },
  validate: (value) => {
    if (value === 'admin') {
      return 'Username is reserved!'
    }
  },
})

const [passwordField, passwordRef] = register('password', {
  required: 'Password is required!',
  minLength: { value: 8, message: 'Password must be at least 8 characters' },
  maxLength: { value: 20, message: 'Password must be at most 20 characters' },
  validate: {
    isContainLowercase: (value) => {
      if (!/[a-z]/.test(value)) {
        return 'Password must contain at least one lowercase letter'
      }
    },
    isContainUppercase: (value) => {
      if (!/[A-Z]/.test(value)) {
        return 'Password must contain at least one uppercase letter'
      }
    },
  },
})


const onSubmit = createSubmitHandler((data) => {
  console.log('validate success', data)
})

const onError = createErrorHandler((errors) => {
  console.log('validate error', errors)
})
</script>

<template>
  <form @submit.prevent="handleSubmit(onSubmit, onError)()">
    <input ref="usernameRef" v-model="usernameField" name="username">
    <input ref="passwordRef" v-model="passwordField" name="password">
    <input 
        v-form="register('age', {
          required: 'Age is required!',
          min: { value: 18, message: 'Age must be at least 18' },
          max: { value: 10000, message: '?' },
          valueAsNumber: true,
        })" 
        type="number" 
        name="age">
    <button type="submit" v-text="'Submit'" />
  </form>
</template>
```

## use with schema
- [@vue-use-form/class-validator](https://github.com/vue-use-form/vue-use-form/tree/master/packages/resolver-class-validator)
- [@vue-use-form/yup](https://github.com/vue-use-form/vue-use-form/tree/master/packages/resolver-yup)

## use with unplugin-vForm
- [@vue-use-form/v-form](https://github.com/vue-use-form/vue-use-form/tree/master/packages/unplugin-vForm)
```vue
<script setup lang="ts">
import {useForm} from 'vue-use-form'

const {
  register,
  formState: {errors},
} = useForm<{
  email: string
  age: number
}>({
  mode: 'onChange',
})

</script>

<template>
  <input v-form="register('email', {
    required: true
  })">
  <input v-form="register('age', {
    required: true,
  })">
</template>
```
