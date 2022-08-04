## vue-use-form

## Install

```bash
# npm
npm i vue-use-form

# pnpm
pnpm i vue-use-form

# yarn
yarn add vue-use-form
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

