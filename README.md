<h1 align="center">
vue-composable-form
</h1>


<p align="center">
 <a href="https://vue-form-docs.netlify.app/">Documentation</a>(🔨under construction...)
</p>
<p align="center">
 <a href="https://vue-form-cn.netlify.app/">中文文档</a>(🔨施工中...)
</p>

## Install

```bash
# npm
npm i @vue-composable-form/core

# pnpm
pnpm i @vue-composable-form/core

# yarn
yarn add @vue-composable-form/core
```

## Base Example

```vue

<script setup lang="ts">
import { useForm } from './packages/core/src/index.ts';

interface Inputs {
  username: string
  password: string
}

const {
  formState: { errors },
  createSubmitHandler,
  createErrorHandler,
  handleSubmit,
  register,
} = useForm<Inputs>({
  mode: 'onChange',
})

const onSubmit = createSubmitHandler((data) => {
  console.log(data)
})

const onError = createErrorHandler((error) => {
  console.log(error)
})

const passwordField = register('password', {
  required: { value: true, message: 'Password is required' },
  minLength: { value: 6, message: 'Password must be at least 6 characters' },
  maxLength: { value: 20, message: 'Password must be at most 20 characters' },
  validate: (value) => value.match(/^[a-zA-Z0-9]+$/),
})

</script>

<template>
  <form>
    <input :="register('username', {
      required: 'Username is required!',
      minLength: { value: 6, message: 'Username must be at least 6 characters' },
      maxLength: { value: 20, message: 'Username must be at most 20 characters' },
      validate: {
        isStartWithAt: (val) => val.startsWith('@'),
        isContainSharp: (val) => val.includes('#') 
      },
    })"/>
    <input :="passwordField()"/>
    <button type="submit" @click="handleSubmit(onSubmit, onError)()">Submit</button>
  </form>
</template>


```
