<h1 align="center">
vue-use-form(WIP)
</h1>

Inspired by [react-hook-form](https://react-hook-form.com/), if you love react-hook-form usage, come on and try it!

## Document

The usage is almost the same as that of the react-hook-form. you can go [react-hook-form](https://react-hook-form.com/) to check.

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
    - [ ] 🍉`useForm`
      - [ ] 🍎 register -> disabled -> setValueAsDate
    - [ ] 🍊`useFormState`
    - [ ] 🍋`useFieldArray`
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


const onSubmit = createSubmitHandler((data) => {
  console.log('validate success', data)
})

const onError = createErrorHandler((errors) => {
  console.log('validate error', errors)
})
</script>

<template>
  <form @submit.prevent="handleSubmit(onSubmit, onError)()">
    <input 
        :="register('age', {
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
