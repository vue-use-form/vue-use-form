<h1 align="center">
vue-use-form(WIP)
</h1>

<p align="center">
 <a href="https://vue-form-docs.netlify.app/">Documentation</a>(🔨WIP...)
</p>
<p align="center">
 <a href="https://vue-form-cn.netlify.app/">中文文档</a>(🔨施工中...)
</p>


## 🎉Thanks [logaretm](https://github.com/logaretm) for giving us the name of lib

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
    - [ ] 🥝directive: `v-form`
    - [ ] 🍍schema
    - [ ] 🍎resolver
- [ ] Security
    - [ ] 🐯Unit test
- [ ] 🐼 Community(WIP...)
  - [ ] 🎋中文文档
  - [ ] 📖Documentation
- [ ] 🦊Compatible UI framework(A way to get `input/select/textarea` dom)
    - [ ] 🍤element-plus
    - [ ] 🍗ant-design-vue
    - [ ] 🥩vuetify
    - [ ] 🥓quasar
    - [ ] 🌮provide a function to let the user to get the dom
    - [ ] 🎨other UI framework...



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
  reset,
  handleSubmit,
  setError,
  clearErrors,
  setValue,
  setFocus,
  getValues,
  triggerValidate,
  getFieldState,
  unregister,
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

const [ageField, ageRef] = register('age', {
  required: 'Age is required!',
  min: { value: 18, message: 'Age must be at least 18' },
  max: { value: 10000, message: '?' },
  valueAsNumber: true,
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
    <input ref="ageRef" v-model="ageField" type="number" name="age">
    <button type="submit" v-text="'Submit'" />
  </form>
</template>
```

