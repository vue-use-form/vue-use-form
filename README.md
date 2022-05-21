<h1 align="center">
vue-use-form
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

## LOG
### 2022/5/19
I'm trying to support the directive `v-form` to bind `register` function like this
```vue
<input v-form="register("username", {
 required: 'Username is required!'
})" />
```
But as for now, we can't make it work because of the mechanism of vue, i found another way to realize it by compiler
```vue
<script setup>
const { register } = useForm()
</script>
<template>
    <input v-form="register("username", {
     required: 'Username is required!'
    })" />
</template>
```
It will be transformed to
```vue
<script setup>
const { register, useRegister } = useForm()

const [_usernameField, _usernameRef] = useRegister()
</script>
<template>
    <input ref="_usernameRef" v-model="_usernameField()" />
</template>
```
But it will cost much time, So i decide to develop the form first.


## Online Example
[stackblitz](https://stackblitz.com/edit/vitejs-vite-ztou8m?file=src%2FApp.vue,src%2Fmain.ts&terminal=dev)

## Basic Example

Notice: The lib is still under development, so some API cannot get from `vue-use-form` package, you can clone this repo to your local, then you can use the latest feature.

```vue
<script setup lang="ts">
import { useForm } from 'vue-use-form'

interface Inputs {
  username: string
  password: string
  age: number
}

const {
  formState: { errors },
  createSubmitHandler,
  createErrorHandler,
  handleSubmit,
  register,
  useRegister
  useField,
} = useForm<Inputs>({
  mode: 'onChange',
})

const onSubmit = createSubmitHandler((data) => {
  console.log(data)
})

const onError = createErrorHandler((error) => {
  console.log(error)
})

const [passwordField, passwordRef] = useRegister('password', {
  required: { value: true, message: 'Password is required' },
  minLength: { value: 6, message: 'Password must be at least 6 characters' },
  maxLength: { value: 20, message: 'Password must be at most 20 characters' },
  validate: value => value.match(/^[a-zA-Z0-9]+$/),
})


</script>

<template>
  <form>
    <!-- v-form is still in WIP, we will create a plugin to support this feature -->
    <input
      v-form="register('username', {
      required: 'Username is required!',
      minLength: { value: 6, message: 'Username must be at least 6 characters' },
      maxLength: { value: 20, message: 'Username must be at most 20 characters' },
      validate: {
        isStartWithAt: (val) => val.startsWith('@'),
        isContainSharp: (val) => val.includes('#')
      },
    })"
    >
    <input v-model="passwordField" ref="passwordField">
    <button type="submit" @click="handleSubmit(onSubmit, onError)()">
      Submit
    </button>
  </form>
</template>
```
